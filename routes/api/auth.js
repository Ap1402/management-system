const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const AuthController = require("../../controllers/AuthController");

//@route Post /auth/
//@desc User login route
//@access Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password").notEmpty(),
  ],
  AuthController.loginUser
);

//@route Post /auth/validate
//@desc Token validation route for frotend purposes
//@access Public
router.get("/validate", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

//@route Post /auth/logout/me
//@desc Deletes current token
//@access Public
router.post("/logout/me", auth, AuthController.logoutActualToken);

//@route Post /auth/logout/all
//@desc Deletes all tokens for this user
//@access Public
router.post("/logout/all", auth, AuthController.logoutAllTokens);

module.exports = router;
