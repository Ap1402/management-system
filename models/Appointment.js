const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("config");

const AppointmentSchema = new mongoose.Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "patient",
      required: [true, "A requester is needed"],
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "doctor",
      required: [true, "A doctor is needed"],
    },
    selectedSchedule: {
      selectedDate: {
        type: Date,
        required: [true, "A date is required"],
      },
      selectedHour: {
        type: String,
        required: [true, "A specific hour is required"],
      },
      selectedMinutes: {
        type: String,
        required: [true, "minutes are required"],
      },
    },
    reason: {
      type: String,
      required: true,
    },
    diagnosis: {
      type: String,
      default: "",
    },
    status: {
      accepted: {
        type: Boolean,
        default: false,
        required: true,
      },
      completed: {
        type: Boolean,
        default: false,
        required: [true, "Completation status is needed"],
      },
      completationDate: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

AppointmentSchema.virtual("fullTime").get(function () {
  return selectedSchedule.selectedHour + ":" + selectedSchedule.selectedMinutes;
});

/* AppointmentSchema.methods.setAppointmentCompleted = async function() {
  const apppointment = this;
  apppointment.status.completed = true;
  apppointment.status.completationDate = Date.now();
  await apppointment.save();
}; */
module.exports = Appointment = mongoose.model("appointment", AppointmentSchema);
