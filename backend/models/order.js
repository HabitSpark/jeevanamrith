const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'assigned', 'delivered', 'failed', 'cancelled'],
        default: 'pending'
    },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    shippingAddress: {
        type: Object,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    paymentDetails: {
        type: Object, // Store payment details like UPI ID, card details, etc.
        required: false,
    },
    deliveryBoyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryBoy',
        default: null
    }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;