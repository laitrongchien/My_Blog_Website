const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.auth = async (req, res, next) => {
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
      //   console.log(token);
    }
    if (!token) return res.status(400).json({ msg: "Invalid Authentication." });

    const decoded = jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`);
    if (!decoded)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const user = await User.findOne({ _id: decoded.id });
    if (!user) return res.status(400).json({ msg: "User does not exist." });

    req.user = user;

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};
