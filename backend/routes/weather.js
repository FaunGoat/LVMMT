const express = require("express");
const router = express.Router();
const {
  getWeatherForecast,
  getWeatherByDate,
  getAvailableLocations,
  getDiseaseAlerts,
  getWeatherStats,
  forceUpdateWeather,
} = require("../controllers/weatherController");

// GET /api/weather - Lấy dự báo thời tiết
// Query: ?location=...&days=7&refresh=true
router.get("/", getWeatherForecast);

// GET /api/weather/locations - Lấy danh sách khu vực
router.get("/locations", getAvailableLocations);

// GET /api/weather/alerts - Lấy cảnh báo bệnh hại
// Query: ?location=...&refresh=true
router.get("/alerts", getDiseaseAlerts);

// GET /api/weather/stats - Thống kê thời tiết
// Query: ?location=...
router.get("/stats", getWeatherStats);

// POST /api/weather/update - Force update từ API (Admin)
router.post("/update", forceUpdateWeather);

// GET /api/weather/:date - Lấy dự báo theo ngày
// Query: ?location=...
router.get("/:date", getWeatherByDate);

module.exports = router;
