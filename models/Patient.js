const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PatientSchema = new mongoose.Schema(
  {
    address: {
      type: String
    },
    birthDate: {
      type: Date,
      required: [true, "Your birthdate is required"]
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    allergies: {
      type: String
    },
    specificInfo: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = Patient = mongoose.model("patient", PatientSchema);
