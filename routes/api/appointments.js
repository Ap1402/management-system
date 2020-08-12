const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, param } = require("express-validator");
const AppointmentsController = require("../../controllers/AppointmentsController");
const acl = require("../../middleware/acl");

//@route Post api/appointments/optional param
//@desc Create Appointment user
//@access Private
router.post(
  "/:userId?",
  [
    check("doctor", "A doctor is required").not().isEmpty(),
    check("selectedDate", "You need to select a date").not().isEmpty(),
    check("selectedHour", "A hour is required").not().isEmpty(),
    check("reason", "A reason is required").not().isEmpty(),
    check("specificInfo", "Your specific info needs to be a string").trim(),
  ],
  auth,
  acl.grantAccess("createOwn", "appointment"),
  AppointmentsController.createAppointment
);

//@route GET api/appointments
//@desc get all appointments
//@access Private, admin only
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
//@access Private, admin only
router.get(
  "/user/:userId",
  auth,
  param("userId", "This is not a valid user id").isMongoId().notEmpty(),
  acl.grantAccess("readAny", "appointment"),
  AppointmentsController.getAppointmentsByUserID
);

// GET all appointments for this doctor
//@access Private, doctor/admin only
router.get(
  "/doctor/:doctorId",
  auth,
  param("doctorId", "This is not a valid doctor id").isMongoId().notEmpty(),
  acl.grantAccess("readOwn", "appointment"),
  AppointmentsController.getAppointmentsByUserID
);

// Put general update appointment route
//@Desc updates appointment
//@access private
router.put(
  "/:appointmentId",
  auth,
  [
    check("doctor", "A doctor is required").not().isEmpty(),
    check("selectedDate", "You need to select a date").not().isEmpty(),
    check("selectedHour", "A hour is required").not().isEmpty(),
    check("reason", "A reason is required").not().isEmpty(),
    check("specificInfo", "Your specific info needs to be a string").trim(),
    param("appointmentId", "This is not a valid appointment id")
      .isMongoId()
      .notEmpty(),
    check("diagnosis", "A diagnosis is required")
      .isString()
      .optional({ nullable: true }),
    check("accepted", "You did not set accepted")
      .isBoolean()
      .optional({ nullable: true }),
    check("completed", "You did not set completed")
      .isBoolean()
      .optional({ nullable: true }),
  ],
  acl.grantAccess("updateOwn", "appointment"),
  AppointmentsController.updateAppointment
);

// Delete appointment by id
//@Desc accept this appointment with any date or hour changes
//@access Private, doctor/admin only
router.delete(
  "/:appointmentId",
  auth,
  param("appointmentId", "This is not a valid appointment id")
    .isMongoId()
    .notEmpty(),
  acl.grantAccess("deleteOwn", "appointment"),
  AppointmentsController.deleteAppointment
);

module.exports = router;
