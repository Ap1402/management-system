const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  //get token from header
  const token = req.header("x-auth-token");

  // check if not token
  if (!token) {
    next(new ErrorHandler("401", "No token, authorization denied"));
  }
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    const user = await User.findOne({
      _id: decoded.user.id,
      "tokens.token": token,
    }).select("-password");
    if (!user) throw error;

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
};
