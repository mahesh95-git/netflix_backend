const express = require("express");
const {upload}=require("../util/multerUpload")
const {
  signup,
  login,
  authiticatedUser,
  logout,
  resetPassword,
} = require("../contollers/auth");

const router = express.Router();
router.route("/auth/signup").post(upload.fields([{name:"avatar",maxCount:1}]),signup);
router.route("/auth/login").post(login);
router.route("/auth/logout").get(authiticatedUser, logout);
router.route("/auth/reset-password").patch(authiticatedUser,resetPassword)

module.exports = router;
