const express = require("express");
const {
  getUserInfoById,
  updateUserInfo,
  deleteUserAccount,
  adminGetAllUsers,
  adminDeleteUser,
  getUserInfo,
  adminUpdateUser,
} = require("../contollers/user");
const {
  authiticatedUser,
  forgotPassword,
  changePasswrod,
  checkAdminUser,
} = require("../contollers/auth");
const { upload } = require("../util/multerUpload");
const router = express.Router();
router
  .route("/admin/user/:id")
  .get(authiticatedUser, checkAdminUser, getUserInfoById);
router.route("/user").get(authiticatedUser, getUserInfo);
router
  .route("/user/:id/update")
  .patch(
    authiticatedUser,
    upload.fields([{ name: "avatar", maxCount: 1 }]),
    updateUserInfo
  );
router.route("/user/:id/delete").delete(authiticatedUser, deleteUserAccount);
router.route("/auth/forgot-password").post(authiticatedUser, forgotPassword);
router
  .route("/auth/forgot-password/:token")
  .patch(authiticatedUser, changePasswrod);
router
  .route("/admin/All-user")
  .get(authiticatedUser, checkAdminUser, adminGetAllUsers);
router
  .route("/admin/delete-user/:id")
  .delete(authiticatedUser, checkAdminUser, adminDeleteUser);
router
  .route("/admin/update-user/:id")
  .patch(authiticatedUser, checkAdminUser, adminUpdateUser);
module.exports = router;
