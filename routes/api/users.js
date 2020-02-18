const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const usersController = require("../../controllers/UsersController");

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
router.get("/", auth, usersController.getAllUsers);

//@route delete api/users/:id
//@desc DELETE user by id
//@access private
router.delete("/:id", auth, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
