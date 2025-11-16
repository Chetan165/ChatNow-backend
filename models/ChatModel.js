const mongoose = require("mongoose");

const ChatModel = mongoose.Schema(
  {
    ChatName: {
      type: String,
      trim: true, // for trimming leading and trailing space}
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      //to store references of multiple users if there are any (eg, group chat)
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", ChatModel);
module.exports = Chat;
