const Appointment = require("../models/Appointment");
const { validationResult } = require("express-validator");

exports.createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      selectedDate,
      selectedHour,
      selectedMinutes,
      reason,
      requester,
      doctor
    } = req.body;

    const appointmentFields = { selectedSchedule: {} };
    appointmentFields.selectedSchedule.selectedDate = selectedDate;
    appointmentFields.selectedSchedule.selectedHour = selectedHour;
    appointmentFields.selectedSchedule.selectedMinutes = selectedMinutes;
    appointmentFields.doctor = doctor;
    appointmentFields.reason = reason;
    if (!req.user.role == "patient") {
      if (req.body.requester) {
        appointmentFields.requester = requester;
      }
    } else {
      appointmentFields.requester = req.user._id;
    }

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
    res.status(200).json(appointments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("server error");
  }
};

exports.getActualUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ requester: req.user._id });
    res.status(200).json(appointments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send("server error");
  }
};

exports.getAppointmentsByUserID = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      requester: req.params.userID
    });
    res.status(200).json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(404).send("Oops, something went wrong");
  }
};
