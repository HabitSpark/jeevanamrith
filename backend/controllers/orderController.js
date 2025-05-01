const Order = require("../models/order");
// const DeliveryBoy = require("../models/DeliveryBoy");

// ✅ Place a new order
const placeOrder = async(req, res) => {
    try {
        const { userId, cartItems, totalAmount, shippingAddress, paymentMethod, paymentDetails } = req.body;

        if (!userId || !cartItems || cartItems.length === 0 || !shippingAddress || !paymentMethod) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        // Ensure cartItems are properly structured
        const formattedCartItems = cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));

        // Add additional payment details (e.g., UPI ID, Card Number, etc.)
        const order = new Order({
            userId,
            items: formattedCartItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            paymentDetails, // Store details such as UPI ID, Card Number, etc.
            status: 'pending', // Order is initially pending until payment is confirmed
        });

        // Save the order to the database
        const savedOrder = await order.save();
        res.status(201).json({ message: "Order placed successfully", order: savedOrder });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Server error while placing order", error: error.message });
    }
};

// ✅ Get orders by a specific user
const getOrdersByUser = async(req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .populate("deliveryBoyId userId");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user orders", error: error.message });
    }
};

// ✅ Get a single order by ID
const getOrderById = async(req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate("deliveryBoyId userId");
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Error fetching order", error: error.message });
    }
};

// ✅ Get all orders (Admin)
const getAllOrders = async(req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate("userId deliveryBoyId");
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Error fetching orders", error: error.message });
    }
};

// // ✅ Assign a delivery boy to an order
// const assignOrderToDeliveryBoy = async(req, res) => {
//     const { orderId } = req.params;
//     const { deliveryBoyId } = req.body;

//     try {
//         const order = await Order.findByIdAndUpdate(
//             orderId, { deliveryBoyId, status: 'assigned' }, { new: true, runValidators: false }
//         );

//         if (!order) return res.status(404).json({ message: 'Order not found' });

//         const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
//         if (!deliveryBoy) return res.status(404).json({ message: 'Delivery boy not found' });

//         // Avoid duplicates in assignedOrders
//         if (!deliveryBoy.assignedOrders.includes(order._id)) {
//             deliveryBoy.assignedOrders.push(order._id);
//             await deliveryBoy.save();
//         }

//         res.status(200).json({ message: 'Order assigned successfully' });
//     } catch (error) {
//         console.error('Assignment error:', error.message);
//         res.status(500).json({ message: 'Internal server error', error: error.message });
//     }
// };
module.exports = {
    placeOrder,
    getOrdersByUser,
    getOrderById,
    getAllOrders,
    // assignOrderToDeliveryBoy,
};