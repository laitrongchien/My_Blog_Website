const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  generateActiveToken,
  generateAccessToken,
  generateRefreshToken,
} = require("../config/generateToken");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(`${process.env.CLIENT_ID}`);
const CLIENT_URL = `${process.env.BASE_URL}`;

exports.register = async (req, res) => {
  try {
    const { name, account, password } = req.body;

    const user = await User.findOne({ account });
    if (user) return res.status(400).json({ msg: "Username already exists." });

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = { name, account, password: passwordHash };
    const active_token = generateActiveToken({ newUser });
    const new_user = new User(newUser);
    await new_user.save();
    res.json({ msg: "Register successful", data: newUser, active_token });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

// exports.activateAccount = async (req, res) => {
//   try {
//     const { active_token } = req.body;

//     const decoded = jwt.verify(
//       active_token,
//       `${process.env.ACTIVE_TOKEN_SECRET}`
//     );

//     const { newUser } = decoded;

//     if (!newUser)
//       return res.status(400).json({ msg: "Invalid authentication." });

//     const user = await User.findOne({ account: newUser.account });
//     if (user) return res.status(400).json({ msg: "Account already exists." });

//     const new_user = new User(newUser);

//     await new_user.save();

//     res.json({ msg: "Account has been activated!" });
//   } catch (err) {
//     return res.status(500).json({ msg: err.message });
//   }
// };

exports.login = async (req, res) => {
  try {
    const { account, password } = req.body;

    const user = await User.findOne({ account });
    if (!user)
      return res.status(400).json({ msg: "This account does not exits." });

    // if user exists
    loginUser(user, password, res);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.logout = async (req, res) => {
  if (!req.user)
    return res.status(400).json({ msg: "Invalid Authentication." });

  try {
    res.clearCookie("refreshtoken", { path: `/api/refresh_token` });

    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        rf_token: "",
      }
    );

    return res.json({ msg: "Logged out!" });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;
    // console.log(rf_token);
    if (!rf_token) return res.status(400).json({ msg: "Please login now!" });

    const decoded = jwt.verify(rf_token, `${process.env.REFRESH_TOKEN_SECRET}`);
    if (!decoded.id) return res.status(400).json({ msg: "Please login now!" });

    const user = await User.findById(decoded.id).select("-password +rf_token");
    if (!user)
      return res.status(400).json({ msg: "This account does not exist." });

    if (rf_token !== user.rf_token)
      return res.status(400).json({ msg: "Please login now!" });

    const access_token = generateAccessToken({ id: user._id });
    const refresh_token = generateRefreshToken({ id: user._id }, res);

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        rf_token: refresh_token,
      }
    );

    res.json({ access_token, user });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  try {
    const { id_token } = req.body;
    const verify = await client.verifyIdToken({
      idToken: id_token,
      audience: `${process.env.CLIENT_ID}`,
    });
    const { email, email_verified, name, picture } = verify.getPayload();
    // console.log(verify);
    if (!email_verified) {
      res.status(500).json({ msg: "Email not verified" });
    }
    const password = email + `${process.env.GOOGLE_PASSWORD}`;
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.findOne({ account: email });
    if (user) {
      loginUser(user, password, res);
    } else {
      const user = {
        name,
        account: email,
        password: passwordHash,
        avatar: picture,
        type: "login",
      };
      registerUser(user, res);
    }
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const loginUser = async (user, password, res) => {
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    let msgError =
      user.type === "register"
        ? "Password is incorrect."
        : `Password is incorrect. This account login with ${user.type}`;

    return res.status(400).json({ msg: msgError });
  }

  const access_token = generateAccessToken({ id: user._id });
  const refresh_token = generateRefreshToken({ id: user._id }, res);

  // res.cookie("refreshtoken", refresh_token, {
  //   httpOnly: true,
  //   path: `/api/refresh_token`,
  //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
  // });

  await User.findOneAndUpdate(
    { _id: user._id },
    {
      rf_token: refresh_token,
    }
  );

  res.json({
    msg: "Login Success!",
    access_token,
    user: { ...user._doc, password: "" },
  });
};

const registerUser = async (user, res) => {
  const newUser = new User(user);
  // await newUser.save();

  const access_token = generateAccessToken({ id: newUser._id });
  const refresh_token = generateRefreshToken({ id: newUser._id }, res);
  newUser.rf_token = refresh_token;
  await newUser.save();

  // res.cookie("refreshtoken", refresh_token, {
  //   httpOnly: true,
  //   path: `/api/refresh_token`,
  //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30days
  // });

  res.json({
    msg: "Login Success!",
    access_token,
    user: { ...newUser._doc, password: "" },
  });
};
