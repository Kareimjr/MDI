const mongoose = require("mongoose");

const StudentCoursesSchema = new mongoose.Schema({
  userName: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courses: [ // Move the 'courses' array to be the top-level field
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      title: String,
      instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor" },
      instructorName: String,
      dateOfPurchase: Date,
      courseImage: String,
    },
  ],
  studentResidence: String, // Place 'studentResidence' outside the 'courses' array
});

module.exports = mongoose.model("StudentCourses", StudentCoursesSchema);