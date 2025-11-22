const express = require("express");
const authMiddleware = require("../Middleware/auth");
const router = express.Router();
const { sendMessage } = require("../controller/MessageController");
const { fetchMessages } = require("../controller/MessageController");

router.post("/send", authMiddleware, async (req, res) => {
  //logic to send message
  const data = await sendMessage(req, res);
  res.json({ ok: true, message: "Message sent" });
});

router.get("/:chatId", authMiddleware, async (req, res) => {
  await fetchMessages(req, res);
});

module.exports = router;
