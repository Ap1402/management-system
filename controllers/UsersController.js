const jwt = require("jsonwebtoken");
const config = require("config");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const ErrorHandler = require("../helpers/ErrorHandler");

// User Sign up function
exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { role, firstName, lastName, email, password, contact } = req.body;

    const newUser = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      role: role,
      contact: contact,
    });

    await newUser.save();

    const payload = {
      user: {
        id: newUser.id,
      },
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
    next(error);
  }
};

// User Update function
exports.updateUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new ErrorHandler("400", errors.array()));
  }

  try {
    const { role, firstName, lastName, email, password, contact } = req.body;
    const { userId } = req.params;

    if (req.user._id.toString() !== userId && req.user.role === "patient") {
      next(
        new ErrorHandler(403, "You don't have enough permissions to do that")
      );
    }

    let user = await User.findById(userId);

    if (!user) {
      next(new ErrorHandler(404, "There is no user registered with this id"));
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;
    user.contact = contact;
    user.role = req.user.role !== "patient" ? role : user.role;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.getAllActiveUsers = async (req, res) => {
  try {
    const users = await User.find({ active: true }).select(
      "-password -tokens -__v -active"
    );
    res.status(201).json(users);
  } catch (err) {
    next(err);
  }
};
