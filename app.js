const express = require("express");
const dotenv = require("dotenv");
const auth = require("./routers/auth");
const user=require("./routers//user")
const content=require("./routers/content")
const watchList=require("./routers/watchList")
const contentEpi=require("./routers/contentEpic")
const bodyParser=require("body-parser")
const catAndLan=require("./routers/categorieAndLanguage")
const cors=require("cors")
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./error/error");
const app = express();
app.use(cors( {origin: 'http://localhost:5173', // Replace with your frontend origin
credentials: true}))
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(bodyParser.json())
app.use("/api",auth);
app.use("/api",user)
app.use("/api",content)
app.use("/api",watchList)
app.use("/api",catAndLan)
app.use("/api",contentEpi)

app.use(errorHandler);
module.exports = app;

<<<<<<< HEAD
=======

//this is final commit
>>>>>>> 38a1879b4f61c2e35ae8e2c2fd50bb66b69d5211
