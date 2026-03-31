const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ["admin", "staff"],
        default: "staff"
    },
// creating superAdmin
    role: {
    type: String,
    enum: ["superadmin", "admin", "staff"],
    default: "staff"
}
});

module.exports = mongoose.model("User", userSchema);