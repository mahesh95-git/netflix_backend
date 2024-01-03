const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const historySchema = Schema({
  userId: { type: mongoose.Types.ObjectId },
contents: [
    {
      content: { type: mongoose.Types.ObjectId,
        ref:"content"
     },
      duration: { type: Number, required: true },
      dateTime: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});
const history = mongoose.model("history", historySchema);
module.exports = history;
