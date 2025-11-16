const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const ConnectDb = async () => {
  try {
    const res = await mongoose.connect(process.env.DB_URI);
  } catch (err) {
    console.log(err);
  }
};
module.exports = ConnectDb;
