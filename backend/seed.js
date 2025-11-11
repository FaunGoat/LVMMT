const mongoose = require("mongoose");
const seedData = require("./data/rice-disease.json");
require("dotenv").config();

const Disease = require("./models/Disease");
const Weather = require("./models/Weather");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("MongoDB connected");
};

const seed = async () => {
  try {
    await connectDB();

    // XÓA DỮ LIỆU CŨ
    await Disease.deleteMany({});
    await Weather.deleteMany({});
    console.log("Đã xóa dữ liệu cũ");

    // CHÈN DỮ LIỆU MỚI
    await Disease.insertMany(seedData.diseases);
    await Weather.insertMany(seedData.weatherForecast);

    console.log("SEED HOÀN TẤT:");
    console.log("   • 5 bệnh hại lúa");
    console.log("   • 3 ngày dự báo thời tiết");
    process.exit(0);
  } catch (err) {
    console.error("Lỗi seed:", err.message);
    process.exit(1);
  }
};

seed();
