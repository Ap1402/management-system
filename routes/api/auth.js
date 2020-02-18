const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const AuthController = require("../../controllers/AuthController");

//@route POst /auth/
//@desc POST user login
//@access Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password").notEmpty()
  ],
  AuthController.loginUser
);

router.post("/logout/me", auth, AuthController.logoutActualToken);

router.post("/logout/all", auth, AuthController.logoutAllTokens);

module.exports = router;
