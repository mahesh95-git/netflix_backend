const mongoose = require("mongoose");
const movieListingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
  },
 contents: [
   {
    content:{ type: mongoose.Schema.ObjectId, ref: "content", required: true },
   }
  ],
  createAt:{
    type:Date,
    default: Date.now()
  }
});

module.exports = mongoose.model("movieList", movieListingSchema);





   






