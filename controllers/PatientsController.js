const Patient = require("../models/Patient");
const { validationResult } = require("express-validator");

exports.createPatient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { address, dni, birthDate, allergies, specificInfo } = req.body;

    const patientFields = {};
    patientFields.address = address;
    patientFields.dni = dni;
    patientFields.birthDate = birthDate;
    patientFields.allergies = allergies;
    patientFields.specificInfo = specificInfo;

    if (!req.user.role == "patient") {
      if (req.body.userId) {
        patientFields.user = req.body.userId;
      }
    } else {
      patientFields.user = req.user._id;
    }

    Patient.findOne({ user: patientFields.user }).then((patient) => {
      if (patient) {
        Patient.findOneAndUpdate(
          { user: patientFields.user },
          { $set: patientFields },
          { new: true }
        ).then((patient) => res.status(200).json(patient));
      } else {
        new Patient(patientFields)
          .save()
          .then((patient) => res.status(201).json(patient));
      }
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server error");
  }
};

exports.deletePatientById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const patient = await Patient.findByIdAndDelete(req.params.patient_id);
    res.status(200).json(patient);
  } catch (err) {
    console.error(err);
    res.status(400).json("Server problem");
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    console.error(err);
    res.status(400).json("Server problem");
  }
};
