const Department = require("../models/Department");

const { validationResult } = require("express-validator");

exports.getAllDoctorsByDepartment = async (req, res) => {
  try {
    const department = await Department.find({
      name: req.params.name
    }).populate("doctors", ["name", "schedule"]);

    res.status(201).json(department);
  } catch (err) {
    console.error(err);
    res.status(400).json("Server problem");
  }
};

exports.assignDoctorsToDepartment = async (req, res) => {
  const departmentId = req.body.departmentId;
  const departmentName = req.body.departmentName;
  const doctors = req.body.doctors;
  try {
    const department = await Department.update(
      { name: departmentName },
      { $addToSet: { doctors: doctors } }
    );

    res.status(201).json(department);
  } catch (err) {
    console.error(err);
    res.status(400).json("Server problem");
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("doctors", [
      "_id",
      "name"
    ]);

    res.status(201).json(departments);
  } catch (err) {
    console.error(err);
    res.status(400).json("Server problem");
  }
};

exports.createDepartment = async (req, res) => {
  const newDepartment = new Department({
    name: req.body.name
  });
  try {
    await newDepartment.save();

    res.status(201).json(newDepartment);
  } catch (err) {
    console.error(err);
    res.status(400).json("Server problem");
  }
};
