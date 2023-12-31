const {
  addGenreOrLanguage,
  getAllGenreOrLanguage,
  deleteGenre,
  deletelanguage,
} = require("../contollers/categorieAndLanguage");
const { authiticatedUser, checkAdminUser } = require("../contollers/auth");

const router = require("express").Router();
router.route("/genres-languages").get(authiticatedUser,getAllGenreOrLanguage);
router
  .route("/admin/genres-languages")
  .post(authiticatedUser, checkAdminUser, addGenreOrLanguage);
router
  .route("/admin/genres/:id")
  .delete(authiticatedUser, checkAdminUser, deleteGenre);
router
  .route("/admin/languages/:id")
  .delete(authiticatedUser, checkAdminUser, deletelanguage);
module.exports = router;
