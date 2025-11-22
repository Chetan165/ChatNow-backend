const Chat = require("../models/ChatModel");
const Message = require("../models/MessageModel");
const User = require("../models/UserModel");
const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.json({ ok: false, msg: "Invalid data passed into request" });
  }
  let newMessage = {
    Sender: req._id,
    Content: content,
    Chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    console.log("New message created: ", message);
    message = await message.populate("Sender", "Name Picture");
    message = await message.populate("Chat");
    message = await User.populate(message, {
      path: "Chat.users",
      select: "Name Picture",
    });
    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    return res.status(200).json({ ok: true, message });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ ok: false, msg: "Failed to send message" });
  }
};

const fetchMessages = async (req, res) => {
  try {
    const messages = await Message.find({ Chat: req.params.chatId })
      .sort({
        createdAt: 1,
      })
      .populate("Sender", "Name Picture")
      .populate("Chat");
    return res.status(200).json({ ok: true, messages });
  } catch (err) {
    console.log(err);
    return res.json({ ok: false, msg: "Failed to fetch messages" });
  }
};
module.exports = {
  sendMessage,
  fetchMessages,
};
