// ===============================
// 🔐 AUTH ROUTES (FINAL CLEAN)
// ===============================

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// Middleware
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const SECRET = "mysecretkey";


// ===============================
// 📝 REGISTER (FOR INITIAL SETUP)
// ===============================
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 🔒 HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        res.json({ message: "User registered" });

    } catch (err) {
        console.log("REGISTER ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// ===============================
// 🔐 LOGIN
// ===============================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            role: user.role
        });

    } catch (err) {
        console.log("LOGIN ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


// ===============================
// 👤 CREATE USER (ADMIN ONLY)
// ===============================
router.post("/create-user", auth, role("admin", "superadmin"), async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 🔒 ALWAYS HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        res.json({ message: "User created successfully" });

    } catch (err) {
        console.log("CREATE USER ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;