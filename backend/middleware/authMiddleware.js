// ===============================
// 🔐 AUTH MIDDLEWARE
// ===============================

const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

module.exports = function (req, res, next) {
    let token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "No token, access denied" });
    }

    // ✅ REMOVE "Bearer "
    if (token.startsWith("Bearer ")) {
        token = token.slice(7).trim();
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("❌ TOKEN ERROR:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};