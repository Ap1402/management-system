const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const DepartmentsController = require("../../controllers/DepartmentsController");
const acl = require("../../middleware/acl");

//@route GET api/departments/
//@desc get all departments
//@access public
router.get(
  "/",
  acl.grantAccess("readAny", "department"),
  DepartmentsController.getAllDepartments
);

//@route Post api/departments/
//@desc create or update department
//@access private, admin only
router.post(
  "/",
  auth,
  acl.grantAccess("createAny", "department"),
  DepartmentsController.createDepartment
);

//@route Post api/departments/assign
//@desc assign doctors to department
//@access private, admin only
router.post(
  "/assign",
  auth,
  acl.grantAccess("updateAny", "department"),
  DepartmentsController.assignDoctorsToDepartment
);

//@route GET api/departments/:department name
//@desc get all doctros by department name
//@access public
router.get("/:name", DepartmentsController.getAllDoctorsByDepartment);

module.exports = router;
