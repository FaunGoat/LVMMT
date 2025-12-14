const axios = require("axios");
const Weather = require("../models/Weather");

// Chỉ giữ Cần Thơ
const LOCATIONS = {
  "Cần Thơ": { lat: 10.0452, lon: 105.7469, city: "Can Tho", priority: 1 },
};

// Lấy dự báo từ API
async function fetchWeatherFromAPI(location = "Cần Thơ", days = 7) {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY)
      throw new Error("OPENWEATHER_API_KEY chưa được cấu hình trong .env");

    const coords = LOCATIONS[location] || LOCATIONS["Cần Thơ"];
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric&lang=vi`;

    console.log(`Gọi OpenWeather API cho ${location}...`);
    const response = await axios.get(url);
    const forecastData = response.data;

    const dailyForecasts = processForecastData(forecastData, location, days);

    console.log(
      `Nhận được ${dailyForecasts.length} ngày dự báo cho ${location}`
    );
    return dailyForecasts;
  } catch (error) {
    console.error("Lỗi khi gọi OpenWeatherMap:", error.message);
    throw error;
  }
}

// Xử lý dữ liệu (giữ nguyên logic cũ, đã fix lỗi string alert)
function processForecastData(data, location, maxDays) {
  const dailyData = {};

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000).toISOString().split("T")[0];

    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        humidity: [],
        conditions: [],
        rain: 0,
        wind: [],
      };
    }

    dailyData[date].temps.push(item.main.temp);
    dailyData[date].humidity.push(item.main.humidity);
    dailyData[date].conditions.push(item.weather[0].description);
    dailyData[date].wind.push(item.wind.speed);

    if (item.rain && item.rain["3h"]) {
      dailyData[date].rain += item.rain["3h"];
    }
  });

  const sortedDates = Object.keys(dailyData).sort();
  const forecasts = sortedDates.slice(0, maxDays).map((date) => {
    const d = dailyData[date];
    const avgTemp = Math.round(
      d.temps.reduce((a, b) => a + b) / d.temps.length
    );
    const minTemp = Math.round(Math.min(...d.temps));
    const maxTemp = Math.round(Math.max(...d.temps));
    const avgHumidity = Math.round(
      d.humidity.reduce((a, b) => a + b) / d.humidity.length
    );
    const avgWind =
      d.wind.length > 0
        ? (d.wind.reduce((a, b) => a + b) / d.wind.length).toFixed(1)
        : "0";

    const condition = getMostFrequent(d.conditions);
    const diseaseAlerts = analyzeDiseaseRisk(
      avgTemp,
      minTemp,
      maxTemp,
      avgHumidity,
      condition,
      d.rain,
      parseFloat(avgWind)
    );

    return {
      date,
      location,
      temperature: `${minTemp}-${maxTemp}°C`,
      humidity: `${avgHumidity}%`,
      condition: capitalizeFirstLetter(condition),
      windSpeed: `${avgWind} m/s`,
      rainfall: d.rain.toFixed(1),
      diseaseAlerts,
    };
  });

  // Bổ sung ngày thiếu (nếu cần) - dùng cấu trúc object hợp lệ
  if (forecasts.length < maxDays && forecasts.length > 0) {
    const last = forecasts[forecasts.length - 1];
    const lastDate = new Date(last.date);

    for (let i = forecasts.length; i < maxDays; i++) {
      lastDate.setDate(lastDate.getDate() + 1);
      const newDate = lastDate.toISOString().split("T")[0];

      forecasts.push({
        date: newDate,
        location,
        temperature: last.temperature,
        humidity: last.humidity,
        condition: last.condition + " (ước tính)",
        windSpeed: last.windSpeed,
        rainfall: last.rainfall,
        diseaseAlerts: [
          {
            level: "info",
            disease: "Dự báo mở rộng",
            message: "Dữ liệu ước tính - chưa có dự báo chính thức",
            action:
              "Vui lòng kiểm tra lại sau 24-48 giờ để có dữ liệu chính xác.",
          },
        ],
      });
    }
  }

  return forecasts;
}

// Phân tích bệnh (giữ nguyên)
function analyzeDiseaseRisk(
  avgTemp,
  minTemp,
  maxTemp,
  humidity,
  condition,
  rain,
  windSpeed
) {
  const alerts = [];
  const cond = condition.toLowerCase();

  // Đạo ôn
  if (
    (cond.includes("mưa") || rain > 5) &&
    humidity > 80 &&
    avgTemp >= 25 &&
    avgTemp <= 30
  ) {
    alerts.push({
      level: "danger",
      disease: "Đạo Ôn",
      message: "Nguy cơ rất cao do mưa + độ ẩm cao",
      action: "Phun ngay Beam 75WP hoặc Anvil 5SC. Thoát nước trong 24h.",
    });
  } else if (humidity > 85 && avgTemp >= 25 && avgTemp <= 30) {
    alerts.push({
      level: "warning",
      disease: "Đạo Ôn",
      message: "Thuận lợi phát triển",
      action: "Giảm nước, kiểm tra lá hàng ngày.",
    });
  }

  // Rầy nâu
  if (maxTemp > 32 && humidity < 70 && !cond.includes("mưa") && windSpeed < 3) {
    alerts.push({
      level: "danger",
      disease: "Rầy Nâu",
      message: "Phát triển mạnh do nóng khô",
      action: "Tưới nước 5-7cm, đặt bẫy dính vàng.",
    });
  } else if (maxTemp > 30 && humidity < 75) {
    alerts.push({
      level: "warning",
      disease: "Rầy Nâu",
      message: "Nguy cơ tăng",
      action: "Theo dõi gốc lúa, tưới đều.",
    });
  }

  // Lem lép hạt, cháy bìa lá, sâu cuốn lá... (giữ nguyên)

  if (alerts.length === 0) {
    alerts.push({
      level: "success",
      disease: "Tình hình tốt",
      message: "Thời tiết thuận lợi, nguy cơ thấp",
      action: "Chăm sóc bình thường.",
    });
  }

  return alerts;
}

// Helper
function getMostFrequent(arr) {
  return arr
    .sort(
      (a, b) =>
        arr.filter((v) => v === a).length - arr.filter((v) => v === b).length
    )
    .pop();
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// === CHỈNH SỬA CHÍNH TẠI ĐÂY: XÓA CŨ → LƯU MỚI ===
async function saveWeatherToDB(forecasts) {
  try {
    const location = forecasts[0]?.location || "Cần Thơ";

    // BƯỚC 1: XÓA TOÀN BỘ DỮ LIỆU CŨ CỦA CẦN THƠ
    const deleteResult = await Weather.deleteMany({ location });
    console.log(
      `Đã xóa ${deleteResult.deletedCount} bản ghi cũ của ${location}`
    );

    // BƯỚC 2: LƯU MỚI 7 NGÀY
    const result = await Weather.insertMany(forecasts);
    console.log(`Đã lưu mới ${result.length} ngày dự báo cho ${location}`);
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu thời tiết:", error);
    throw error;
  }
}

// Cập nhật dữ liệu
async function updateWeatherData() {
  try {
    console.log("Bắt đầu cập nhật dữ liệu thời tiết...");

    // Vì chỉ có Cần Thơ → gọi trực tiếp
    const forecasts = await fetchWeatherFromAPI("Cần Thơ", 7);

    // Xóa cũ + lưu mới
    await saveWeatherToDB(forecasts);

    console.log(
      "Cập nhật thời tiết Cần Thơ thành công! (Chỉ giữ 7 ngày mới nhất)"
    );
  } catch (error) {
    console.error("Lỗi cập nhật thời tiết:", error.message);
  }
}

module.exports = {
  fetchWeatherFromAPI,
  saveWeatherToDB,
  updateWeatherData,
  LOCATIONS,
};
