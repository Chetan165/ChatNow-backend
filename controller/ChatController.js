const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

const acessChatController = async (req, res) => {
  const user2id = req.body._id;
  const user1id = req._id;
  const UserName = req.body.UserName;
  try {
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [user1id, user2id] },
    })
      .populate("users", "-Password")
      .populate("latestMessage")
      .populate("groupAdmin", "-Password");
    chat = await User.populate(chat, {
      path: "latestMessage.sender",
      select: "Name Picture",
    });
    if (chat) {
      return res.json({
        ok: true,
        chat,
      });
    } else {
      const newChat = await new Chat({
        ChatName: "Sender",
        isGroupChat: false,
        users: [user1id, user2id],
      });
      let savedChat = await newChat.save();
      savedChat = await Chat.populate(savedChat, [
        { path: "users", select: "-Password" },
      ]);
      return res.json({
        ok: true,
        chat: savedChat,
      });
    }
  } catch (err) {
    console.log(err);
    return res.json({
      ok: false,
      msg: err,
    });
  }
};
const fetchChatsController = async (req, res) => {
  try {
    let userChats = await Chat.find({
      users: { $in: [req._id] },
    })
      .populate("users", "-Password")
      .populate("groupAdmin", "-Password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    userChats = await User.populate(userChats, {
      path: "latestMessage.sender",
      select: "Name Picture",
    });
    if (!userChats.length) {
      return res.json({
        ok: false,
        msg: "No Chats Found",
      });
    } else {
      return res.json({
        ok: true,
        chats: userChats,
      });
    }
  } catch (err) {
    return res.json({
      ok: false,
      msg: err.message,
    });
  }
};
const createGroupController = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res
      .status(400)
      .json({ ok: false, msg: "Please Fill all the fields" });
  }
  var users = req.body.users;
  if (users.length < 2) {
    return res.status(400).json({
      ok: false,
      msg: "More than 2 users are required to form a group chat",
    });
  }
  users.push(req._id);
  try {
    let groupChat = await new Chat({
      ChatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req._id,
    });
    let savedGroupChat = await groupChat.save();
    savedGroupChat = await Chat.populate(savedGroupChat, [
      {
        path: "users",
        select: "Name Picture",
      },
      {
        path: "groupAdmin",
        select: "Name Picture",
      },
      {
        path: "latestMessage",
        select: "Content Sender",
      },
    ]);
    return res.status(200).json({
      ok: true,
      savedGroupChat,
    });
  } catch (err) {
    return res.status(400).json({
      ok: false,
      msg: err.message,
    });
  }
};
const renameGroupController = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      ChatName: chatName,
    },
    { new: true }
  )
    .populate("users", "-Password")
    .populate("groupAdmin", "-Password");
  if (!updatedChat) {
    return res.status(404).json({
      ok: false,
      msg: "Chat Not Found",
    });
  } else {
    return res.json({
      ok: true,
      updatedChat,
    });
  }
};
const removeFromGroupController = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res
      .status(400)
      .json({ ok: false, msg: "chatId and userId are required" });
  }

  try {
    // Pull the user from the users array
    let updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "Name Picture")
      .populate("groupAdmin", "Name Picture")
      .populate("latestMessage");

    if (!updatedChat) {
      return res.status(404).json({ ok: false, msg: "Chat not found" });
    }

    // Populate latestMessage.sender if needed
    updatedChat = await User.populate(updatedChat, {
      path: "latestMessage.sender",
      select: "Name Picture",
    });

    return res.json({ ok: true, updatedChat });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: err.message });
  }
};
const addToGroupController = async (req, res) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res
      .status(400)
      .json({ ok: false, msg: "chatId and userId are required" });
  }

  try {
    // Add the user to the users array if not already present
    let updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { new: true }
    )
      .populate("users", "Name Picture")
      .populate("groupAdmin", "Name Picture")
      .populate("latestMessage");

    if (!updatedChat) {
      return res.status(404).json({ ok: false, msg: "Chat not found" });
    }

    // Populate latestMessage.sender
    updatedChat = await User.populate(updatedChat, {
      path: "latestMessage.sender",
      select: "Name Picture",
    });

    return res.json({ ok: true, updatedChat });
  } catch (err) {
    return res.status(500).json({ ok: false, msg: err.message });
  }
};

module.exports = {
  acessChatController,
  fetchChatsController,
  createGroupController,
  renameGroupController,
  removeFromGroupController,
  addToGroupController,
};
