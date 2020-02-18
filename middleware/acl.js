const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

module.exports = async function(req, res, next) {
  try {
  } catch (err) {
    res.status(401).json({ msg: "Server error, no authorized" });
  }
};
