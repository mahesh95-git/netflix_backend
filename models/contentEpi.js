const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const contentEpiSchema = Schema({
  addedBy: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
  contentId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    unique: true,
  },
  allContents: [
    {
      title: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      episodeNumber: {
        type: Number,
        required: true,
        unique:true
      },
      duration: {
        type: String,
        required: true,
      },
      releaseDate: {
        type: Date,
        required: true,
        default:Date.now()
      },
      videoURL: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("contentEpisode", contentEpiSchema);


