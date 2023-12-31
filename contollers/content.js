const { handlingError } = require("../error/error");
const content = require("../models/content");
const movieLists = require("../models/moviesListinSection");
const fs = require("fs");
const {
  uploadContentCloudinary,
  deleteContent,
} = require("../util/cloudinary");
const user = require("../models/user");
const watchList = require("../models/watchList");

exports.addNewContent = async (req, res, next) => {
  try {
    if (Object.keys(req.files).length < 4) {
      return next(new handlingError("Missing files", 404));
    }
    for (const field in JSON.parse(req.body.contentInfo)) {
      if (JSON.parse(req.body.contentInfo)[field] == "") {
        for (const key in req.files) {
          fs.unlinkSync(req.files[key][0].path);
        }
        return next(new handlingError(`${field} are required`, 500));
      }
    }
    const {
      title,
      description,
      year,
      languages,
      duration,
      type,
      director,
      genres,
      section,
      cast,
    } = JSON.parse(req.body.contentInfo);

    const cloudinaryData = await uploadContentCloudinary(req.files);

    const contentToCreate = {};
    cloudinaryData.forEach((value) => {
      contentToCreate[value.fieldname] = [
        {
          url: value.url,
          public_id: value.public_id,
        },
      ];
    });
    const newContent = await content.create({
      createBy: req.User._id,
      title: title,
      description: description,
      year: year,
      languages: languages,
      type: type,
      duration: duration,
      director: director,
      genres: genres,
      section: section,
      cast: cast,
      ...contentToCreate,
    });
    const movies = await movieLists.find({ title: newContent.section });
    if (movies) {
      movies.content.push(newContent._id);
      await movieLists.save();
    } else {
      await movieLists.create({
        title: newContent.section,
        content: [newContent._id],
      });
    }
    res.status(201).json({ message: "new Content added", data: newContent });
  } catch (error) {
    return next(new handlingError(error.message, 500));
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    let contentToCreate = {};
    let temp = {};

    if (req.files && Object.keys(req.files).length > 0) {
      const cloudinaryData = await uploadContentCloudinary(req.files);

      cloudinaryData.forEach((value) => {
        contentToCreate[value.fieldname] = [
          {
            url: value.url,
            public_id: value.public_id,
          },
        ];
      });
    }

    temp = JSON.parse(req.body.contentInfo);

    const updatedData = {
      ...temp,
      ...contentToCreate,
    };

    const Content = await content.findByIdAndUpdate(req.params.id, updatedData);

    if (Object.keys(contentToCreate).length > 0) {
      let deleteContentData = [];
      for (const key in contentToCreate) {
        if (Content[key]) {
          deleteContentData.push(Content[key][0].public_id);
        }
      }

      if (deleteContentData.length > 0) {
        await deleteContent(deleteContentData);
      }
    }

    if (!Content) {
      return next(new handlingError("Please Enter valid Content Id", 401));
    }

    res
      .status(201)
      .json({ success: true, message: "Content updated successfully" });
  } catch (error) {
    return next(
      new handlingError("Internal server error, please try again", 500)
    );
  }
};

exports.deleteContent = async (req, res, next) => {
  try {
    const Content = await content.findByIdAndDelete(req.params.id);
    if (!Content) {
      return next(new handlingError("please enter a valid id", 401));
    }
    res
      .status(200)
      .send({ sucess: true, message: "content deleted successfully" });
  } catch (error) {
    return next(new handlingError("internal server error try again", 500));
  }
};
exports.getContent = async (req, res, next) => {
  try {
    let Contents = await content.findOne({ _id: req.params.id });
    if (!Contents) {
      return next(new handlingError("please enter a valid id", 401));
    }
    const User = await watchList.findOne({ userId: req.User.id });
    let isFound = false;
    if (User.contentsId?.length) {
      for (let i = 0; i < User.contentsId.length; i++) {
        if (Contents._id.toString() === User.contentsId[i].content.toString()) {
          isFound = true;
          break;
        }
      }
    }
    Contents = { ...Contents.toObject(), isInWatchlist: isFound };

    res.status(200).json({ suceess: true, data: Contents });
  } catch (err) {
    console.log(err.message);
    return next(
      new handlingError("Internal Server Error Try Again Later", 500)
    );
  }
};

exports.getAllSectionViseContent = async (req, res, next) => {
  try {
    let pageNumber = parseInt(req.query.page) || 1;
    let limitPerPage = parseInt(req.query.limit) || 30;
    let skip = (pageNumber - 1) * limitPerPage;
    if (!req.query.section && !req.query.type) {
      return next(
        new handlingError("please provide movieListingsection name", 401)
      );
    }
    const AllContent = await content
      .find({ section: req.query.section, type: req.query.type })
      .sort("createdAt")
      .skip(skip)
      .limit(limitPerPage);
    return res.status(201).json({
      suceess: true,
      pageNumber: pageNumber,
      limitPerPage: limitPerPage,
      AllContent,
    });
  } catch (error) {
    return next(
      new handlingError("Internal Server Error Try Again Later", 500)
    );
  }
};

exports.getContentOverview = async (req, res, next) => {
  try {
    let aggregationPipeline = [];
    if (req.query.type) {
      aggregationPipeline = [
        { $match: { type: req.query.type } },
        { $sample: { size: 1 } },
      ];
    } else {
      aggregationPipeline = [{ $sample: { size: 1 } }];
    }
    const Content = await content.aggregate(aggregationPipeline);
    const User = await watchList.findOne({ userId: req.User.id });

    if (User) {
      for (let i = 0; i < User.contentsId.length; i++) {
        if (
          Content[0]._id.toString() === User.contentsId[0].content.toString()
        ) {
          Content[0] = { ...Content[0], isInWatchlist: true };
          break;
        }
      }
    }
    return res.status(201).json({ success: true, data: Content[0] });
  } catch (error) {
    return next(
      new handlingError("Internal Server Error Try Again Later", 500)
    );
  }
};

exports.recommendationContent = async (req, res, next) => {
  try {
    const contentId = req.params.id;
    const typeRecommended = await content.findById(contentId, {
      genres: 1,
      type: 1,
    });

    if (!typeRecommended) {
      return res.status(404).json({ message: "Content not found" });
    }
    const type = typeRecommended.type;
    const recommendationContents = await content
      .find({
        genres: { $in: typeRecommended.genres },
        type: type,
      })
      .limit(20);
    let updatedRecommendations = [];
    const User = await watchList.findOne({ userId: req.User._id });
    if (User) {
      updatedRecommendations = recommendationContents.map((contentItem) => {
        const isInWatchlist = User.contentsId.some((userContent) => {
          return contentItem._id.toString() === userContent.content.toString();
        });
        return { ...contentItem.toObject(), isInWatchlist };
      });
    }

    res.status(200).json({
      suceess: true,
      data: {
        title: "Recommendation",
        movies: updatedRecommendations?.length
          ? updatedRecommendations
          : recommendationContents,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.searchContent = async (req, res, next) => {
  try {
    let searchQuery = req.query.q;
    const page = parseInt(req.query.page) || 1; //
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
   
    const contents = await content
      .find({
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { description: { $regex: searchQuery, $options: "i" } },
          { genres: { $regex: searchQuery, $options: "i" } },
        ],
      })
      .limit(limit)
      .skip(skip)
      .sort("createdAt");
    return res.status(200).json({ success: true, data: contents,limit,page });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.filterContent = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1; //
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const query = {};
    if (req.query.language) {
      query["languages.language"] = req.query.language;
    }
    if (req.query.genre) {
      query["genres.genre"] = req.query.genre;
    }
    const Content = await content.find(query).skip(skip).limit(limit);
    if (!Content) {
      return next(new handlingError("not content found", 401));
    }
    return res.status(200).json({ success: true, data: Content });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getAllList = async (req, res, next) => {
  try {
    let pageNumber = parseInt(req.query.page) || 1;
    let limitPerPage = parseInt(req.query.limit) || 30;
    let skip = (pageNumber - 1) * limitPerPage;
    let type = {};
    if (req.query.type) {
      type = { type: req.query.type };
    }
    const Content = await movieLists
      .find(type)
      .skip(skip)
      .limit(limitPerPage)
      .populate("movies.movie")
      .sort({ createdAt: 1 });
    const User = await watchList.findOne({ userId: req.User._id });
    let sample = [];
    if (User && User.contentsId?.length) {
      for (let i = 0; i < Content.length; i++) {
        let movieObj = [];
        for (let j = 0; j < Content[i].movies.length; j++) {
          let found = false;
          for (let k = 0; k < User.contentsId.length; k++) {
            if (
              Content[i].movies[j].movie._id.toString() ===
              User.contentsId[k].content.toString()
            ) {
              found = true;
              break;
            }
          }
          movieObj.push({
            movie: {
              ...Content[i].movies[j].movie.toObject(),
              isInWatchlist: found,
            },
          });
        }

        sample.push({
          title: Content[i].title,
          type: Content[i].type,
          movies: movieObj,
          _id:Content[i]._id
        });
      }
    }
    return res.status(200).json({
      success: true,
      pageNumber: pageNumber,
      limitPerPage: limitPerPage,
      data: sample?.length ? sample : Content,
    });
  } catch (error) {
    return next(
      new handlingError("Internal Server Error. Try Again Later", 500)
    );
  }
};


exports.getSingleMovieList=async(req,res,next)=>{
  try{
    const id=req.params.id;
const movieList=await movieLists.findOne({_id:id}).populate("movies.movie").select("-type -createAt ")

if(!movieList){
  return next(new handlingError('The Movie List Does Not Exist',404))
}
res.status(200).json({success:true,data:movieList})
}catch(error){
  return next(new handlingError('Server error occured',500))
}
}