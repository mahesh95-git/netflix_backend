const { authiticatedUser, checkAdminUser } = require("../contollers/auth");
const {
  addContentEpi,
  getAllContentEpi,
  updateContentEpi,
  deleteContentEpi,
} = require("../contollers/contentEpi");

const router = require("express").Router();
router
  .route("/api/content-episode/:contentId/:episodeId")
  .patch(authiticatedUser, checkAdminUser, updateContentEpi)
  .delete(authiticatedUser, checkAdminUser,deleteContentEpi);
router
  .route("/api/content-episode/:id")
  .post(authiticatedUser, checkAdminUser, addContentEpi)
  .get(getAllContentEpi);

module.exports = router;
