const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const DoctorsController = require("../../controllers/DoctorsController");

//@route Post api/doctors
//@desc Create Doctor
//@access Private admin only
router.post(
  "/",
  [
    check("start", "start is required")
      .not()
      .isEmpty(),
    check("end", "end is required")
      .not()
      .isEmpty(),
    check("field", "field is required")
      .not()
      .isEmpty(),
    check("userID", "user is required")
      .not()
      .isEmpty()
  ],
  auth,
  DoctorsController.createDoctor
);

module.exports = router;
