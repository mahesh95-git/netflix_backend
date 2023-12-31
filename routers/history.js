const express=require("express")
const router=express.Router()
const {addWatchHistory, deleteSingleHistoryContent,deleteAllContentHistory}=require("../contollers/history")
const { authiticatedUser } = require("../contollers/auth")
router.route("/watchhistory/:id").post(authiticatedUser,addWatchHistory).delete(authiticatedUser,deleteSingleHistoryContent)
router.route("/watchHistorydeleteall").delete(authiticatedUser,deleteAllContentHistory)

module.exports=router