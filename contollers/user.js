const { handlingError } = require("../error/error");
const user = require("../models/user");
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
    console.log("Error in getting the info", error);
  }
};
exports.updateUserInfo = async (req, res, next) => {
  try {
    const tempUser = await user.findByIdAndUpdate(req.params.id, req.body, {
      after: true,
    });
    if (!tempUser) {
      return next(new handlingError("Please enter a valid User Id", 401));
    }
    return res.status(201).json({ suceess: true, data: tempUser });
  } catch (error) {
    return next(new handlingError("internal server error try again ", 500));
  }
};

exports.deleteUserAccount = async (req, res, next) => {
  try {
    console.log(typeof req.params.id);
    const deletedUser = await user.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(new handlingError("Invalid User ID", 401));
    }
    return res
      .status(201)
      .json({ success: true, message: "your accout successfully deleted" });
  } catch (err) {
    console.log(err.message);
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
    console.log("e")
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
