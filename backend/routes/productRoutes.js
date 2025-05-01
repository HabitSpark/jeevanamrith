const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Route to get all products
router.get("/", productController.getAllProducts);

// Route to get a specific product by its ID
router.get("/:id", productController.getProductById);

// Route to create a new product (for admins)
router.post("/", productController.createProduct);

// Route to update a product by its ID (for admins)
router.put("/:id", productController.updateProduct);

// Route to delete a product by its ID (for admins)
router.delete("/:id", productController.deleteProduct);

// router.get("/search", productController.searchProducts);

router.get('/search', productController.searchProducts);

// router.get("/next-id", productController.getNextProductId);

module.exports = router;