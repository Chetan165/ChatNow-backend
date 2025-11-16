const express = require("express");
const authMiddleware = require("../Middleware/auth");
const {
  acessChatController,
  fetchChatsController,
  createGroupController,
  renameGroupController,
  removeFromGroupController,
  addToGroupController,
} = require("../controller/ChatController");
const router = express.Router();

router.post("/access", authMiddleware, (req, res) => {
  acessChatController(req, res);
});
router.get("/fetch", authMiddleware, (req, res) => {
  fetchChatsController(req, res);
});
router.post("/createGroup", authMiddleware, (req, res) => {
  createGroupController(req, res);
});
router.put("/rename", authMiddleware, (req, res) => {
  renameGroupController(req, res);
});
router.put("/removeFrom", authMiddleware, (req, res) => {
  removeFromGroupController(req, res);
});
router.put("/addTo", authMiddleware, (req, res) => {
  addToGroupController(req, res);
});

module.exports = router;
