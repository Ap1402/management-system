const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const AppointmentsController = require("../../controllers/AppointmentsController");

//@route Post api/users
//@desc Create Patient user
//@access Public
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
  AppointmentsController.createAppointment
);

router.get("/", auth, AppointmentsController.getAllAppoinments);
router.get("/me", auth, AppointmentsController.getActualUserAppointments);
router.get(
  "/user/:userID",
  auth,
  AppointmentsController.getAppointmentsByUserID
);

module.exports = router;
