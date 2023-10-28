const { handlingError } = require("../error/error");
const content = require("../models/content");
exports.addNewContent = async (req, res, next) => {
  try {
    const newContent = await content.create({
      createBy: req.User._id,
      ...req.body,
    });
    res.status(201).json({ message: "new Content added", data: newContent });
  } catch (error) {
    console.log(error.message);
    return next(new handlingError(error.message, 500));
  }
};

exports.updateContent = async (req, res, next) => {
  try {
    const Content = await content.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });

    if (!Content) {
      return next(new handlingError("Please Enter valid Content Id", 401));
    }
    res
      .status(201)
      .json({ suceess: true, message: "content is update  successefully " });
  } catch (error) {
    console.log(error.message);
    return next(new handlingError("internal server error try again", 500));
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
    console.log(error.message);
    return next(new handlingError("internal server error try again", 500));
  }
};
exports.getContent = async (req, res, next) => {
  try {
    const Contents = await content.find({ _id: req.params.id });
    if (!Contents) {
      return next(new handlingError("please enter a valid id", 401));
    }
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
    console.log(error.message);
    return next(
      new handlingError("Internal Server Error Try Again Later", 500)
    );
  }
};

exports.getContentOverview = async (req, res, next) => {
  try {
    const Content = await content.aggregate([
      {
        $match: {
          type: req.query.type,
        },
      },
      { $sample: { size: 10 } },
    ]);

    return res.status(201).json({ sucess: true, Content });
  } catch (error) {
    console.log(error.message);
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

    const genres = typeRecommended.genres.map(
      (genreObject) => genreObject.genre
    );
    const type = typeRecommended.type;
    const recommendationContents = await content
      .find({
        "genres.genre": { $in: genres },
        type: type,
      })
      .limit(20);

    res.status(200).json({ suceess: true, data: recommendationContents });
  } catch (error) {
    console.error(error.message);
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
          { "genres.genre": { $regex: searchQuery, $options: "i" } },
        ],
      })
      .limit(limit)
      .skip(skip)
      .sort("createdAt");
    return res.status(200).json({ success: true, data: contents });
  } catch (error) {
    console.error(error.message);

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
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
