const { handlingError } = require("../error/error");
const user = require("../models/user");
const { deleteContent } = require("../util/cloudinary");
const { uploadContentCloudinary } = require("../util/cloudinary");
exports.getUserInfoById = async (req, res, next) => {
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

exports.getUserInfo = (req, res, next) => {
  res.status(200).json({ success: true, data: req.User });
};

exports.updateUserInfo = async (req, res, next) => {
  let cloudinaryData = {};

  try {
    let userInfo = {};
    if (Object.keys(req.files).length > 0) {
      cloudinaryData = await uploadContentCloudinary(req.files);

      const User = await user.findOne({ _id: req.User._id });
      if (User.avatar && User.avatar?.public_id) {
        await deleteContent(User.avatar.public_id);
      }
      userInfo["avatar"] = {
        public_id: cloudinaryData[0].public_id,
        url: cloudinaryData[0].url,
      };
    }
    userInfo = { ...userInfo, ...req.body };
    const tempUser = await user
      .findByIdAndUpdate(req.User.id, userInfo, {
        new: true,
      })
      .select("-password");

    if (!tempUser) {
      return next(new handlingError("Please enter a valid User Id", 401));
    }

    return res.status(201).json({ success: true, data: tempUser });
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
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const allUser = await user.find().skip(skip).limit(limit);
    if (!allUser) {
      return next(new handlingError("no users found", 404));
    }
    return res
      .status(201)
      .json({ success: true, total: allUser.length, data: allUser });
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

exports.adminUpdateUser = async (req, res, next) => {
  try {
    const updateData = {};
    for (const key in req.body) {
      if (
        key == "role" // Check if the key is not role or status
      ) {
        updateData[key] = req.body[key];
      }
    }
    const allowedUpdates = ["role"];
    const isValidOperation = Object.keys(req.body).every((update) =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return next(new handlingError("Can only update user role ", 401));
    }

    const updatedUser = await user.findByIdAndUpdate(req.params.id, {
      ...updateData,
    });
    console.log(updateData);
    if (!updatedUser) {
      return next(new handlingError("Invalid Id or No User Found", 401));
    }

    return res
      .status(201)
      .json({ success: true, message: "Profile Updated Successfully" });
  } catch (error) {
    console.log(error.message);
    return next(
      new handlingError("Internal Server Error. Please try again.", 500)
    );
  }
};
