const Doctor = require("../models/Doctor");
const { validationResult } = require("express-validator");

exports.createDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      schedule,
      unavaliableDates,
      department,
      userID,
      gapBetweenAppointments
    } = req.body;

    const doctorFields = {};
    doctorFields.schedule = schedule;
    doctorFields.department = department;
    doctorFields.unavaliableDates = unavaliableDates;
    doctorFields.minutesGapBetweenAppointments = gapBetweenAppointments;
    doctorFields.user = userID;

    Doctor.findOne({ user: userID }).then(doctor => {
      if (doctor) {
        Doctor.findOneAndUpdate(
          { user: userID },
          { $set: doctorFields },
          { new: true }
        ).then(doctor => res.status(200).json(doctor));
      } else {
        new Doctor(doctorFields)
          .save()
          .then(doctor => res.status(200).json(doctor));
      }
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server error");
  }
};

exports.getDatesById = async (req, res) => {
  try {
    const { workingDays, unavaliableDates } = await Doctor.getUnavaliableDates(
      req.params.doctor_id
    );
    console.log(new Date("2020-2-28"));
    res
      .status(201)
      .json({ workingDays: workingDays, unavaliableDates: unavaliableDates });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

exports.getTimeScheduleByDate = async (req, res) => {
  try {
    const { schedule, unavaliableTime } = await Doctor.getUnavaliableTime(
      req.params.doctor_id,
      req.params.date
    );
    res.status(201).json({ schedule, unavaliableTime });
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("department", "name");
    res.status(201).json(doctors);
  } catch (err) {
    console.error(err);
    res.status(400).json("Server problem");
  }
};

exports.deleteDoctorById = async (req, res) => {
  try {
    const doctors = await Doctor.findByIdAndDelete(req.params.doctor_id);
    res.status(201).json(doctors);
  } catch (err) {
    console.error(err);
    res.status(400).json("Server problem");
  }
};
