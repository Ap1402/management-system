const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const DoctorsController = require("../../controllers/DoctorsController");
const acl = require("../../middleware/acl");
const Doctor = require("../../models/Doctor");
const Appointment = require("../../models/Appointment");

//@route Post api/doctors
//@desc Create Doctor
//@access Private admin only
router.post(
  "/",
  auth,
  acl.grantAccess("createAny", "doctor"),
  DoctorsController.createDoctor
);

router.get("/", auth, async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(201).json(doctors);
  } catch (err) {
    console.error(err);
    res.status(400).json("Server problem");
  }
});

//@route doctors/check-date/ ID
//@desc Gets unavaliable dates and working days by doctor ID
//@access private
router.get("/get-dates/:doctor_id", auth, async (req, res) => {
  try {
    const { workingDays, unavaliableDates } = await Doctor.getUnavaliableDates(
      req.params.doctor_id
    );
    console.log(new Date("2020-2-28"));
    res
      .status(201)
      .json({ workingDays: workingDays, unavaliableDates: unavaliableDates });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
});
//@route doctors/get-timebydate/ ID / date
//@desc Gets unavaliable hours and work schedule by date
//@access private
router.get("/get-timebydate/:doctor_id/:date", auth, async (req, res) => {
  try {
    const { schedule, unavaliableTime } = await Doctor.getUnavaliableTime(
      req.params.doctor_id,
      req.params.date
    );
    res.status(201).json({ schedule, unavaliableTime });
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
});

module.exports = router;
