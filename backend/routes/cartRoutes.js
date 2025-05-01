const express = require("express");
const router = express.Router();

const {
    getCart,
    saveCart,
    addItemToCart,
    removeItemFromCart,
    clearCart
} = require("../controllers/cartController");

// Get cart by user ID
router.get("/:userId", getCart);

// Save full cart (replace or create)
router.post("/:userId", saveCart);

// Add item to cart
router.post("/:userId/add", addItemToCart);

// Remove a specific item from cart
router.delete("/:userId/remove/:productId", removeItemFromCart);

// Clear the entire cart
router.delete("/:userId/clear", clearCart);

module.exports = router;