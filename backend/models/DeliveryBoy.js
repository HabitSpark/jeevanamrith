const mongoose = require('mongoose');

const deliveryBoySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true }, // phone is required
    vehicle: { type: String, required: true },
    assignedOrders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase'
    }],
    otp: { type: Number }, // <== NEW FIELD
    otpExpiry: { type: Date } // <== Optional: OTP expiry
});

const DeliveryBoy = mongoose.model('DeliveryBoy', deliveryBoySchema);
module.exports = DeliveryBoy;