const express = require("express");
const blogController = require("../controllers/blogController");
const { auth } = require("../middleware/auth");
const router = express.Router();

router.post("/blog", auth, blogController.createBlog);
router.get("/home/blogs", blogController.getHomeBlogs);
router.get("/blogs/category/:id", blogController.getBlogsByCategory);
router.get("/blogs/user/:id", blogController.getBlogsByUser);
router.get("/blog/:id", blogController.getBlog);
router.put("/blog/:id", auth, blogController.updateBlog);
router.delete("/blog/:id", auth, blogController.deleteBlog);
router.get("/search/blogs", blogController.searchBlogs);

module.exports = router;
