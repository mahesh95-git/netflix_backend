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
      poster: [
        {
          url: { type: String, required: true },
          public_id: {
            type: String,
            required: true,
          },
        },
      ],
      description: {
        type: String,
        required: true,
      },
      episodeNumber: {
        type: Number,
        required: true,
      },
      duration: {
        type: String,
        required: true,
      },
      releaseDate: {
        type: Date,
        required: true,
        default: Date.now(),
      },
      fullVideo: [
        {
          url: { type: String, required: true },
          public_id: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("contentEpisode", contentEpiSchema);
