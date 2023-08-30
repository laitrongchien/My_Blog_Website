exports.validRegister = async (req, res, next) => {
  const { name, account, password } = req.body;

  const errors = [];

  if (!name) {
    errors.push("Please add your name.");
  } else if (name.length > 20) {
    errors.push("Your name is up to 20 chars long.");
  }

  if (!account) {
    errors.push("Please add your username.");
  }

  if (password.length < 6) {
    errors.push("Password must be at least 6 chars.");
  }

  if (errors.length > 0) return res.status(400).json({ msg: errors });

  next();
};
