const mongoose = require("mongoose");
const seedData = require("./data/rice-disease.json");
require("dotenv").config();

const Disease = require("./models/Disease");
const Weather = require("./models/Weather");

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");
};

const seed = async () => {
  try {
    await connectDB();

    // XÓA DỮ LIỆU CŨ
    // await Disease.deleteMany({});
    await Weather.deleteMany({});
    console.log("🗑️  Đã xóa dữ liệu cũ");

    // CHÈN DỮ LIỆU MỚI
    // const insertedDiseases = await Disease.insertMany(seedData.diseases);
    // const insertedWeather = await Weather.insertMany(seedData.weatherForecast);

    // console.log("\n✨ SEED HOÀN TẤT:");
    // console.log(`   • ${insertedDiseases.length} bệnh hại lúa`);
    // // console.log(`   • ${insertedWeather.length} ngày dự báo thời tiết`);

    // console.log("\n📋 Danh sách bệnh đã thêm:");
    // insertedDiseases.forEach((disease, idx) => {
    //   console.log(`   ${idx + 1}. ${disease.name}`);
    //   console.log(`      - Tên khoa học: ${disease.scientificName}`);
    //   console.log(`      - Mức độ: ${disease.severityRisk}`);
    //   console.log(`      - Số hình ảnh: ${disease.images?.length || 0}`);
    // });

    // console.log("\n🌦️  Dự báo thời tiết:");
    // insertedWeather.forEach((w) => {
    //   console.log(`   ${w.date}: ${w.condition} (${w.temperature})`);
    // });

    console.log("\n✅ Hoàn tất! Server có thể sử dụng database mới.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi seed:", err.message);
    process.exit(1);
  }
};

seed();
