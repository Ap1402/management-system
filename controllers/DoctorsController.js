const Doctor = require("../models/Doctor");
const { validationResult } = require("express-validator");

exports.createDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { schedule, unavaliableDates, field, userID } = req.body;

    const doctorFields = {};
    doctorFields.schedule = schedule;
    doctorFields.field = field;
    doctorFields.unavaliableDates = unavaliableDates;
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
