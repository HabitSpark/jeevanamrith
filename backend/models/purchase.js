const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        name: String,
        price: Number,
        quantity: Number,
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
    shippingAddress: {
        fullName: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    paymentMethod: String,
    deliveryStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'], // Optional: control allowed values
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Purchase", purchaseSchema);