const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const historySchema = Schema({
  userId: { type: mongoose.Types.ObjectId },
  activity: [
    {
      contentId: { type: mongoose.Types.ObjectId },
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
