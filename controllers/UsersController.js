const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const User = require("../models/User");

// User Sign up function
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { role, name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "email already exist" }] });
    }

    const newUser = new User({
      name: name,
      email: email,
      password: password,
      role: role
    });

    await newUser.save();

    const payload = {
      user: {
        id: newUser.id
      }
    };

    jwt.sign(
      payload,
      config.get("jwtSecret"),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server error");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(201).json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};
