const Weather = require("../models/Weather");
const {
  fetchWeatherFromAPI,
  saveWeatherToDB,
  updateWeatherData,
} = require("../services/weatherService");

// Lấy dự báo thời tiết (từ DB hoặc API)
exports.getWeatherForecast = async (req, res) => {
  try {
    const {
      location = "Đồng bằng sông Cửu Long",
      days = 7,
      refresh = false,
    } = req.query;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Nếu có tham số refresh=true, lấy từ API và cập nhật DB
    if (refresh === "true") {
      console.log("🔄 Refresh data từ API...");
      const forecasts = await fetchWeatherFromAPI(location, parseInt(days));
      await saveWeatherToDB(forecasts);

      return res.json({
        success: true,
        count: forecasts.length,
        data: forecasts,
        source: "API (Fresh data)",
      });
    }

    // Lấy từ database
    let query = {
      date: { $gte: today.toISOString().split("T")[0] },
      location: { $regex: location, $options: "i" },
    };

    let weatherData = await Weather.find(query)
      .sort({ date: 1 })
      .limit(parseInt(days));

    // Nếu DB trống hoặc dữ liệu cũ, tự động fetch từ API
    if (weatherData.length === 0) {
      console.log("📥 Không có dữ liệu trong DB, fetch từ API...");
      const forecasts = await fetchWeatherFromAPI(location, parseInt(days));
      await saveWeatherToDB(forecasts);
      weatherData = forecasts;
    }

    res.json({
      success: true,
      count: weatherData.length,
      data: weatherData,
      source: "Database",
    });
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy dự báo thời tiết: " + error.message,
    });
  }
};

// Lấy dự báo cho một ngày cụ thể
exports.getWeatherByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { location } = req.query;

    let query = { date };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const weather = await Weather.findOne(query);

    if (!weather) {
      return res.status(404).json({
        success: false,
        error: "Không tìm thấy dự báo cho ngày này",
      });
    }

    res.json({
      success: true,
      data: weather,
    });
  } catch (error) {
    console.error("Error fetching weather by date:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy dự báo thời tiết",
    });
  }
};

// Lấy tất cả các khu vực có dự báo
exports.getAvailableLocations = async (req, res) => {
  try {
    const locations = await Weather.distinct("location");

    res.json({
      success: true,
      count: locations.length,
      data: locations,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy danh sách khu vực",
    });
  }
};

// Lấy cảnh báo bệnh hại theo thời tiết
exports.getDiseaseAlerts = async (req, res) => {
  try {
    const { location, refresh = false } = req.query;
    const today = new Date().toISOString().split("T")[0];

    // Nếu refresh, lấy data mới từ API
    if (refresh === "true") {
      const forecasts = await fetchWeatherFromAPI(location, 7);
      await saveWeatherToDB(forecasts);
    }

    let query = {
      date: { $gte: today },
      diseaseAlerts: { $exists: true, $not: { $size: 0 } },
    };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const alerts = await Weather.find(query).sort({ date: 1 }).limit(7);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Error fetching disease alerts:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy cảnh báo bệnh hại",
    });
  }
};

// Thống kê thời tiết theo tuần
exports.getWeatherStats = async (req, res) => {
  try {
    const { location } = req.query;
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    let query = {
      date: {
        $gte: today.toISOString().split("T")[0],
        $lte: nextWeek.toISOString().split("T")[0],
      },
    };

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const weatherData = await Weather.find(query).sort({ date: 1 });

    // Tính toán thống kê
    const stats = {
      totalDays: weatherData.length,
      rainyDays: weatherData.filter((w) =>
        w.condition.toLowerCase().includes("mưa")
      ).length,
      sunnyDays: weatherData.filter((w) =>
        w.condition.toLowerCase().includes("nắng")
      ).length,
      avgHumidity: 0,
      highRiskDays: weatherData.filter((w) => w.diseaseAlerts.length > 0)
        .length,
    };

    // Tính độ ẩm trung bình
    if (weatherData.length > 0) {
      const humiditySum = weatherData.reduce((sum, w) => {
        const humidity = parseInt(w.humidity);
        return sum + (isNaN(humidity) ? 0 : humidity);
      }, 0);
      stats.avgHumidity = Math.round(humiditySum / weatherData.length);
    }

    res.json({
      success: true,
      data: stats,
      weatherData: weatherData,
    });
  } catch (error) {
    console.error("Error fetching weather stats:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy thống kê thời tiết",
    });
  }
};

// Endpoint để force update weather từ API
exports.forceUpdateWeather = async (req, res) => {
  try {
    await updateWeatherData();
    res.json({
      success: true,
      message: "Đã cập nhật dữ liệu thời tiết từ API",
    });
  } catch (error) {
    console.error("Error updating weather:", error);
    res.status(500).json({
      success: false,
      error: "Không thể cập nhật thời tiết: " + error.message,
    });
  }
};
