const express = require("express");
const {
  getUserInfo,
  updateUserInfo,
  deleteUserAccount,
} = require("../contollers/user");
const {
  authiticatedUser,
  forgotPassword,
  changePasswrod,
} = require("../contollers/auth");
const router = express.Router();
router.route("/api/user/:id").get(authiticatedUser, getUserInfo);
router.route("/api/user/:id/update").patch(authiticatedUser, updateUserInfo);
router
  .route("/api/user/:id/delete")
  .delete(authiticatedUser, deleteUserAccount);
router.route("/api/auth/forgot-password").post(forgotPassword);
router.route("/api/auth/forgot-password/:token").patch(changePasswrod);
module.exports = router;
