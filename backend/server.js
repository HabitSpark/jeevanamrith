const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const profileRoutes = require("./routes/profileRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const productRoutes = require("./routes/productRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Add after route handlers in server.js
app.use((err, req, res, next) => {
    console.error('🚨 Global Error Handler:', err);
    res.status(500).json({
        error: process.env.NODE_ENV === 'development' ? err : 'Server error',
        message: 'An unexpected error occurred'
    });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/purchase", purchaseRoutes)
app.use("/api/products", productRoutes);
app.use("/api/delivery", deliveryRoutes);

// Default route (optional for testing)
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});