const mongoose = require("mongoose");
const usersModel = require("../models/user");
const purchase = require("../models/purchase");
// const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sendOtpEmail = require('../utils/sendOtpEmail');

// In-memory OTP store (for simplicity)
let otpStore = {}; // OTP Store

exports.sendOtp = async(req, res) => {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
        const email = req.body.email;

        // Store OTP in memory with email as key
        otpStore[email] = otp;

        // Send OTP to email using the sendOtpEmail function
        await sendOtpEmail(email, otp);

        console.log("OTP sent successfully");
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        res.status(500).json({ message: "Error sending OTP", error: error.message });
    }
};

exports.resetPassword = async(req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        // Check if OTP is valid
        if (otpStore[email] !== parseInt(otp)) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Find user by email
        const user = await usersModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user password
        user.password = newPassword;
        await user.save();

        // Clear OTP after successful password reset
        delete otpStore[email];

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).json({ message: "Error resetting password" });
    }
};


exports.registerUser = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await usersModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const user = await usersModel.create({ name, email, password });
        res.status(201).json({ message: "User registered successfully", user });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: "Server error during registration" });
    }
};

exports.getUserProfile = async(req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid ID format" });
        }

        const user = await usersModel.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json(user); // Remove the `success: true` so frontend matches structure
    } catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Server error" });
    }
};


//put profile id
exports.updateUserProfile = async(req, res) => {
    try {
        const { name, email } = req.body;
        const user = await usersModel.findByIdAndUpdate(
            req.params.id, { name, email }, { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error updating profile' });
    }
};


// PUT /api/profile/:id/picture
exports.uploadProfilePicture = async(req, res) => {
    try {
        const { imageUrl } = req.body;
        const user = await usersModel.findByIdAndUpdate(
            req.params.id, { profilePicture: imageUrl }, { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error uploading picture' });
    }
};


// DELETE /api/profile/:id/picture
exports.removeProfilePicture = async(req, res) => {
    try {
        const user = await usersModel.findByIdAndUpdate(
            req.params.id, { profilePicture: '' }, { new: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error removing picture' });
    }
};

exports.getUserPurchases = async(req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        const purchases = await Purchase.find({ userId }).populate({
            path: 'items.productId',
            model: 'Product', // Ensure this matches your Product model name exactly
            select: 'name price image' // Only include necessary fields
        });

        res.status(200).json(purchases);
    } catch (err) {
        console.error('❌ Error fetching purchases:', err);
        res.status(500).json({
            message: 'Error fetching purchases',
            error: err.message // Include error message for debugging
        });
    }
};


exports.getAllUsers = async(req, res) => {
    try {
        const users = await usersModel.find();
        res.status(200).json(users); // ✅ This sends a plain array
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Error fetching users" });
    }
};