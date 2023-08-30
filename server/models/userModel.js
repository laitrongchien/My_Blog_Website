const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add your name"],
      trim: true,
      maxLength: [20, "Your name is up to 20 chars long."],
    },
    account: {
      type: String,
      required: [true, "Please add your email/username"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add your password"],
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dufuwsrue/image/upload/v1689183590/blog-app/default-img_qdn27s.png",
    },
    role: {
      type: String,
      default: "user", // admin
    },
    type: {
      type: String,
      default: "register", // login
    },
    rf_token: { type: String, select: false },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
