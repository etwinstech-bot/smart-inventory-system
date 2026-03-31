const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: String,
    price: Number,
    quantity: Number
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);