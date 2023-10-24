const express = require("express");
const {
  singup,
  login,
  authiticatedUser,
  logout,
  resetPassword,
} = require("../contollers/auth");

const router = express.Router();
router.route("/api/auth/signup").post(singup);
router.route("/api/auth/login").post(login);
router.route("/api/auth/logout").get(authiticatedUser, logout);
router.route("/api/auth/reset-password").patch(authiticatedUser,resetPassword)

module.exports = router;
