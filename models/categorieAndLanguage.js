const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const genreSchema = Schema({
  genre:{
    type:String,
    unique:true
}
});
const languageSchema = Schema({
  language:{
    type:String,
    unique:true
}
});
 const genre=mongoose.model("genre", genreSchema);
 const language=mongoose.model("language", languageSchema);
 module.exports={genre,language};

