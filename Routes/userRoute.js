const express = require("express");
const AllUsers = require("../controller/AllUsers");
const authMiddleware = require("../Middleware/auth");
const router = express.Router();

router.get("/user", authMiddleware, async (req, res) => {
  AllUsers(req, res);
});

module.exports = router;
