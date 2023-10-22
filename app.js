const express=require("express")
const dotenv=require("dotenv")
const user=require("./routers/user")
const cookieParser = require("cookie-parser")
const app = express()
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(user)
app.r
dotenv.config({path:"./config/config.env"})

module.exports=app