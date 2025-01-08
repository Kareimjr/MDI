const express = require('express');
const {getAllStudentViewCourses, getStudentViewCourseDetails} = require('../../controllers/studentController/courseController');
const router = express.Router();

router.get('/get', getAllStudentViewCourses);
router.get('/get/details/:id/:studentId', getStudentViewCourseDetails);

module.exports = router;