const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, param } = require("express-validator");
const DoctorsController = require("../../controllers/DoctorsController");
const acl = require("../../middleware/acl");

//@route Post api/doctors
//@desc Create/update doctor
//@access Private admin only
router.post(
  "/",
  [
    check("userId", "Please include a user").notEmpty(),
    check(
      "departmentId",
      "Please include a department for this doctor"
    ).notEmpty(),
  ],
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

//@route GET api/doctors
//@desc Get doctor by Id
//@access private patient
router.get(
  "/:doctorId",
  auth,
  acl.grantAccess("readAny", "doctor"),
  param("doctorId", "This is not a valid doctor id").isMongoId().notEmpty(),
  DoctorsController.getDoctorById
);

//@route GET doctors/check-date/ ID
//@desc Gets unavaliable dates and working days by doctor ID
//@access private
router.get(
  "/get-dates/:doctorId",
  auth,
  acl.grantAccess("readAny", "doctor"),
  param("doctorId", "This is not a valid doctor id").isMongoId().notEmpty(),
  DoctorsController.getDatesById
);

//@route GET doctors/get-timebydate/ ID / date
//@desc Gets unavaliable hours and work schedule by date
//@access private
router.get(
  "/get-timebydate/:doctorId/:date",
  auth,
  acl.grantAccess("readAny", "doctor"),
  param("doctorId", "This is not a valid doctor id").isMongoId().notEmpty(),
  DoctorsController.getTimeScheduleByDate
);

//@route DELETE doctors/doctor_id
//@desc DELETE doctor by id
//@access private, admin only
router.delete(
  "/:doctorId",
  auth,
  acl.grantAccess("deleteAny", "doctor"),
  param("doctorId", "This is not a valid doctor id").isMongoId().notEmpty(),
  DoctorsController.deleteDoctorById
);

//@route POST doctors/set-schedul/:doctorId
//@desc POST set schedule and unavaliable dates to doctor id, param doctorId must be a valid mongoId
//@access private, admin only or actual doctor logged
router.post(
  "/set-schedule/:doctorId",
  auth,
  acl.grantAccess("updateOwn", "doctor"),
  param("doctorId", "This is not a valid doctor id").isMongoId().notEmpty(),
  DoctorsController.setDoctorSchedule
);

module.exports = router;
