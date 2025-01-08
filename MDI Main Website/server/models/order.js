const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: String,
  userEmail: String,
  orderStatus: { type: String, default: "pending" },
  paymentStatus: { type: String, default: "pending" },
  paymentId: String,
  orderDate: { type: Date, default: Date.now },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor" },
  instructorName: String,
  studentResidence: String,
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  courseTitle: String,
  coursePricing: Number,
  courseImage: String,
});

module.exports = mongoose.model("Order", OrderSchema);
