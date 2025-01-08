const express = require("express");
const router = express.Router();
const { getCoursesByStudentId } = require("../../controllers/studentController/studentCoursesController");

router.get("/get/:studentId", getCoursesByStudentId);

module.exports = router;
