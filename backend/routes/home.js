const express = require("express");
const router = express.Router();
const {
  getFeaturedItems,
  getRecentWeatherAlert,
  getHomeStats,
} = require("../controllers/homeController");

// GET /api/home/featured - Lấy featured items
router.get("/featured", getFeaturedItems);

// GET /api/home/weather-alert - Lấy cảnh báo thời tiết gần đây
router.get("/weather-alert", getRecentWeatherAlert);

// GET /api/home/stats - Lấy thống kê
router.get("/stats", getHomeStats);

module.exports = router;
