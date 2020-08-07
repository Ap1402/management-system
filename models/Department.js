const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DepartmentSchemas = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "A department with this name already exists!"],
      required: [true, "A name for the deparment is needed!"],
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

/* DepartmentSchemas.methods.setAppointmentCompleted = async function() {
  const apppointment = this;
  apppointment.status.completed = true;
  apppointment.status.completationDate = Date.now();
  await apppointment.save();
}; */
module.exports = Department = mongoose.model("department", DepartmentSchemas);
