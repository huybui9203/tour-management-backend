const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/refresh", authController.refreshToken);
router.post("/google", authController.googleAuth);
router.post("/facebook", authController.facebookAuth);

module.exports = router;
