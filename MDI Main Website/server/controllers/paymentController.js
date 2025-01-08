// paymentController.js

const { initializePayment, verifyPaystackPayment } = require("../helpers/paystackHelper");
const Order = require("../models/order");
const StudentCourse = require("../models/studentCourses");
const Course = require("../models/course");

const initPayment = async (req, res, next) => {
  try {
    // Destructure with clear variable names
    const {
      email,
      amount,
      courseId,
      courseTitle,
      instructorId,
      instructorName,
      studentId,
      studentResidence,
      userName,
      courseImage,
    } = req.body;

    console.log(req.body);

    if (!email || !amount || !courseId || !studentId) {
      return res.status(400).json({ success: false, message: "Missing required data" });
    }

    // Check for duplicate purchase
    const existingCourse = await StudentCourse.findOne({
      "userId": studentId,
      "courses.courseId": courseId
    });
    if (existingCourse) {
      return res.status(404).json({
        success: false,
        message: 'You have  already bought this course',
    });
    }

    const order = new Order({
      userId: studentId,
      userName: userName,
      userEmail: email,
      courseId,
      courseTitle,
      instructorId,
      instructorName,
      studentResidence,
      coursePricing: amount,
      courseImage: courseImage,
    });
    await order.save();

    const paymentData = {
      email,
      amount: amount * 100 + 300 * 100, // Convert to kobo (plus 300 for processing)
      callback_url: `${process.env.CLIENT_URL}/payment-success`,
      reference: order._id.toString(),
    };

    const result = await initializePayment(paymentData);
    res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { reference } = req.params;

    // *** TODO: Add Paystack signature verification logic here ***
    // Example (using crypto):
    // const secret = process.env.PAYSTACK_SECRET_KEY; 
    // const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    // if (hash !== req.headers['x-paystack-signature']) {
    //   return res.status(400).send('Invalid signature'); 
    // } 

    const result = await verifyPaystackPayment(reference);

    if (result.data.status === 'success') {
      let order = await Order.findById(reference); // Changed 'const' to 'let'
      if (!order) {
        return res.status(404).send('Order not found');
      }

      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.paymentId = result.data.id;
      await order.save();

      let studentCourse = await StudentCourse.findOne({ userId: order.userId });
      if (!studentCourse) {
        studentCourse = new StudentCourse({
          userName: order.userName,
          userId: order.userId,
          courses: [{
            courseId: order.courseId,
            courseImage: order.courseImage,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: new Date(),
            // ... other course details 
          }],
          studentResidence: order.studentResidence
        });
      } else {
        studentCourse.courses.push({
          courseId: order.courseId,
          courseImage: order.courseImage,
          title: order.courseTitle,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: new Date(),
          // ... other course details
        });
        studentCourse.studentResidence = order.studentResidence;
      }

      await studentCourse.save();

      const course = await Course.findById(order.courseId);
      if (course) {
        course.students.addToSet({
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          studentResidence: order.studentResidence
        });
        await course.save();
      }

      res.status(200).json({ success: true, data: result.data });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { initPayment, verifyPayment };