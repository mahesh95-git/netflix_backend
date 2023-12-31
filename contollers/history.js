const { handlingError } = require("../error/error");
const history = require("../models/history");
const History = require("../models/history");

exports.addWatchHistory = async (req, res, next) => {
  try {
    let contentId = req.params.id;
    let duration = req.body.duration;
    // Check if the user has already watched this movie or not
    let userHistory = await History.findOne({ userId: req.User._id });

    if (!userHistory) {
      // If no history exists for the user, create a new history record
      await History.create({
        userId: req.User._id,
        activity: [
          {
            contentId: contentId,
            duration: duration,
          },
        ],
      });
      return res.status(201).json({ success: true, message: "History saved" });
    } else {
      // If history exists, update the activity
      let isInList = false;
      for (let i = 0; i < userHistory.activity.length; i++) {
        if (userHistory.activity[i].contentId == contentId) {
          userHistory.activity.splice(i, 1);
          userHistory.activity.push({
            contentId: contentId,
            duration: duration,
          });
          isInList = true;
        }
      }
      if (!isInList) {
        userHistory.activity.push({
          contentId: contentId,
          duration: duration,
        });
      }

      await userHistory.save();
      return res
        .status(201)
        .json({ success: true, message: "History updated" });
    }
  } catch (error) {
    console.log(error.message);
    next(new handlingError("internal server errror", 500));
  }
};

exports.deleteSingleHistoryContent = async (req, res, next) => {
  try {
    console.log(req.params.id);
    let History = await history.findOne({ userId: req.User._id });
    if (!History) {
      return next(new handlingError("history not found", 400));
    }
    const index = History.activity.indexOf(
      History.activity.filter(
        (item) => item.contentId.toString() === req.params.id
      )[0]
    );

    if (index == -1) {
      return next(new handlingError(`No such Content ID in History`, 400));
    }
    History.activity.splice(index, 1);
    await History.save();
    return res
      .status(200)
      .json({ success: true, message: "Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
  }
};

exports.deleteAllContentHistory = async (req, res, next) => {
  try {
    const History = await history.findOneAndDelete({ userId: req.User._id });
    if (!History) {
      return next(new handlingError("no history for this user", 400));
    }
    return res.status(200).json({success:true,message:"Deleted Successfully"});
  } catch (err) {
    console.log(err.message);
    return next(new handlingError("internal server error", 500));
  }
};
