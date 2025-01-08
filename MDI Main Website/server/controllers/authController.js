const userModel = require('../models/userModel.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer.js');
const {WELCOME_EMAIL_TEMPLETE, RESET_PASSWORD_EMAIL_TEMPLETE} = require('../config/emailTemplates.js')

const register = async (req, res) => {
    const { name, email, residence, password } = req.body;

    if (!name || !email || !residence || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name,
            email,
            residence,
            password: hashedPassword,
        });
        await user.save();

        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            residence: user.residence,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Send welcome email to user after registration
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to MDI Learning Platform',
            // text: `Hello ${name}, welcome to our platform, your account has been created with email id: ${email}. We are glad to have you.`,
            html : WELCOME_EMAIL_TEMPLETE.replace("{{name}}", user.name)
        };
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Registration completed successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    residence: user.residence,
                    role: user.role,
                }
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Email',
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Password',
            });
        }

        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            residence: user.residence,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    residence: user.residence,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.status(200).json({
            success: true,
            message: 'User logged out successfully',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Password reset functionality

const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required',
        });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;
        await user.save();

        // Send password reset email to user
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Password Reset',
            // text: `Hello ${user.name}, your OTP for resetting your password is ${otp}.`,
            html : RESET_PASSWORD_EMAIL_TEMPLETE.replace("{{otp}}", otp).replace("{{name}}", user.name)
        };
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'Password reset OTP has been sent to your email',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'Email, OTP and new password are required',
        });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }
        if (user.resetOtp === " " || user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }
        if (Date.now() > user.resetOtpExpireAt) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired',
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = " ";
        user.resetOtpExpireAt = 0;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            success: false,
            message: 'Email and OTP are required',
        });
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found',
            });
        }
        if (user.resetOtp === " " || user.resetOtp !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
        }
        if (Date.now() > user.resetOtpExpireAt) {
            return res.status(400).json({
                success: false,
                message: 'OTP expired',
            });
        }
        return res.status(200).json({
            success: true,
            message: 'OTP verified',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

module.exports = { register, login, logout, sendResetOtp, resetPassword, isAuthenticated, verifyOtp };
