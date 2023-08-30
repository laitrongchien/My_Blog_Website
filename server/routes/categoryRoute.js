const express = require("express");
const categoryController = require("../controllers/categoryController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router
  .route("/category")
  .get(categoryController.getCategories)
  .post(auth, categoryController.createCategory);
router
  .route("/category/:id")
  .patch(auth, categoryController.updateCategory)
  .delete(auth, categoryController.deleteCategory);

module.exports = router;
