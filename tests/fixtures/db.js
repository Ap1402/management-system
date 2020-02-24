const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../models/User");
const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment");

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
  role: "doctor",
  tokens: [
    {
      token: jwt.sign({ user: { id: userTwoID } }, config.get("jwtSecret"))
    }
  ]
};

const userThreeID = new mongoose.Types.ObjectId();
const userThree = {
  _id: userThreeID,
  name: "Andres Pinto3",
  email: "andres3@example.com",
  password: "123456",
  role: "doctor",
  tokens: [
    {
      token: jwt.sign({ user: { id: userTwoID } }, config.get("jwtSecret"))
    }
  ]
};

const userAdminID = new mongoose.Types.ObjectId();
const userAdmin = {
  _id: userAdminID,
  name: "Admin Admin",
  email: "Admin@example.com",
  password: "123456",
  role: "admin",
  tokens: [
    {
      token: jwt.sign({ user: { id: userAdminID } }, config.get("jwtSecret"))
    }
  ]
};

const doctorOneID = new mongoose.Types.ObjectId();
const doctorOne = {
  _id: doctorOneID,
  schedule: [
    { day: "Tuesday", start: "08:00", end: "10:00" },
    { day: "Thursday", start: "08:00", end: "10:00" },
    { day: "Friday", start: "08:00", end: "10:00" }
  ],
  unavaliableDates: ["2020-02-28", "2020-03-01"],
  field: "cardiology",
  user: userThreeID
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Doctor.deleteMany();
  await Appointment.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();

  await new Doctor(doctorOne).save();
};

module.exports = {
  userOneId,
  userOne,
  userTwoID,
  userTwo,
  userThree,
  userThreeID,
  userAdminID,
  userAdmin,
  doctorOneID,
  doctorOne,
  setupDatabase
};
