const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientSchema = new mongoose.Schema(
  {
    address: {
      type: String
    },
    dni: {
      type: String,
      required: [true, "dni is required"]
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    history: {
      type: String
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = Patient = mongoose.model("patient", PatientSchema);
