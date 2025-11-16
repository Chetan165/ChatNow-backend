const express = require("express");
const User = require("../models/UserModel");
const app = express();
const router = express.Router();

const AllUsers = async (req, res) => {
  const keyword = req.query.search
    ? { Name: { $regex: req.query.search, $options: "i" } }
    : null;
  const user = await User.find(keyword);
  console.log("result=", user);
  const result = user.filter((u, index) => u.Name != req.userid);
  console.log(result);
  res.json({
    ok: true,
    users: result,
  });
};
module.exports = AllUsers;
