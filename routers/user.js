const express = require("express");
const {
  getUserInfo,
  updateUserInfo,
  deleteUserAccount,
  adminGetAllUsers,
  adminDeleteUser,
} = require("../contollers/user");
const {
  authiticatedUser,
  forgotPassword,
  changePasswrod,
  checkAdminUser,
} = require("../contollers/auth");
const router = express.Router();
router.route("/api/user/:id").get(authiticatedUser, getUserInfo);
router.route("/api/user/:id/update").patch(authiticatedUser, updateUserInfo);
router
  .route("/api/user/:id/delete")
  .delete(authiticatedUser, deleteUserAccount);
router.route("/api/auth/forgot-password").post(forgotPassword);
router.route("/api/auth/forgot-password/:token").patch(changePasswrod);
router
  .route("/api/admin/All-user")
  .get(authiticatedUser, checkAdminUser, adminGetAllUsers);
router
  .route("/api/admin/delete-user/:id")
  .delete(authiticatedUser, checkAdminUser, adminDeleteUser);
module.exports = router;
