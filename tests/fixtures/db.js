const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/User");
const config = require("config");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "mike",
  email: "mike@example.com",
  password: "123456",
  tokens: [
    {
      token: jwt.sign({ user: { id: userOneId } }, config.get("jwtSecret"))
    }
  ]
};

const userTwoID = new mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoID,
  name: "Andres Pinto",
  email: "andres@example.com",
  password: "123456",
  tokens: [
    {
      token: jwt.sign({ user: { id: userTwoID } }, config.get("jwtSecret"))
    }
  ]
};
const doctorOneID = new mongoose.Types.ObjectId();
const doctorOne = {
  _id: doctorOneID,
  schedule: {
    start: "2010-07-01",
    end: "2010-11-03"
  },
  field: "test Field",
  user: userTwoID
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Doctor.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();
  await new Doctor(doctorOne).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoID,
  userTwo,
  doctorOneID,
  doctorOne,
  setupDatabase
};
