const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// ✅ Add product (Admin only)
router.post("/add", auth, role("admin"), async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;

        // Validate input
        if (!name || !price || !quantity) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const product = new Product({
            name,
            category,
            price: Number(price),
            quantity: Number(quantity)
        });

        const savedProduct = await product.save();

        res.json(savedProduct);

    } catch (err) {
        console.log("ADD ERROR:", err); // 🔥 THIS WILL SHOW REAL ERROR
        res.status(500).json({ error: err.message });
    }
});

// ✅ Delete product (Admin only)
router.delete("/:id", auth, role("admin"), async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Update product
router.put("/:id", auth, role("admin"), async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            { quantity: Number(req.body.quantity) }, // 🔥 IMPORTANT
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        console.log("UPDATE ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get products
router.get("/", auth, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.log("FETCH ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;