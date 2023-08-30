const express = require("express");
const authController = require("../controllers/authController");
const { validRegister } = require("../middleware/validate");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", validRegister, authController.register);
// router.post("/active", authController.activateAccount);
router.post("/login", authController.login);

router.get("/logout", auth, authController.logout);

router.get("/refresh_token", authController.refreshToken);

router.post("/google_login", authController.googleLogin);

module.exports = router;
