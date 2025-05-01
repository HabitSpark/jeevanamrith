const Product = require("../models/Product");

// Get all products
const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find(); // Assuming you have a Product model
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
};

// Get a product by ID
const getProductById = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
};


// Create a new product (for admins)
const createProduct = async(req, res) => {
    const { productId, name, category, price, description, image, stock } = req.body;

    if (!productId || !name || !category || !price || !stock) {
        return res.status(400).json({ message: "All required fields must be provided" });
    }

    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error); // Log the exact error
        res.status(500).json({ message: "Error creating product", error });
    }
};


// Update a product by ID (for admins)
const updateProduct = async(req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body, { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error updating product", error });
    }
};

// Delete a product by ID (for admins)
const deleteProduct = async(req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error });
    }
};

const searchProducts = async(req, res) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ message: "No search query provided" });
        }

        const products = await Product.find({
            name: { $regex: query, $options: "i" } // name field ko match karna (case insensitive)
        });

        res.json(products);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: "Server Error" });
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts
};