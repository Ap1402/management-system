const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const usersController = require("../../controllers/UsersController");
const acl = require("../../middleware/acl");

//@route Post api/users
//@desc REGISTER user
//@access Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  usersController.registerUser
);

//@route GET api/users
//@desc GET ALL registered users
//@access private
router.get(
  "/",
  auth,
  acl.grantAccess("readAny", "patient"),
  usersController.getAllUsers
);

module.exports = router;
