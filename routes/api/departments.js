const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check } = require("express-validator");
const DepartmentsController = require("../../controllers/DepartmentsController");
const acl = require("../../middleware/acl");

router.get("/", auth, DepartmentsController.getAllDepartments);
router.post("/", auth, DepartmentsController.createDepartment);

router.post("/assign", auth, DepartmentsController.assignDoctorsToDepartment);

router.get("/:name", auth, DepartmentsController.getAllDoctorsByDepartment);

module.exports = router;
