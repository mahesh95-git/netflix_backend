const { authiticatedUser } = require("../contollers/auth");
const { addNewContent, updateContent, deleteContent, getContent, getAllSectionViseContent, getContentOverview } = require("../contollers/content");

const router = require("express").Router();
router.route("/api/content/create").post(authiticatedUser, addNewContent);
router.route("/api/content/:id/update").patch(updateContent)
router.route("/api/content/:id/delete").delete(deleteContent)
router.route("/api/content/:id").get(getContent)
router.route("/api/content").get(getAllSectionViseContent)
router.route("/api/contentOverview").get(getContentOverview)

module.exports = router;
