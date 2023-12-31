const { authiticatedUser, checkAdminUser } = require("../contollers/auth");
const {
  addNewContent,
  updateContent,
  deleteContent,
  getContent,
  getAllSectionViseContent,
  getContentOverview,
  recommendationContent,
  searchContent,
  filterContent,
  getAllList,
  getSingleMovieList,
} = require("../contollers/content");
const { getSingleContentEpi } = require("../contollers/contentEpi");
const { upload } = require("../util/multerUpload");
const field = upload.fields([
  { name: "poster", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "fullMovie", maxCount: 1 },
  { name: "trailer", maxCount: 1 },
]);
const router = require("express").Router();
router.route("/admin/content/create").post(authiticatedUser, checkAdminUser,field, addNewContent);
router.route("/admin/content/:id/update").patch(authiticatedUser, checkAdminUser,field, updateContent);
router
  .route("/admin/content/:id/delete")
  .delete(authiticatedUser, checkAdminUser, deleteContent);
router.route("/content/:id").get(authiticatedUser,getContent);
router.route("/contentview/:id").get(authiticatedUser,getSingleMovieList);
// router.route("/content").get(getAllSectionViseContent);
router.route("/content").get(authiticatedUser,getAllList)
router.route("/contentOverview").get(authiticatedUser,getContentOverview);
router.route("/recommendations/:id").get(authiticatedUser,recommendationContent);
router.route("/search").get(authiticatedUser,searchContent);
router.route("/filter").get(authiticatedUser,filterContent);

module.exports = router;
