const { authiticatedUser } = require("../contollers/auth")
const { addWatchList, removeWatchlist, getAllWatchListContent } = require("../contollers/watchList")

const router=require("express").Router()
router.route("/api/watchList/:id").post(authiticatedUser,addWatchList).delete(authiticatedUser,removeWatchlist)
router.route("/api/watchList").get(authiticatedUser,getAllWatchListContent)

module.exports=router