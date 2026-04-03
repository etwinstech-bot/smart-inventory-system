const express = require("express");
const router = express.Router();
const User = require("../models/user");

const verifyToken = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

// GET ALL USERS (SUPERADMIN ONLY)
router.get("/", verifyToken, allowRoles("superadmin"), async (req, res) => {

    const users = await User.find().select("-password");

    res.json(users);
});

// DELETE USER (SUPERADMIN ONLY)
router.delete("/:id", verifyToken, allowRoles("superadmin"), async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
});

module.exports = router;