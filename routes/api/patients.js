const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const PatientsController = require("../../controllers/PatientsController");

//@route Post api/users
//@desc Create Patient user
//@access Public
router.post(
  "/",
  [
    check("address", "address is required")
      .not()
      .isEmpty(),
    check("dni", "dni is required")
      .not()
      .isEmpty(),
    check("history", "history is required")
      .not()
      .isEmpty()
  ],
  auth,
  PatientsController.createPatient
);

module.exports = router;
