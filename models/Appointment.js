const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("config");

const AppointmentSchema = new mongoose.Schema(
  {
    requester: {
      type: Schema.Types.ObjectId,
      ref: "patient",
      required: [true, "A requester is needed"]
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "doctor",
      required: [true, "A doctor is needed"]
    },
    assignedDate: {
      type: Date,
      required: [true, "A date is required"]
    },
    description: {
      type: String,
      required: true
    },
    diagnosis: {
      type: String,
      required: true
    },
    status: {
      completed: {
        type: Boolean,
        default: false,
        required: [true, "Completation status is needed"]
      },
      completationDate: {
        type: Date
      }
    }
  },
  { timestamps: true }
);

module.exports = Appointment = mongoose.model("appointment", AppointmentSchema);
