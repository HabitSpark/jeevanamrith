const Purchase = require("../models/purchase");
const DeliveryBoy = require('../models/DeliveryBoy');

// Place a new purchase
const placePurchase = async(req, res) => {
    try {
        const { userId, items, shippingAddress, paymentMethod, totalAmount } = req.body;
        const newPurchase = new Purchase({
            userId,
            items,
            shippingAddress,
            paymentMethod,
            totalAmount,
        });

        await newPurchase.save();
        res.status(201).json({ message: "Purchase successful!", purchaseId: newPurchase._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Purchase failed" });
    }
};

// Get purchases for a specific user
const mongoose = require("mongoose");

const getUserPurchases = async(req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid userId parameter" });
        }

        const purchases = await Purchase.find({ userId })
            .populate("items.productId")
            .sort({ createdAt: -1 });

        res.status(200).json(purchases);
    } catch (err) {
        console.error("Error fetching user purchases:", err);
        res.status(500).json({ error: "Failed to fetch purchases" });
    }
};

// ✅ Get all orders (Admin)
// const getAllPurchases = async(req, res) => {
//     try {
//         const purchases = await Purchase.find().sort({ createdAt: -1 }).populate("userId deliveryBoyId");
//         res.json(purchases);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching orders", error: error.message });
//     }
// };

const getAllPurchases = async(req, res) => {
    try {
        const purchases = await Purchase.find()
            .populate("userId", "name email")
            .populate("items.productId")
            .sort({ createdAt: -1 });

        console.log('Fetched purchases:', purchases); // Log the fetched purchases
        res.status(200).json(purchases);
    } catch (err) {
        console.error("Error fetching all purchases:", err);
        res.status(500).json({ error: "Failed to fetch all purchases" });
    }
};

// Update delivery status
const updateDeliveryStatus = async(req, res) => {
    try {
        const { purchaseId } = req.params;
        const { status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(purchaseId)) {
            return res.status(400).json({ error: "Invalid purchaseId parameter" });
        }

        const allowedStatuses = ["pending", "shipped", "delivered", "cancelled"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid delivery status" });
        }

        const updatedPurchase = await Purchase.findByIdAndUpdate(
            purchaseId, { deliveryStatus: status }, { new: true }
        );

        if (!updatedPurchase) {
            return res.status(404).json({ error: "Purchase not found" });
        }

        res.status(200).json({ message: "Delivery status updated", updatedPurchase });
    } catch (err) {
        console.error("Error updating delivery status:", err.message);
        res.status(500).json({ error: "Failed to update delivery status" });
    }
};

// Assign order to delivery boy
const assignOrderToDeliveryBoy = async(req, res) => {
    const { purchaseId } = req.params;
    const { deliveryBoyId } = req.body;

    try {
        const purchase = await Purchase.findByIdAndUpdate(
            purchaseId, { deliveryBoyId, deliveryStatus: 'assigned' }, { new: true, runValidators: false } // disabling validators during partial updates
        );

        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

        const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
        if (!deliveryBoy) return res.status(404).json({ message: 'Delivery boy not found' });

        // Avoid duplicate orders
        if (!deliveryBoy.assignedOrders.includes(purchase._id)) {
            deliveryBoy.assignedOrders.push(purchase._id);
            await deliveryBoy.save();
        }

        res.status(200).json({ message: 'Order assigned successfully' });
    } catch (error) {
        console.error('Assignment error:', error.message);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const getPurchesById = async(req, res) => {
    try {
        const purchase = await Purchase.findById(req.params.purchaseId) // ✅ Correct: Purchase, not purchase
            .populate("deliveryBoyId userId");

        if (!purchase) return res.status(404).json({ message: "Order not found" });
        res.json(purchase);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

module.exports = {
    placePurchase,
    getUserPurchases,
    getAllPurchases,
    updateDeliveryStatus,
    getPurchesById,
    assignOrderToDeliveryBoy,
};