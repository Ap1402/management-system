const Department = require("../models/Department");

const { validationResult } = require("express-validator");
const Doctor = require("../models/Doctor");
const ErrorHandler = require("../helpers/ErrorHandler");

// Get all doctors by department get /api/departments/:name
exports.getAllDoctorsByDepartment = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new ErrorHandler("400", errors.array()));
  }

  try {
    const doctors = await Doctor.find({}).populate({
      path: "deparment",
      match: { name: req.params.name },
    });

    res.status(200).json(doctors);
  } catch (err) {
    next(err);
  }
};

// Assign doctor to departments post /api/departments/assign-doctor
exports.assignDoctorsToDepartment = async (req, res) => {
  const departmentId = req.body.departmentId;
  const departmentName = req.body.departmentName;
  const doctorId = req.body.doctorId;

  try {
    const department = await Department.findOne({ name: departmentName });

    if (!department) {
      return res
        .status(404)
        .send({ errors: [{ msg: "There is no department with this name" }] });
    }
    const doctor = await Doctor.findById(doctorId);

    if (!doctor) {
      return res
        .status(404)
        .send({ errors: [{ msg: "There is no doctor with this id" }] });
    }

    doctor.department = department;
    doctor.save();

    return res.status(201).json(doctor);
  } catch (err) {
    next(err);
  }
};

// Show all departments Get /api/departments/
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("doctors", [
      "_id",
      "name",
    ]);

    res.status(200).json(departments);
  } catch (err) {
    next(err);
  }
};

// Create New department Post /api/departments/
exports.createDepartment = async (req, res) => {
  const newDepartment = new Department({
    name: req.body.name,
  });
  try {
    await newDepartment.save();

    res.status(201).json(newDepartment);
  } catch (err) {
    next(err);
  }
};
