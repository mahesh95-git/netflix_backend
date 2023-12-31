const express=require("express")
const router=express.Router()
const {addWatchHistory, deleteSingleHistoryContent,deleteAllContentHistory, getAllWatchHistory}=require("../contollers/history")
const { authiticatedUser } = require("../contollers/auth")
router.route("/watchhistory/:id").post(authiticatedUser,addWatchHistory).delete(authiticatedUser,deleteSingleHistoryContent)
router.route("/watchhistorydeleteall").delete(authiticatedUser,deleteAllContentHistory)
router.route("/watchhistory").get(authiticatedUser,getAllWatchHistory)

module.exports=router