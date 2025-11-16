const mongoose = require("mongoose");
const MessageModel = mongoose.Schema(
  {
    Sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    Content: {
      type: String,
      trim: true,
    },
    Chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);
const Message = mongoose.model("Message", MessageModel);
module.exports = Message;
