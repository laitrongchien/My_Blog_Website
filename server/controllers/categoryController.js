const Category = require("../models/categoryModel");

exports.createCategory = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ msg: "Invalid Authentication." });

  if (req.user.role !== "admin")
    return res.status(400).json({ msg: "Invalid Authentication." });

  try {
    const name = req.body.name.toLowerCase();

    const newCategory = new Category({ name });
    await newCategory.save();

    res.json({ newCategory });
  } catch (err) {
    let errMsg;

    if (err.code === 11000) {
      errMsg = Object.values(err.keyValue)[0] + " already exists.";
    } else {
      let name = Object.keys(err.errors)[0];
      errMsg = err.errors[`${name}`].message;
    }

    return res.status(500).json({ msg: errMsg });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("-createdAt");
    res.json({ categories });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ msg: "Invalid Authentication." });

  if (req.user.role !== "admin")
    return res.status(400).json({ msg: "Invalid Authentication." });

  try {
    const category = await Category.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { name: req.body.name }
    );

    res.json({ msg: "Update Success!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ msg: "Invalid Authentication." });

  if (req.user.role !== "admin")
    return res.status(400).json({ msg: "Invalid Authentication." });

  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    res.json({ msg: "Delete Success!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
