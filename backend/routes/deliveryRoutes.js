const express = require('express');
const router = express.Router();
const { getDeliveryBoys, addDeliveryBoy, sendOtpToDeliveryBoy, verifyDeliveryBoyOtp, getDeliveryBoyByEmail, getAssignedOrdersForDeliveryBoy, updateDeliveryStatus } = require('../controllers/deliveryController');

// Fetch all delivery boys
router.get('/', getDeliveryBoys);

// ✅ Fetch a single delivery boy by ID
router.get('/:email', getDeliveryBoyByEmail);

// Add a new delivery boy
router.post('/', addDeliveryBoy);

router.get('/assigned-orders/:email', getAssignedOrdersForDeliveryBoy);

// 🆕 Send OTP
router.post('/send-otp', sendOtpToDeliveryBoy);

// 🆕 Verify OTP
router.post('/verify-otp', verifyDeliveryBoyOtp);

// Add this route
router.put('/update-delivery-status/:orderId', updateDeliveryStatus);

// router.get("/", getAllDeliveryBoys); // This will respond to /api/delivery

module.exports = router;