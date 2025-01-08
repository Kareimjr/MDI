require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoutes.js');
const mediaRoutes = require('./routes/instructorRoutes/mediaRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const instructorCourseRoutes = require('./routes/instructorRoutes/courseRoutes.js');
const studentCourseRoutes = require('./routes/studentRoutes/courseRoutes.js');
const paymentRoutes = require("./routes/paymentRoutes.js");
const studentCourseProgressRoute = require("./routes/studentRoutes/courseProgressRoute.js");
const studentBoughtCoursesRoutes = require("./routes/studentRoutes/studentCoursesRoute.js");
const cookieParser = require('cookie-parser');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// CORS configuration
const corsOptions = {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());


// Database connection
mongoose.connect(MONGO_URI)
    .then(() => console.log('Database connected'))
    .catch((err) => console.error(err));

// Routes configuration
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/media', mediaRoutes);
app.use('/instructor/course', instructorCourseRoutes);
app.use('/student/course', studentCourseRoutes);
app.use("/api/payments", paymentRoutes);
app.use('/student/courses-bought', studentBoughtCoursesRoutes);
app.use('/student/course-progress', studentCourseProgressRoute);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong',
    });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
    });

    ws.send('Hello, you are connected to the WebSocket server');
});
