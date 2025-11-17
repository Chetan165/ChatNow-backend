const express = require("express");
const app = express();
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const LoginController = async (req) => {
  try {
    const userExists = await User.findOne({
      Name: req.body.UserName,
    });
    if (!userExists) {
      return {
        ok: false,
        msg: "User Not registered",
      };
    } else {
      const Passwordmatched = await bcrypt.compare(
        req.body.Password,
        userExists.Password
      );
      if (!Passwordmatched) {
        return {
          ok: false,
          msg: "Incorrect Password",
        };
      } else {
        const token = jwt.sign(
          {
            UserName: userExists.Name,
            _id: userExists._id,
            Picture: userExists.Picture,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        return {
          ok: true,
          msg: "Login successfull",
          token,
        };
      }
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = LoginController;
