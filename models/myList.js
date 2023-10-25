const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const myListschema = Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref:"user"
  },
  contentId: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref:"content",
      default: "",
    },
  ],
});
module.exports = mongoose.model("myList", myListschema);
