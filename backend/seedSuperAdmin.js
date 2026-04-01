const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");

mongoose.connect("mongodb://127.0.0.1:27017/inventoryDB");

async function createSuperAdmin() {
  try {
    const existing = await User.findOne({ role: "superadmin" });

    if (existing) {
      console.log("Super admin already exists");
      return mongoose.disconnect();
    }

    const hashedPassword = await bcrypt.hash("super123", 10);

    const superAdmin = new User({
      name: "Super Admin",
      email: "super@admin.com",
      password: hashedPassword,
      role: "superadmin"
    });

    await superAdmin.save();

    console.log("✅ Super Admin created successfully");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

createSuperAdmin();