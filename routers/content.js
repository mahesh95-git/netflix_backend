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
} = require("../contollers/content");
const { upload } = require("../util/multerUpload");
const field = upload.fields([
  { name: "poster", maxCount: 1 },
  { name: "banner", maxCount: 1 },
  { name: "fullMovie", maxCount: 1 },
  { name: "trailer", maxCount: 1 },
]);
const router = require("express").Router();
router.route("/admin/content/create").post(field, addNewContent);
router.route("/admin/content/:id/update").patch(field, updateContent);
router
  .route("/admin/content/:id/delete")
  .delete(authiticatedUser, checkAdminUser, deleteContent);
router.route("/content/:id").get(getContent);
router.route("/content").get(getAllSectionViseContent);
router.route("/contentOverview").get(getContentOverview);
router.route("/recommendations/:id").get(recommendationContent);
router.route("/search").get(searchContent);
router.route("/filter").get(filterContent);

module.exports = router;
