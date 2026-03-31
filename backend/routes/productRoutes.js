// ===============================
// PRODUCT ROUTES (FULL VERSION)
// ===============================

// Import dependencies
const express = require("express");
const router = express.Router();

// Import models
const Product = require("../models/Product");
const Log = require("../models/Log");

// Import middleware
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// ===============================
// 📦 GET ALL PRODUCTS
// ===============================
// Access: All logged-in users
router.get("/", auth, async (req, res) => {
    try {
        const products = await Product.find();

        // Log viewing activity
        await Log.create({
            user: req.user.id,
            action: "Viewed all products"
        });

        res.json(products);

    } catch (err) {
        console.log("GET PRODUCTS ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// ===============================
// ➕ ADD PRODUCT
// ===============================
// Access: Admin + Super Admin
router.post("/add", auth, role("admin", "superadmin"), async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;

        // Create new product
        const product = new Product({
            name,
            category,
            price: Number(price),
            quantity: Number(quantity)
        });

        const savedProduct = await product.save();

        // Log action
        await Log.create({
            user: req.user.id,
            action: `Added product ${name}`
        });

        res.json(savedProduct);

    } catch (err) {
        console.log("ADD PRODUCT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// ===============================
// ✏️ UPDATE PRODUCT
// ===============================
// Access: Admin + Super Admin
router.put("/:id", auth, role("admin", "superadmin"), async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        // Log action
        await Log.create({
            user: req.user.id,
            action: `Updated product ${updated.name}`
        });

        res.json(updated);

    } catch (err) {
        console.log("UPDATE PRODUCT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// ===============================
// 🗑️ DELETE PRODUCT
// ===============================
// Access: Admin + Super Admin
router.delete("/:id", auth, role("admin", "superadmin"), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        // Log action
        await Log.create({
            user: req.user.id,
            action: `Deleted product ${product.name}`
        });

        res.json({ message: "Product deleted" });

    } catch (err) {
        console.log("DELETE PRODUCT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// ===============================
// 📄 GET SINGLE PRODUCT
// ===============================
// (Optional but useful)
// Access: All logged-in users
router.get("/:id", auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        // Log action
        await Log.create({
            user: req.user.id,
            action: `Viewed product ${product.name}`
        });

        res.json(product);

    } catch (err) {
        console.log("GET SINGLE PRODUCT ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// ===============================
// EXPORT ROUTER
// ===============================
module.exports = router;