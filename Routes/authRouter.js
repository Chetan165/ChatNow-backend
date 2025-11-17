const express = require("express");
const app = express();
const router = express.Router();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const upload = require("../upload");
const fs = require("fs");
const RegisterController = require("../controller/RegisterController");
const LoginController = require("../controller/LoginController");
const authMiddleware = require("../Middleware/auth");
const PicuploadController = require("../controller/PicuploadController");

router.post(
  "/register",
  upload.default.single("file"), // MUST run before controller
  async (req, res) => {
    try {
      // Step 1: Upload picture
      const picupload = await PicuploadController(req);
      // Step 2: Add pic URL to req.body so controller can save it
      req.body.picUrl = picupload.url
        ? picupload.url
        : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
      console.log(req.body);

      // Step 3: Register user
      const result = await RegisterController(req, res);

      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.json({
        ok: false,
        msg: "Something went wrong while registering",
      });
    }
  }
);

router.post("/login", async (req, res) => {
  const result = await LoginController(req, res);
  res.json(result);
});

router.get("/", authMiddleware, (req, res) => {
  res.json({
    ok: true,
    msg: "authenticated user",
    user: {
      UserName: req.userid,
      User_id: req._id,
      Picture: req.Picture,
    },
  });
});
module.exports = router;
