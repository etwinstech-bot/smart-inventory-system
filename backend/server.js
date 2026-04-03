console.log("AUTH ROUTES LOADED"); // ADD DEBUG
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logRoutes = require("./routes/logRoutes");
const userRoutes = require("./routes/userRoutes");

// ✅ CREATE APP FIRST
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/logs", logRoutes);
app.use("/api/users", userRoutes);

// ✅ IMPORT ROUTES AFTER app is created
const productRoutes = require("./routes/productroutes");
const authRoutes = require("./routes/authRoutes");

// ✅ USE ROUTES
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose.connection.on("connected", () => {
    console.log("🔥 Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
    console.log("❌ Mongoose error:", err);
});

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB")
.then(() => {
    console.log("✅ MongoDB Connected Successfully");

    // 🚀 START SERVER ONLY AFTER DB CONNECTS
    app.listen(5000, () => {
        console.log("🚀 Server running on port 5000");
    });
})
.catch(err => {
    console.log("❌ MongoDB Connection Error:", err);
});