const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { validationResult } = require("express-validator");

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid credentials" }] });
    }
    // Generate authentication token using mongoose schema function
    const token = await user.generateAuthToken();
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("server error");
  }
};

// Removes all tokens saved in db
exports.logoutAllTokens = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "You are already logged out" }] });
    }
    user.tokens = [];

    await user.save();
    return res.send();
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("server error");
  }
};

// Removes actual token from db
exports.logoutActualToken = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      return res
        .status(400)
        .json({ errors: [{ msg: "You are already logged out" }] });
    }
    user.tokens = user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await user.save();
    return res.send();
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("server error");
  }
};
