const express = require("express");
const router = express.Router();
const {
    placePurchase,
    getUserPurchases,
    getAllPurchases,
    updateDeliveryStatus,
    getPurchesById,
    assignOrderToDeliveryBoy, // import assignOrder
} = require("../controllers/purchaseController");

// Existing routes
router.post("/place", placePurchase);
router.get("/user/:userId", getUserPurchases);
router.get("/all", getAllPurchases);
router.put("/update-status/:purchaseId", updateDeliveryStatus);
router.get("/:purchaseId", getPurchesById);

// ✅ NEW: Assign Delivery Boy Route
router.put("/:purchaseId/assign", assignOrderToDeliveryBoy);

module.exports = router;