const Appointment = require("../models/Appointment");
const { validationResult } = require("express-validator");
const Doctor = require("../models/Doctor");
const ErrorHandler = require("../helpers/ErrorHandler");
const dayjs = require("dayjs");

exports.createAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ErrorHandler(400, errors.array()));
  }

  try {
    const {
      selectedDate,
      selectedHour,
      reason,
      doctor,
      specificInfo,
    } = req.body;

    const { schedule, unavaliableTime } = await Doctor.getUnavaliableTime(
      doctor,
      selectedDate
    );

    if (!schedule.start) {
      next(new ErrorHandler(400, "This doctor is not avaliable at this date"));
    }

    if (
      schedule.start > selectedHour ||
      schedule.end < selectedHour ||
      unavaliableTime.includes(selectedHour)
    ) {
      next(
        new ErrorHandler(
          400,
          "Selected time is not avaliable for this doctor or out of schedule"
        )
      );
    }

    const appointmentFields = { selectedSchedule: {} };

    appointmentFields.selectedSchedule.selectedDate = selectedDate;
    appointmentFields.selectedSchedule.selectedHour = selectedHour;
    appointmentFields.doctor = doctor;
    appointmentFields.reason = reason;
    appointmentFields.specificInfo = specificInfo;

    if (!(req.user.role === "patient")) {
      if (req.params.userId) {
        appointmentFields.requester = req.params.userId;
      } else {
        next(new ErrorHandler(400, "There is no requestr id specified"));
      }
    } else {
      appointmentFields.requester = req.user._id;
    }

    new Appointment(appointmentFields)
      .save()
      .then((appointment) => res.status(200).json(appointment));
  } catch (error) {
    next(err);
  }
};

exports.getAllAppoinments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

exports.getActualUserAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ requester: req.user._id });
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

exports.getAppointmentsByUserID = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ErrorHandler(400, errors.array()));
  }
  try {
    const appointments = await Appointment.find({
      requester: req.params.userId,
    });
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ErrorHandler(400, errors.array()));
  }
  try {
    const appointment = await Appointment.findByIdAndDelete(
      req.params.appointmentId
    );
    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
};

exports.updateAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ErrorHandler(400, errors.array()));
  }

  try {
    const {
      selectedDate,
      selectedHour,
      reason,
      doctor,
      specificRequest,
      diagnosis,
      accepted,
      completed,
    } = req.body;

    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return next(
        new ErrorHandler(404, "There is no appointment with this id")
      );
    }

    if (
      (appointment.status.completed || appointment.status.accepted) &&
      req.user.role === "patient"
    ) {
      return next(
        new ErrorHandler(
          403,
          "You can not edit an appointment after it has been accepted or completed"
        )
      );
    }

    // Checking time and date avaliability <-------
    const { schedule, unavaliableTime } = await Doctor.getUnavaliableTime(
      doctor,
      selectedDate
    );
    // If there is no schedule start value, doctor is not working that day
    if (!schedule.start) {
      return next(
        new ErrorHandler(400, "This doctor is not avaliable at this date")
      );
    }

    if (
      (schedule.start > selectedHour ||
        schedule.end < selectedHour ||
        unavaliableTime.includes(selectedHour)) &&
      req.user.role === "patient" &&
      appointment.selectedSchedule.selectedHour !== selectedHour &&
      dayjs(appointment.selectedSchedule.selectedDate).format("YYY/MM/DD") !==
        selectedDate
    ) {
      return next(
        new ErrorHandler(
          400,
          "Selected time is not avaliable for this doctor or out of schedule"
        )
      );
    }
    //------------>
    //If doctor is updating
    if (req.user.role !== "patient") {
      appointment.diagnosis = diagnosis ? diagnosis : "";

      appointment.status.completed = completed
        ? completed
        : appointment.status.completed;

      appointment.status.accepted = accepted
        ? accepted
        : appointment.status.accepted;

      appointment.status.completationDate = completed ? dayjs() : "";
    }

    appointment.selectedSchedule.selectedDate = selectedDate;
    appointment.selectedSchedule.selectedHour = selectedHour;
    appointment.doctor = doctor ? doctor : appointment.doctor;
    appointment.reason = reason ? reason : appointment.reason;
    appointment.specificRequest = specificRequest ? specificRequest : "";

    await appointment.save();

    return res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};
