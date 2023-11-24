const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const genreSchema = Schema({
  genre:{
    type:String,
    unique:[true,"this genre already added provide another genre"]
}
});
const languageSchema = Schema({
  language:{
    type:String,
    unique:[true,"this lanuage already added provide another languae"]
  }
});
 const genre=mongoose.model("genre", genreSchema);
 const language=mongoose.model("language", languageSchema);
 module.exports={genre,language};

