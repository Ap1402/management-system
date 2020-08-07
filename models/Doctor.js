const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Appointment = require("./Appointment");

const DoctorSchema = new mongoose.Schema(
  {
    schedule: [
      {
        // 0: Sunday 1: Monday 2: Tuesday...
        day: {
          type: String,
          enum: ["0", "1", "2", "3", "4", "5", "6"],
          required: [true, "You need to select a day"],
        },
        start: {
          type: String,
          required: [
            true,
            "You need to set a starting time for your work schedule",
          ],
        },
        end: {
          type: String,
          required: [
            true,
            "You need to set an end time for your work schedule",
          ],
        },
      },
    ],
    unavaliableDates: [
      {
        type: Date,
      },
    ],
    department: {
      type: Schema.Types.ObjectId,
      ref: "department",
      required: [true, "Doctor needs to have a department assigned"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Doctor needs to have an User assigned"],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },

  { timestamps: true }
);

// Gets unavaliable dates and working days.
DoctorSchema.statics.getUnavaliableDates = async function (doctorID) {
  try {
    const futureAppointments = await Appointment.find({
      doctor: doctorID,
      "selectedSchedule.selectedDate": { $gte: Date.now() },
    }).select("selectedSchedule.selectedDate");
    const doctor = await Doctor.findById(doctorID);
    console.log(futureAppointments);
    // Getting unavaliable Dates from doctor and actual appointments
    const unavaliableDates = [];
    futureAppointments.forEach((appointment) => {
      unavaliableDates.push(appointment.selectedSchedule.selectedDate);
    });
    doctor.unavaliableDates.forEach((date) => {
      unavaliableDates.push(date);
    });

    const workingDays = [];
    doctor.schedule.forEach((schedule) => {
      workingDays.push(schedule.day);
    });
    return { workingDays, unavaliableDates };
  } catch (error) {
    return error;
  }
};

DoctorSchema.statics.getUnavaliableTime = async function (
  doctorID,
  dateString
) {
  const date = new Date(dateString);
  try {
    const appointmentsByDate = await Appointment.find({
      doctor: doctorID,
      "selectedSchedule.selectedDate": date,
    });
    // Creating unavaliableTime
    const unavaliableTime = [];

    appointmentsByDate.forEach((appointment) => {
      unavaliableTime.push(
        appointment.selectedSchedule.selectedHour +
          ":" +
          appointment.selectedSchedule.selectedMinutes
      );
    });
    // creating schedule
    const schedule = {};
    const docSchedule = await Doctor.findOne({
      _id: doctorID,
    }).select("schedule");
    // Iterating through schedule to find specifid day
    docSchedule.schedule.forEach((obj) => {
      if (obj.day == date.getDay()) {
        schedule.start = obj.start;
        schedule.end = obj.end;
      }
    });
    return { schedule, unavaliableTime };
  } catch (error) {
    throw Error(error);
  }
};

module.exports = Doctor = mongoose.model("doctor", DoctorSchema);
