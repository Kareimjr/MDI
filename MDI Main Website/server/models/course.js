const mongoose = require('mongoose');

const LectureSchema = new mongoose.Schema({
    title: String,
    videoUrl: String,
    public_id: String,
    freePreview: Boolean,

})

const CourseSchema = new mongoose.Schema({
    instructorId: String,
    instructorName: String,
    date: String,
    title: String,
    category: String,
    level: String,
    primaryLanguage: String,
    subtitle: String,
    description: String,
    image: String,
    welcomeMessage: String,
    pricing: Number,
    objectives: String,
    students: [
        {
          studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          studentName: String,
          studentEmail: String,
          studentResidence: String,
        }
      ],
    curriculum: [LectureSchema],
    isPublished : Boolean,
});


module.exports = mongoose.model('Course', CourseSchema)