const { handlingError, errorHandler } = require("../error/error");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrpyt = require("bcrypt");
exports.singup = async (req, res, next) => {
  try {
    const newUser = await user.create(req.body);

    const token = newUser.jwtTokenGenrator();
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    return res.cookie("loginToken", token, options).status(201).json({
      success: true,
      message: "your accout successfully created",
      data: newUser,
    });
  } catch (error) {
    return next(new handlingError(error.message, 500));
  }
};
exports.login = async (req, res, next) => {
  try {
    const User = await user.findOne({ email: req.body.email });

    if (!User) {
      return next(new handlingError("Invalid email or password", 403));
    }
    const isValidPassword = await User.validPassword(req.body.password);

    if (!isValidPassword) {
      return next(new handlingError("Invalid email or password", 403));
    }
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    const token = User.jwtTokenGenrator();
    return res.cookie("loginToken", token, options).status(200).json({
      success: true,
      message: "successfully login in",
    });
  } catch (error) {
    return next(new handlingError("interal server error", 500));
  }
};

exports.authiticatedUser = async (req, res, next) => {
  try {
    if (!req.cookies.loginToken) {
      return next(new handlingError("please login ", 401));
    }
    const decoded = jwt.verify(req.cookies.loginToken, process.env.secretKey);

    const loginUser = await user.findById(decoded.id);
    if (!loginUser) {
      return next(new handlingError("invalid token", 401));
    }
    req.User = loginUser;
    next();
  } catch (error) {
    return next(new handlingError("Interanl Server Error", 500));
  }
};
exports.logout = (req, res, next) => {
  try {
    return res
      .cookie("loginToken", "0", {
        expires: new Date(Date.now()),
      })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    next(new handlingError("internal server Error", 500));
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    if (req.body.newPassword != req.body.confirmPassword) {
      return next(new handlingError("passwords are not match", 400));
    }

    const resetPass = await user.findById(req.User._id);

    if (!resetPass) {
      throw new handlingError("Invalid Token", 403);
    }
    const temp = await bcrpyt.compare(req.body.newPassword, resetPass.password);

    if (temp) {
      return next(
        new handlingError("please enter another this passowrd already use", 401)
      );
    }

    resetPass.password = req.body.newPassword;
    await resetPass.save();
    return res
      .status(200)
      .send({ success: true, message: "password update successfully" });
  } catch (err) {
    return next(new handlingError("Internal Server Error", 500));
  }
};
