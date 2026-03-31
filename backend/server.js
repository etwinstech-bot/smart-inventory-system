const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logRoutes = require("./routes/logRoutes");
// ✅ CREATE APP FIRST
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/logs", logRoutes);


// ✅ IMPORT ROUTES AFTER app is created
const productRoutes = require("./routes/productroutes");
const authRoutes = require("./routes/authRoutes");

// ✅ USE ROUTES
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

// Test route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
app.listen(5000, () => {
    console.log("Server running on port 5000");
});