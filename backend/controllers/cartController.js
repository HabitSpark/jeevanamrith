const Cart = require("../models/cart");

// 🛍️ Get the user's cart
exports.getCart = async(req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.json(cart || { items: [], total: 0 });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Error fetching cart", error });
    }
};

// 💾 Save (overwrite) the user's cart
exports.saveCart = async(req, res) => {
    try {
        const { items } = req.body;
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const cart = await Cart.findOneAndUpdate({ userId: req.params.userId }, { items, total }, { upsert: true, new: true });

        res.json(cart);
    } catch (error) {
        console.error("Failed to save cart:", error);
        res.status(500).json({ error: "Failed to save cart" });
    }
};

// ➕ Add a single item to the user's cart
exports.addItemToCart = async(req, res) => {
    try {
        const { item } = req.body;

        let cart = await Cart.findOne({ userId: req.params.userId });

        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [], total: 0 });
        }

        const existingItem = cart.items.find(i => i.productId.toString() === item.productId);

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.items.push(item);
        }

        cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error("Failed to add item to cart:", error);
        res.status(500).json({ error: "Failed to add item to cart" });
    }
};

// 🔄 Update item quantity in the cart
exports.updateItemQuantity = async(req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be at least 1" });
        }

        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) return res.status(404).json({ error: "Item not found in cart" });

        item.quantity = quantity;
        cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// ❌ Remove a single item from the user's cart
exports.removeItemFromCart = async(req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        await cart.save();
        res.json(cart);
    } catch (error) {
        console.error("Failed to remove item from cart:", error);
        res.status(500).json({ error: "Failed to remove item from cart" });
    }
};

// 🗑️ Clear the entire cart
exports.clearCart = async(req, res) => {
    try {
        const updatedCart = await Cart.findOneAndUpdate({ userId: req.params.userId }, { items: [], total: 0 }, { new: true });

        res.json(updatedCart);
    } catch (error) {
        console.error("Failed to clear cart:", error);
        res.status(500).json({ error: "Failed to clear cart" });
    }
};