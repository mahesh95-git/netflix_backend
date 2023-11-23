const { handlingError } = require("../error/error");
const user = require("../models/user");
const { deleteContent } = require("../util/cloudinary");
const { uploadContentCloudinary } = require("../util/cloudinary");
exports.getUserInfo = async (req, res, next) => {
  try {
    const loginUser = await user.findOne(
      { _id: req.params.id },
      { password: 0 }
    );
    if (!loginUser) {
      return next(new handlingError("please valid user id", 401));
    }
    res.status(201).json({ suceess: true, data: loginUser });
  } catch (error) {
    next(new handlingError("Internal Server Error", 500));
  }
};
exports.updateUserInfo = async (req, res, next) => {
  let cloudinaryData = {};
  try {
    if (req.files) {
      cloudinaryData = await uploadContentCloudinary(req.files);
    }
    const userInfo = {
      avatar: [
        { url: cloudinaryData[0].url, public_id: cloudinaryData[0].public_id },
      ],

      ...req.body,
    };

    const tempUser = await user.findByIdAndUpdate(req.params.id, userInfo, {
      new: false,
    });
    if (!tempUser) {
      return next(new handlingError("Please enter a valid User Id", 401));
    }
    if (Object.keys(cloudinaryData).length > 0) {
      
      await deleteContent(tempUser.avatar[0].public_id);
    }
    return res.status(201).json({ suceess: true, data: tempUser });
  } catch (error) {
    if (cloudinaryData.public_id) {
      await deleteContent(cloudinaryData.public_id);
    }
    return next(new handlingError("internal server error try again ", 500));
  }
};

exports.deleteUserAccount = async (req, res, next) => {
  try {
    const deletedUser = await user.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(new handlingError("Invalid User ID", 401));
    }
    return res
      .status(201)
      .json({ success: true, message: "your accout successfully deleted" });
  } catch (err) {
    return next(new handlingError("internal server error try again ", 500));
  }
};

// admin controller
exports.adminGetAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const allUser = await user.find().skip(skip).limit(limit);
    if (!allUser) {
      return next(new handlingError("no users found", 404));
    }
    return res
      .status(201)
      .json({ success: true, count: allUser.length, data: allUser });
  } catch (err) {
    return next(new handlingError("Internal Server Error Try Again ", 500));
  }
};

exports.adminDeleteUser = async (req, res, next) => {
  try {
    const deleteUserId = await user.findOneAndRemove({ _id: req.params.id });
    if (!deleteUserId) {
      return next(new handlingError("invalid id", 401));
    }
    return res
      .status(201)
      .json({ success: true, message: "user has been deleted" });
  } catch (err) {
    return next(new handlingError("Internal Server Error Try Again ", 500));
  }
};
