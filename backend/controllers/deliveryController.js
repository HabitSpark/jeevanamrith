const nodemailer = require('nodemailer');
const Purchase = require('../models/purchase')
const DeliveryBoy = require('../models/DeliveryBoy');
const sendOtpEmail = require('../utils/sendOtpEmail');



// Send OTP to Delivery Boy's email
exports.sendOtpToDeliveryBoy = async(req, res) => {
    const { email } = req.body;

    try {
        const deliveryBoy = await DeliveryBoy.findOne({ email });

        if (!deliveryBoy) {
            return res.status(404).json({ message: 'Delivery Boy not found. Please contact admin.' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        // Save OTP and expiry (5 min) to delivery boy
        deliveryBoy.otp = otp;
        deliveryBoy.otpExpiry = Date.now() + 5 * 60 * 1000;
        await deliveryBoy.save();

        // Send OTP Email using utility function
        await sendOtpEmail(email, otp);

        res.status(200).json({ message: 'OTP sent successfully!' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Verify OTP and Login
// ✅ Corrected verifyDeliveryBoyOtp:
exports.verifyDeliveryBoyOtp = async(req, res) => {
    const { email, otp } = req.body;

    try {
        const deliveryBoy = await DeliveryBoy.findOne({ email });

        if (!deliveryBoy) {
            return res.status(404).json({ message: 'Delivery Boy not found' });
        }

        if (deliveryBoy.otp !== Number(otp)) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (deliveryBoy.otpExpiry < Date.now()) {
            return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
        }

        // Clear OTP after successful login
        deliveryBoy.otp = null;
        deliveryBoy.otpExpiry = null;
        await deliveryBoy.save();

        // ✅ Send full delivery boy details in response
        res.status(200).json({
            message: 'Login successful!',
            deliveryBoy: {
                name: deliveryBoy.name,
                email: deliveryBoy.email,
                phone: deliveryBoy.phone,
                vehicle: deliveryBoy.vehicle,
            },
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Failed to verify OTP', error: error.message });
    }
};



// Fetch all delivery boys
// Fetch all delivery boys
exports.getDeliveryBoys = async(req, res) => {
    try {
        const boys = await DeliveryBoy.find()
            .populate({
                path: 'assignedOrders',
                populate: {
                    path: 'userId', // populate the User info in Purchase
                    select: 'name email'
                }
            });

        // Return the fetched delivery boys
        res.status(200).json(boys);
    } catch (error) {
        console.error('Error fetching delivery boys:', error);
        res.status(500).json({ message: 'Error fetching delivery boys', error: error.message });
    }
};

// Add a new delivery boy
// controllers/deliveryController.js

// Add a new delivery boy
exports.addDeliveryBoy = async(req, res) => {
    const { name, email, phone, vehicle } = req.body;

    try {
        // Check if all required fields are provided
        if (!phone || !vehicle) {
            return res.status(400).json({ message: 'Phone and Vehicle are required' });
        }

        // Check if a delivery boy with the same email already exists
        const existingDeliveryBoy = await DeliveryBoy.findOne({ email });
        if (existingDeliveryBoy) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create a new delivery boy if all fields are valid
        const newDeliveryBoy = new DeliveryBoy({
            name,
            email,
            phone,
            vehicle,
        });

        await newDeliveryBoy.save();
        res.status(201).json({ message: 'Delivery boy added successfully', deliveryBoy: newDeliveryBoy });
    } catch (error) {
        console.error('Error adding delivery boy:', error);
        res.status(500).json({ message: 'Error adding delivery boy', error: error.message });
    }
};

// exports.getAllDeliveryBoys = async(req, res) => {
//     try {
//         const deliveryBoys = await DeliveryBoy.find(); // assuming DeliveryBoy model
//         res.status(200).json(deliveryBoys);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// ✅ Fetch single Delivery Boy by ID
exports.getDeliveryBoyByEmail = async(req, res) => {
    const { email } = req.params; // email from params

    try {
        const deliveryBoy = await DeliveryBoy.findOne({ email }); // Query by email field

        if (!deliveryBoy) {
            return res.status(404).json({ message: 'Delivery Boy not found' });
        }

        res.status(200).json(deliveryBoy);
    } catch (error) {
        console.error('Error fetching delivery boy by email:', error);
        res.status(500).json({ message: 'Error fetching delivery boy details', error: error.message });
    }
};

exports.getAssignedOrdersForDeliveryBoy = async(req, res) => {
    try {
        const { email } = req.params;
        const deliveryBoy = await DeliveryBoy.findOne({ email });

        if (!deliveryBoy) {
            return res.status(404).json({ message: "Delivery boy not found" });
        }

        // Fetch all assigned orders
        const assignedOrders = await Purchase.find({ _id: { $in: deliveryBoy.assignedOrders } });

        res.status(200).json(assignedOrders);
    } catch (error) {
        console.error("Error fetching assigned orders:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.updateDeliveryStatus = async(req, res) => {
    try {
        const { orderId } = req.params;

        const updatedOrder = await Purchase.findByIdAndUpdate(
            orderId, { deliveryStatus: "Delivery Done" }, { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Delivery status updated successfully", updatedOrder });
    } catch (error) {
        console.error("Error updating delivery status:", error);
        res.status(500).json({ message: "Server error while updating delivery status" });
    }
};