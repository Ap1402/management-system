const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const AppointmentsController = require("../../controllers/AppointmentsController");
const acl = require("../../middleware/acl");

//@route Post api/appointments
//@desc Create Appointment user
//@access Private
router.post(
  "/",
  [
    check("doctor", "doctor is required")
      .not()
      .isEmpty(),
    check("selectedDate", "selectedDate is required")
      .not()
      .isEmpty(),
    check("description", "description is required")
      .not()
      .isEmpty()
  ],
  auth,
  acl.grantAccess("createOwn", "appointment"),
  AppointmentsController.createAppointment
);

//@route GET api/appointments
//@desc get all appointments
//@access Private, doctor/admin only
router.get(
  "/",
  auth,
  acl.grantAccess("readAny", "appointment"),
  AppointmentsController.getAllAppoinments
);

// GET all current user Appointments
//@access Private, current User Only.
router.get(
  "/me",
  auth,
  acl.grantAccess("readOwn", "appointment"),
  AppointmentsController.getActualUserAppointments
);

// GET all appointments by user ID
//@access Private, doctor/admin only
router.get(
  "/user/:userID",
  auth,
  acl.grantAccess("readAny", "appointment"),
  AppointmentsController.getAppointmentsByUserID
);

module.exports = router;
