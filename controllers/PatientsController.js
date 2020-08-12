const Patient = require("../models/Patient");
const { validationResult } = require("express-validator");
const ErrorHandler = require("../helpers/ErrorHandler");

exports.createPatient = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new ErrorHandler("400", errors.array()));
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
    next(err);
  }
};

exports.deletePatientById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ErrorHandler("400", errors.array()));
  }
  try {
    const patient = await Patient.findByIdAndDelete(req.params.patientId);
    if (!patient) {
      next(new ErrorHandler(404, "There is no patient with this id"));
    }
    res.status(200).json(patient);
  } catch (err) {
    next(err);
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find();
    res.status(200).json(patients);
  } catch (err) {
    next(err);
  }
};

exports.getPatientById = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(new ErrorHandler("400", errors.array()));
  }

  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId)
      .populate("user", "firstName lastName")
      .select("-createdAt -updatedAt");
    if (!patient) {
      next(new ErrorHandler(404, "There is no patient with this id"));
    }
    res.status(200).json(patient);
  } catch (err) {
    next(err);
  }
};
