const mongoose = require("mongoose");
const Admin = require("./models/Admin");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: "minhloi@admin.com",
    });

    if (existingAdmin) {
      console.log("⚠️  Admin already exists!");
      process.exit(0);
    }

    // Create new admin
    const newAdmin = new Admin({
      email: "minhloi@admin.com",
      password: "123456",
      name: "Administrator",
      role: "super_admin",
      isActive: true,
    });

    await newAdmin.save();

    console.log("✅ Admin created successfully!");
    console.log("📧 Email: minhloi@admin.com");
    console.log("🔑 Password: 123456");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
