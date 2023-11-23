const { handlingError, errorHandler } = require("../error/error");
const contentEpi = require("../models/contentEpi");
const content = require("../models/content");
const mongoose = require("mongoose");
const { uploadContentCloudinary } = require("../util/cloudinary");
const { find } = require("../models/user");
exports.addContentEpi = async (req, res, next) => {
  let cloudinaryData = {};
  try {
    const temp = await contentEpi.findOne({ contentId: req.params.id });
    const temp2 = await content.findOne({ _id: req.params.id });
    if (!temp2) {
      return next(new handlingError("invalid id please provide valid id", 401));
    }

    if (!req.files) {
      return next(new handlingError("please upload file", 401));
    }

    cloudinaryData = await uploadContentCloudinary(req.files);

    if (!temp) {
      let newContentEpi = {
        contentId: req.params.id,
        addedBy: new mongoose.Types.ObjectId("655f280b6fd0cc46f825f34b"),
        allContents: {
          title: req.body.title,
          description: req.body.description,
          episodeNumber: req.body.episodeNumber,
          duration: req.body.description,
        },
      };

      cloudinaryData.forEach((element) => {
        newContentEpi.allContents[element.fieldname] = [
          {
            url: element.secure_url,
            public_id: element.public_id,
          },
        ];
      });

      await contentEpi.create(newContentEpi);

      return res
        .status(201)
        .json({ suceess: true, message: "successfully added" });
    }
    let newContentEpi = {
      title: req.body.title,
      description: req.body.description,
      episodeNumber: req.body.episodeNumber,
      duration: req.body.description,
    };
    cloudinaryData.forEach((element) => {
      newContentEpi[element.fieldname] = [
        {
          url: element.secure_url,
          public_id: element.public_id,
        },
      ];
    });

    temp.allContents.push(newContentEpi);
    await temp.save();
    return res
      .status(201)
      .json({ suceess: true, message: "successfully added" });
  } catch (error) {
    return next(new handlingError(error.message, 500));
  }
};
exports.getAllContentEpi = async (req, res, next) => {
  try {
    const contentId = new mongoose.Types.ObjectId(req.params.id);

    const allEpi = await contentEpi
      .findOne({ contentId: req.params.id })
      .select("-addedBy -contentId")
      .sort({ "allContent.episodeNumber": 1 });
    

    if (!allEpi) {
      return next(
        new handlingError(
          "content episode not found please provide valid content id",
          401
        )
      );
    }

    return res.status(201).json({ suceess: true, data: allEpi });
  } catch (error) {

    return next(new handlingError("interanl server error", 500));
  }
};

exports.getSingleContentEpi = async (req, res, next) => {
  try {
    const temp = await contentEpi.findOne(
      { contentId: req.params.contentId },
      { addedBy: 0, contentId: 0 }
    );
    const episode = temp.allContents.find((element) => {
      if (element.id === req.params.episodeId) {
        return element;
      }
    });
    if (!episode) {
      return next(
        new handlingError(
          "content episode not found please provide valid content id",
          401
        )
      );
    }

    return res.status(201).json({ sucess: true, data: episode });
  } catch (error) {

  }
};

exports.updateContentEpi = async (req, res, next) => {
  try {
    let cloudinaryData = {};
    const updateFields = {};
    if (req.files) {
      cloudinaryData = await uploadContentCloudinary(req.files);
      cloudinaryData.forEach((element) => {
        updateFields[`allContents.$.${element.fieldname}`] = [
          {
            url: element.secure_url,
            public_id: element.public_id,
          },
        ];
      });
    }

    for (let key in req.body) {
      updateFields[`allContents.$.${key}`] = req.body[key];
    }
   
    const updatedEpisode = await contentEpi.findOneAndUpdate(
      {
        contentId: req.params.contentId,
        "allContents._id": req.params.episodeId,
      },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedEpisode) {
      return next(new handlingError("Please Enter valid episode Id", 401));
    }
    res
      .status(201)
      .json({ suceess: true, message: "episode is update  successefully " });
  } catch (error) {
    return next(new handlingError("internal server error try again", 500));
  }
};
exports.deleteContentEpi = async (req, res, next) => {
  try {
    const Content = await contentEpi.findOneAndUpdate(
      {
        contentId: req.params.contentId,
      },
      { $pull: { allContents: { _id: req.params.episodeId } } }
    );

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
