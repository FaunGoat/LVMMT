const cron = require("node-cron");
const { updateWeatherData } = require("../services/weatherService");

// Cron job chạy mỗi 6 giờ: 0 */6 * * *
// Hoặc mỗi ngày lúc 6h sáng: 0 6 * * *
function setupWeatherCron() {
  // Chạy mỗi 6 giờ
  cron.schedule("0 */6 * * *", async () => {
    console.log("⏰ Cron job: Cập nhật dữ liệu thời tiết...");
    try {
      await updateWeatherData();
      console.log("✅ Cron job: Cập nhật thành công!");
    } catch (error) {
      console.error("❌ Cron job: Lỗi cập nhật:", error.message);
    }
  });

  console.log("✅ Weather cron job đã được thiết lập (chạy mỗi 6h)");

  // Chạy ngay lần đầu khi khởi động server
  setTimeout(async () => {
    console.log("🚀 Chạy cập nhật thời tiết lần đầu...");
    try {
      await updateWeatherData();
    } catch (error) {
      console.error("❌ Lỗi cập nhật ban đầu:", error.message);
    }
  }, 5000); // Đợi 5s sau khi server start
}

module.exports = { setupWeatherCron };
