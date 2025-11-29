const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const { setupWeatherCron } = require("./config/cron");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite frontend
    credentials: true,
  })
);
app.use(express.json());

// 1. Giả sử ảnh của bạn nằm trong thư mục có tên là 'uploads'
const UPLOADS_DIR = path.join(__dirname, "uploads");

// 2. Cấu hình Express để phục vụ file từ thư mục này.
// Tất cả các request đến URL bắt đầu bằng /uploads sẽ được ánh xạ
// đến thư mục UPLOADS_DIR trên máy local của bạn.
app.use("/uploads", express.static(UPLOADS_DIR));

//Connect to MongoDB
connectDB();

// Setup Cron Job cho weather
setupWeatherCron();

// Routes
app.use("/api/home", require("./routes/home"));
app.use("/api/chat", require("./routes/chatbot"));
app.use("/webhook", require("./routes/webhook"));
app.use("/api/diseases", require("./routes/disease"));
app.use("/api/weather", require("./routes/weather"));

app.get("/", (req, res) => {
  res.send("WELCOME TO LÚA VIỆT. API!");
});

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
  console.log(`⏰ Cron job sẽ tự động cập nhật thời tiết mỗi 6 giờ`);
});
