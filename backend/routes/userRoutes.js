const express = require("express");
const router = express.Router();
const User = require("../models/user");

// GET ALL USERS (SUPERADMIN ONLY)
router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// DELETE USER (SUPERADMIN ONLY)
router.delete("/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
});

module.exports = router;