const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// GET ALL USERS (SUPERADMIN ONLY)
router.get("/", verifyToken, allowRoles("superadmin"), async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SINGLE USER (SUPERADMIN ONLY)
router.get("/:id", verifyToken, allowRoles("superadmin"), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE USER DETAILS (SUPERADMIN ONLY)
router.put("/:id", verifyToken, allowRoles("superadmin"), async (req, res) => {
    try {
        const { name, email, status } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check if email is already taken
        if (email && email !== user.email) {
            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ error: "Email already in use" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (status) user.status = status;
        user.updatedAt = new Date();

        await user.save();
        res.json({ message: "User updated successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CHANGE USER ROLE (SUPERADMIN ONLY)
router.put("/:id/role", verifyToken, allowRoles("superadmin"), async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!["superadmin", "admin", "staff", "user"].includes(role)) {
            return res.status(400).json({ error: "Invalid role" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const oldRole = user.role;
        user.role = role;
        user.updatedAt = new Date();
        await user.save();

        res.json({ message: `Role changed from ${oldRole} to ${role}`, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CHANGE USER PASSWORD (SUPERADMIN ONLY)
router.put("/:id/password", verifyToken, allowRoles("superadmin"), async (req, res) => {
    try {
        const { password } = req.body;
        
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.updatedAt = new Date();
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE USER (SUPERADMIN ONLY)
router.delete("/:id", verifyToken, allowRoles("superadmin"), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET USER STATISTICS (SUPERADMIN ONLY)
router.get("/stats/overview", verifyToken, allowRoles("superadmin"), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: "active" });
        const adminCount = await User.countDocuments({ role: "admin" });
        const staffCount = await User.countDocuments({ role: "staff" });
        
        res.json({
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
            adminCount,
            staffCount
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET CURRENT USER PROFILE
router.get("/me", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE CURRENT USER PROFILE
router.put("/me", verifyToken, async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);
        
        if (!user) return res.status(404).json({ error: "User not found" });

        // Check if email is already taken
        if (email && email !== user.email) {
            const existing = await User.findOne({ email });
            if (existing) return res.status(400).json({ error: "Email already in use" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        user.updatedAt = new Date();

        await user.save();
        res.json({ message: "Profile updated successfully", user: { name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CHANGE CURRENT USER PASSWORD
router.put("/me/password", verifyToken, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ error: "New password must be at least 6 characters" });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.updatedAt = new Date();
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;