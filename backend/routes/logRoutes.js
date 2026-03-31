// ===============================
// 🕵️ LOG ROUTES (SUPER ADMIN ONLY)
// ===============================

const express = require("express");
const router = express.Router();

const Log = require("../models/Log");

// middleware
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// ===============================
// 📄 GET ALL LOGS
// ===============================
router.get("/", auth, role("superadmin"), async (req, res) => {
    try {
        const logs = await Log.find().sort({ time: -1 });

        res.json(logs);

    } catch (err) {
        console.log("LOG FETCH ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;