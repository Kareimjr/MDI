const express = require('express');
const {addNewCourse, getAllCourses, getCourseDetailsByID, updateCourseByID} = require('../../controllers/instructorController/courseController')

const router = express.Router();

router.post('/add', addNewCourse);
router.get('/get', getAllCourses);
router.get('/get/details/:id', getCourseDetailsByID);
router.put('/update/:id', updateCourseByID);

module.exports = router;