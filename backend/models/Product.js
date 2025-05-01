const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: { type: Number, unique: true, required: true },
    name: String,
    category: String,
    price: Number,
    description: String,
    image: String,
    stock: Number,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;