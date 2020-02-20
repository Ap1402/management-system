const Appointment = require("../models/Appointment");
const { validationResult } = require("express-validator");

exports.createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { selectedDate, description, requester, doctor } = req.body;

    const appointmentFields = {};
    appointmentFields.selectedDate = selectedDate;
    appointmentFields.description = description;
    appointmentFields.requester = req.user._id;
    appointmentFields.doctor = doctor;

    new Appointment(appointmentFields)
      .save()
      .then(appointment => res.status(200).json(appointment));
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server error");
  }
};

exports.getAllAppoinments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(201).json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
};
