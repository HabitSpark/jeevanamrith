const express = require("express");
const router = express.Router();

const {
    placeOrder,
    getOrdersByUser,
    getOrderById,
    getAllOrders,
    // assignOrderToDeliveryBoy
} = require("../controllers/orderController");

// Place a new order
router.post("/checkout", placeOrder);

// Get all orders for a specific user
router.get("/user/:userId", getOrdersByUser);

// Get a specific order by order ID
router.get("/:orderId", getOrderById);

// Get all orders (admin)
router.get("/", getAllOrders);

// Assign order to a delivery boy
// router.put("/:orderId/assign", assignOrderToDeliveryBoy);

module.exports = router;