const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    blog_id: mongoose.Types.ObjectId,
    blog_user_id: mongoose.Types.ObjectId,
    content: { type: String, required: true },
    replyCM: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
    reply_user: { type: mongoose.Types.ObjectId, ref: "User" },
    comment_root: { type: mongoose.Types.ObjectId, ref: "Comment" },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
