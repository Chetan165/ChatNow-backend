const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Picture: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", UserSchema);
module.exports = User;
