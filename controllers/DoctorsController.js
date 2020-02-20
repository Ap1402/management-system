const Doctor = require("../models/Doctor");
const { validationResult } = require("express-validator");

exports.createDoctor = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { start, end, field, userID } = req.body;

    const doctorFields = { schedule: {} };
    doctorFields.schedule.start = start;
    doctorFields.schedule.end = end;
    doctorFields.field = field;
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
