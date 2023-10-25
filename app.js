const express = require("express");
const dotenv = require("dotenv");
const auth = require("./routers/auth");
const user=require("./routers//user")
const content=require("./routers/content")
const bodyParser=require("body-parser")
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./error/error");
const app = express();
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(auth);
app.use(user)
app.use(content)
dotenv.config({ path: "./config/config.env" });
app.use(errorHandler);
module.exports = app;
