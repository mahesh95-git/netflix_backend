const { authiticatedUser, checkAdminUser } = require("../contollers/auth");
const {
  addContentEpi,
  getAllContentEpi,
  updateContentEpi,
  deleteContentEpi,
  getSingleContentEpi,
} = require("../contollers/contentEpi");
const {upload}=require("../util/multerUpload")
const router = require("express").Router();
router
  .route("/content-episode/:contentId/:episodeId")
  .patch( authiticatedUser, checkAdminUser,upload.fields([{name:"fullVideo",maxCount:1},{name:"poster",maxCount:1}]),updateContentEpi)
  .delete(authiticatedUser, checkAdminUser, deleteContentEpi).get(getSingleContentEpi);
router
  .route("/content-episode/:id")
  .post(authiticatedUser, checkAdminUser,upload.fields([{name:"fullVideo",maxCount:1},{name:"poster",maxCount:1}]),addContentEpi)
  .get(getAllContentEpi);

module.exports = router;
