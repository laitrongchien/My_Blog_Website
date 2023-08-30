const User = require("../models/userModel");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
