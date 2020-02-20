const Patient = require("../models/Patient");
const { validationResult } = require("express-validator");

exports.createPatient = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { address, dni, history } = req.body;

    const patientFields = {};
    patientFields.address = address;
    patientFields.dni = dni;
    patientFields.history = history;
    patientFields.user = req.user._id;

    Patient.findOne({ user: req.user._id }).then(patient => {
      if (patient) {
        Patient.findOneAndUpdate(
          { user: req.user._id },
          { $set: patientFields },
          { new: true }
        ).then(patient => res.status(200).json(patient));
      } else {
        new Patient(patientFields)
          .save()
          .then(patient => res.status(200).json(patient));
      }
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server error");
  }
};
