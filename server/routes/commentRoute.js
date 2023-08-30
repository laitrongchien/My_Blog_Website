const express = require("express");
const commentController = require("../controllers/commentController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/comment", auth, commentController.createComment);
router.get("/comments/blog/:id", commentController.getComments);
router.post("/reply_comment", auth, commentController.replyComment);
router.patch("/comment/:id", auth, commentController.updateComment);
router.delete("/comment/:id", auth, commentController.deleteComment);

module.exports = router;
