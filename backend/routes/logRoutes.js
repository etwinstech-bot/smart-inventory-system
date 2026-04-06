// ===============================
// 🕵️ LOG ROUTES (SUPER ADMIN ONLY)
// ===============================

const express = require("express");
const router = express.Router();

const Log = require("../models/Log");
const User = require("../models/user");

// middleware
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

// ===============================
// 📄 GET ALL LOGS
// ===============================
router.get("/", auth, role("superadmin"), async (req, res) => {
    try {
        const logs = await Log.find().sort({ time: -1 });

        // Fetch user details and enrich logs with user names
        const enrichedLogs = await Promise.all(logs.map(async (log) => {
            try {
                const user = await User.findById(log.user);
                return {
                    ...log.toObject(),
                    userName: user ? user.name : "Unknown User"
                };
            } catch (err) {
                return {
                    ...log.toObject(),
                    userName: "Unknown User"
                };
            }
        }));

        res.json(enrichedLogs);

    } catch (err) {
        console.log("LOG FETCH ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;