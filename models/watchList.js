const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const watchListSchema = Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "user",
  },

  contentsId: [
    {
      content: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "content",
      },
    },
  ],
});

module.exports = mongoose.model("watchList", watchListSchema);
