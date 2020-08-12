const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const PatientsController = require("../../controllers/PatientsController");
const acl = require("../../middleware/acl");

//@route Post api/patients
//@desc Create Patient information for current user
//@access Public
router.post(
  "/",
  [
    check("address", "address is required").not().isEmpty(),
    check("dni", "dni is required").not().isEmpty(),
    check("birthDate", "birthDate is required").not().isEmpty(),
  ],
  auth,
  acl.grantAccess("createOwn", "patient"),
  PatientsController.createPatient
);

//@route GET api/patients
//@desc Get all patients
//@access private doctor and admin only
router.get(
  "/",
  auth,
  acl.grantAccess("readAny", "patient"),
  PatientsController.getAllPatients
);

router.get(
  "/:patientId",
  auth,
  check("patientId", "This is not a valid patient Id").isMongoId().notEmpty(),
  acl.grantAccess("readAny", "patient"),
  PatientsController.getPatientById
);

//@route Delete api/patient/:patientId
//@desc Get all patients
//@access private admin only
router.delete(
  "/:patiendId",
  auth,
  acl.grantAccess("deleteAny", "patient"),
  check("patientId", "This is not a valid patient Id").isMongoId().notEmpty(),
  PatientsController.deletePatientById
);

module.exports = router;
