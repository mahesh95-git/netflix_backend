const { handlingError } = require("../error/error");
const watchList = require("../models/watchList");
const mongoose = require("mongoose");
exports.addWatchList = async (req, res, next) => {
  try {
    const WatchList = await watchList.findOne({ userId: req.User.id });

    if (!WatchList) {
      let newWatchlist = {
        userId: req.User._id,
        contentsId: [{ contentId: new mongoose.Types.ObjectId(req.params.id) }],
      };

      await watchList.create(newWatchlist);
      return res
        .status(201)
        .json({ success: true, message: "Added to your list" });
    }
    let isExites = false;
    for (let i = 0; i < WatchList.contentsId.length; i++) {
      if (WatchList.contentsId[i].contentId.toString() === req.params.id) {
        isExites = true;
      }
    }

    if (isExites) {
      return next(new handlingError("already exites in your watchlist", 401));
    }
    WatchList.contentsId.push({
      contentId: new mongoose.Types.ObjectId(req.params.id),
    });
    await WatchList.save();
    return res
      .status(201)
      .json({ success: true, message: "Added to your list" });
  } catch (error) {
    return next(new handlingError("Internal Server Error", 500));
  }
};

exports.removeWatchlist = async (req, res, next) => {
  try {
    const WatchList = await watchList.findOne({ userId: req.User.id });
    console.log(WatchList);
    if (!WatchList) {
      return next(new handlingError("No Content Found", 404));
    }

    const index = WatchList.contentsId.findIndex((value) => {
      return String(value.contentId) === String(req.params.id);
    });
    console.log(index);
    if (index < 0) {
      return next(new handlingError("Content not found", 404));
    }
    WatchList.contentsId.splice(index, 1);
    await WatchList.save();
    return res
      .status(201)
      .json({ success: true, message: "successfully remove " });
  } catch (error) {}
};

exports.getAllWatchListContent = async (req, res, next) => {
  try {
    const allWatchListConent = await watchList
      .findOne({ userId: req.User.id })
      .populate("contentsId.contentId");

    if (!allWatchListConent) {
      return next(new handlingError("no contents", 404));
    }
    return res
      .status(200)
      .json({ success: true, data: allWatchListConent.contentsId });
  } catch (error) {
    return next(new handlingError("Internal Server Error", 500));
  }
};

