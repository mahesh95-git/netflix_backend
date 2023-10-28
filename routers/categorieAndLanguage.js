const {
  addGenreOrLanguage,
  getAllGenreOrLanguage,
  deleteGenre,
  deletelanguage,
} = require("../contollers/categorieAndLanguage");
const { authiticatedUser, checkAdminUser } = require("../contollers/auth");

const router = require("express").Router();
router.route("/api/genres-languages").get(getAllGenreOrLanguage);
router
  .route("/api/admin/genres-languages")
  .post(authiticatedUser, checkAdminUser, addGenreOrLanguage);
router
  .route("/api/admin/genres/:id")
  .delete(authiticatedUser, checkAdminUser, deleteGenre);
router
  .route("/api/admin/languages/:id")
  .delete(authiticatedUser, checkAdminUser, deletelanguage);
module.exports = router;
