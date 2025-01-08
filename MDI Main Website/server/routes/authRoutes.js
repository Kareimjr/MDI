const express = require('express');
const { register, login, logout, resetPassword, isAuthenticated, sendResetOtp, verifyOtp } = require('../controllers/authController.js');
const userAuth = require('../middleware/userAuth.js');

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/is-auth', userAuth, isAuthenticated);
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/verify-otp', verifyOtp);
authRouter.post('/reset-password', resetPassword);


module.exports = authRouter;
