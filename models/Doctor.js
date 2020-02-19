const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DoctorSchema = new mongoose.Schema(
  {
    schedule: {
      start: {
        type: Date,
        required: [
          true,
          "You need to set a starting time for your work schedule"
        ]
      },
      end: {
        type: Date,
        required: [true, "You need to set an end time for your work schedule"]
      }
    },
    field: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is need"]
    },
    active: {
      type: Boolean,
      default: true
    }
  },

  { timestamps: true }
);

module.exports = Doctor = mongoose.model("doctor", DoctorSchema);
