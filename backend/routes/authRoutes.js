const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET = "mysecretkey";

// ✅ REGISTER
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

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
        res.status(500).json({ error: err.message });
    }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            SECRET,
            { expiresIn: "1d" }
        );

        res.json({ token, role: user.role });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;