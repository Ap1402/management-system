const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const DoctorsController = require("../../controllers/DoctorsController");
const acl = require("../../middleware/acl");

//@route Post api/doctors
//@desc Create/update doctor
//@access Private admin only
router.post(
  "/",
  auth,
  acl.grantAccess("createAny", "doctor"),
  DoctorsController.createDoctor
);

//@route GET api/doctors
//@desc Get all doctors
//@access private
router.get(
  "/",
  auth,
  acl.grantAccess("readAny", "doctor"),
  DoctorsController.getAllDoctors
);

//@route GET doctors/check-date/ ID
//@desc Gets unavaliable dates and working days by doctor ID
//@access private
router.get(
  "/get-dates/:doctor_id",
  auth,
  acl.grantAccess("readAny", "doctor"),
  DoctorsController.getDatesById
);

//@route GET doctors/get-timebydate/ ID / date
//@desc Gets unavaliable hours and work schedule by date
//@access private
router.get(
  "/get-timebydate/:doctor_id/:date",
  auth,
  acl.grantAccess("readAny", "doctor"),

  DoctorsController.getTimeScheduleByDate
);

//@route DELETE doctors/doctor_id
//@desc DELETE doctor by id
//@access private, admin only
router.delete(
  "/:doctor_id",
  auth,
  acl.grantAccess("deleteAny", "doctor"),
  DoctorsController.deleteDoctorById
);

module.exports = router;
