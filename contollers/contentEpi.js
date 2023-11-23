const { handlingError } = require("../error/error");
const contentEpi = require("../models/contentEpi");
const mongoose = require("mongoose");
exports.addContentEpi = async (req, res, next) => {
  try {
    const newEpi = {
      contentId: new mongoose.Types.ObjectId(req.params.id),
      addedBy: req.User._id,
      allContents: req.body,
    };

    const temp = await contentEpi.findOne({ contentId: req.params.id });
    if (!temp) {
      await contentEpi.create(newEpi);
      return res
        .status(201)
        .json({ suceess: true, message: "successfully added" });
    }
    temp.allContents.push(newEpi.allContents);
    await temp.save();
    return res
      .status(201)
      .json({ suceess: true, message: "successfully added" });
  } catch (error) {
    return next(new handlingError(error.message, 501));
  }
};

exports.getAllContentEpi = async (req, res, next) => {
  try {
    const contentId = new mongoose.Types.ObjectId(req.params.id);
    console.log(contentId);
    const allEpi = await contentEpi.aggregate([
      { $match: { _id: contentId } },
      {
        $unwind: "$allContents",
      },
      {
        $sort: { "allContents.episodeNumber": 1 },
      },
      {
        $group: {
          _id: "$_id",
          allContents: {
            $push: "$allContents",
          },
        },
      },
    ]);

    if (!allEpi) {
      return next(
        new handlingError(
          "content episode not found please provide valid content id",
          401
        )
      );
    }

    return res.status(201).json({ suceess: true, data: allEpi[0].allContents });
  } catch (error) {
    console.log(error.message);
    return next(new handlingError("interanl server error", 500));
  }
};

exports.updateContentEpi = async (req, res, next) => {
  try {
    const updateFields = {};
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
