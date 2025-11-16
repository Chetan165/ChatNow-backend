const express = require("express");
const app = express();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

const RegisterController = async (req) => {
  try {
    const userExists = await User.findOne({
      Name: req.body.UserName,
    });
    if (userExists) {
      return {
        ok: false,
        msg: "UserName already exists",
      };
    } else {
      const hashedpassword = await bcrypt.hash(req.body.Password, 10);
      const NewUser = await new User({
        Name: req.body.UserName,
        Password: hashedpassword,
        Picture: req.body.picUrl,
      });
      await NewUser.save();
      return {
        ok: true,
        msg: "User registered sucessfully",
      };
    }
  } catch (err) {
    console.log(err);
    return {
      ok: false,
      msg: err.message,
    };
  }
};

module.exports = RegisterController;
