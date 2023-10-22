const express=require("express");
const { hello } = require("../contollers/user");
const router=express.Router()
router.route("/").get(hello)
module.exports=router;