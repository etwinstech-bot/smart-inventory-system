const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

module.exports = function (req, res, next) {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ message: "No token, access denied" });
    }

    try {
        const verified = jwt.verify(token, SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: "Invalid token" });
    }
};