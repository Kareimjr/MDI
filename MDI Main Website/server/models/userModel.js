const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    residence: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    resetOtp: { type: String, default: " " },
    resetOtpExpireAt: { type: Number, default: 0 },
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

module.exports = userModel;
