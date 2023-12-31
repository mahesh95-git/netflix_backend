const { handlingError } = require("../error/error");
const watchList = require("../models/watchList");
const mongoose = require("mongoose");
exports.addWatchList = async (req, res, next) => {
  try {
    const WatchList = await watchList.findOne({ userId: req.User.id });

    if (!WatchList) {
      let newWatchlist = {
        userId: req.User._id,
        contentsId: [{ content: new mongoose.Types.ObjectId(req.params.id) }],
      };

      await watchList.create(newWatchlist);
      return res
        .status(201)
        .json({ success: true, message: "Added to your list" });
    }
    let isExites = false;
    for (let i = 0; i < WatchList.contentsId.length; i++) {
      if (WatchList.contentsId[i].content.toString() === req.params.id) {
        isExites = true;
      }
    }

    if (isExites) {
      return next(new handlingError("already exites in your watchlist", 401));
    }
    WatchList.contentsId.push({
      content: new mongoose.Types.ObjectId(req.params.id),
    });
    await WatchList.save();
    return res
      .status(201)
      .json({ success: true, message: "Added to your list" });
  } catch (error) {
    console.log(error.message)
    return next(new handlingError("Internal Server Error", 500));
  }
};

exports.removeWatchlist = async (req, res, next) => {
  try {
    const WatchList = await watchList.findOne({ userId: req.User.id });

    if (!WatchList) {
      return next(new handlingError("No Content Found", 404));
    }
    const index = WatchList.contentsId.findIndex((value) => {
      return String(value.content) === String(req.params.id);
    });
console.log(index)
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
      .populate("contentsId.content");

    if (!allWatchListConent) {
      return next(new handlingError("no contents", 404));
    }
    let temp=[]

  temp=allWatchListConent.contentsId.map((value)=>{
    return {...value.toObject().content,isInWatchlist:true}
  }) 
   
    return res
      .status(200)
      .json( {success: true, data:temp?.length?temp:[]});
  } catch (error) {
    return next(new handlingError("Internal Server Error", 500));
  }
};

