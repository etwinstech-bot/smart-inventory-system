// ===============================
// 👤 USER MODEL
// ===============================

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["superadmin", "admin", "staff", "user"],
    default: "user"
  },
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("User", userSchema);