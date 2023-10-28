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

const router = require("express").Router();
router
  .route("/api/admin/content/create")
  .post(authiticatedUser, checkAdminUser, addNewContent);
router
  .route("/api/admin/content/:id/update")
  .patch(authiticatedUser, checkAdminUser, updateContent);
router
  .route("/api/admin/content/:id/delete")
  .delete(authiticatedUser, checkAdminUser, deleteContent);
router.route("/api/content/:id").get(getContent);
router.route("/api/content").get(getAllSectionViseContent);
router.route("/api/contentOverview").get(getContentOverview);
router.route("/api/recommendations/:id").get(recommendationContent);
router.route("/api/search").get(searchContent);
router.route("/api/filter").get(filterContent);

module.exports = router;
