const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.registerUser);
router.get("/", userController.getAllUsers); // Make sure this route exists for fetching all users
router.get("/profile/:id", userController.getUserProfile);
router.put("/profile/:id", userController.updateUserProfile); // updated route for updating profile
router.put("/profile/:id/picture", userController.uploadProfilePicture); // updated route for uploading picture
router.delete("/profile/:id/picture", userController.removeProfilePicture);

router.get("/users/:id/purchases", userController.getUserPurchases);

// Routes for OTP and password reset
router.post("/send-otp", userController.sendOtp); // Send OTP
router.post("/reset-password", userController.resetPassword); // Reset password after OTP verification

module.exports = router;