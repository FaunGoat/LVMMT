const axios = require("axios");
const Weather = require("../models/Weather");
const Disease = require("../models/Disease");

// Tọa độ các tỉnh miền Tây
const LOCATIONS = {
  "Đồng bằng sông Cửu Long": { lat: 10.0452, lon: 105.7469, city: "Can Tho" },
  "Cần Thơ": { lat: 10.0452, lon: 105.7469, city: "Can Tho" },
  "An Giang": { lat: 10.5216, lon: 105.1258, city: "An Giang" },
  "Đồng Tháp": { lat: 10.4938, lon: 105.6881, city: "Dong Thap" },
  "TP.HCM": { lat: 10.8231, lon: 106.6297, city: "Ho Chi Minh" },
};

// Lấy dự báo thời tiết từ OpenWeatherMap
async function fetchWeatherFromAPI(
  location = "Đồng bằng sông Cửu Long",
  days = 7
) {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!API_KEY) {
      throw new Error("OPENWEATHER_API_KEY chưa được cấu hình trong .env");
    }

    const coords = LOCATIONS[location] || LOCATIONS["Đồng bằng sông Cửu Long"];

    // Gọi API dự báo 5 ngày (free tier)
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric&lang=vi`;

    const response = await axios.get(url);
    const forecastData = response.data;

    // Xử lý dữ liệu: group theo ngày và lấy trung bình
    const dailyForecasts = processForecastData(forecastData, location, days);

    return dailyForecasts;
  } catch (error) {
    console.error("Error fetching weather from API:", error.message);
    throw error;
  }
}

// Xử lý dữ liệu forecast từ OpenWeatherMap
function processForecastData(data, location, maxDays) {
  const dailyData = {};

  // Group forecast theo ngày
  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0]; // Lấy ngày (YYYY-MM-DD)

    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        humidity: [],
        conditions: [],
        rain: 0,
        weather: [],
      };
    }

    dailyData[date].temps.push(item.main.temp);
    dailyData[date].humidity.push(item.main.humidity);
    dailyData[date].conditions.push(item.weather[0].description);
    dailyData[date].weather.push(item.weather[0]);

    if (item.rain && item.rain["3h"]) {
      dailyData[date].rain += item.rain["3h"];
    }
  });

  // Tính trung bình và format
  const forecasts = Object.keys(dailyData)
    .slice(0, maxDays)
    .map((date) => {
      const dayData = dailyData[date];

      const avgTemp = Math.round(
        dayData.temps.reduce((a, b) => a + b) / dayData.temps.length
      );
      const minTemp = Math.round(Math.min(...dayData.temps));
      const maxTemp = Math.round(Math.max(...dayData.temps));
      const avgHumidity = Math.round(
        dayData.humidity.reduce((a, b) => a + b) / dayData.humidity.length
      );

      // Lấy điều kiện thời tiết phổ biến nhất
      const condition = getMostFrequent(dayData.conditions);

      // Phân tích cảnh báo bệnh dựa trên thời tiết
      const diseaseAlerts = analyzeDiseaseRisk(
        avgTemp,
        minTemp,
        maxTemp,
        avgHumidity,
        condition,
        dayData.rain
      );

      return {
        date,
        location,
        temperature: `${minTemp}-${maxTemp}°C`,
        humidity: `${avgHumidity}%`,
        condition: capitalizeFirstLetter(condition),
        diseaseAlerts,
      };
    });

  return forecasts;
}

// Tìm phần tử xuất hiện nhiều nhất
function getMostFrequent(arr) {
  const frequency = {};
  let maxFreq = 0;
  let mostFrequent = arr[0];

  arr.forEach((item) => {
    frequency[item] = (frequency[item] || 0) + 1;
    if (frequency[item] > maxFreq) {
      maxFreq = frequency[item];
      mostFrequent = item;
    }
  });

  return mostFrequent;
}

// Viết hoa chữ cái đầu
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Phân tích nguy cơ bệnh dựa trên thời tiết
function analyzeDiseaseRisk(
  avgTemp,
  minTemp,
  maxTemp,
  humidity,
  condition,
  rain
) {
  const alerts = [];
  const condLower = condition.toLowerCase();

  // Bệnh đạo ôn: Mưa + độ ẩm cao
  if (
    (condLower.includes("mưa") || rain > 5) &&
    humidity > 80 &&
    avgTemp >= 25 &&
    avgTemp <= 30
  ) {
    alerts.push(
      "⚠️ Cảnh báo ĐỎ: Nguy cơ ĐẠO ÔN rất cao do mưa nhiều + độ ẩm >80%."
    );
    alerts.push(
      "💡 Khuyến cáo: Phun phòng Beam 75WP hoặc Anvil 5SC ngay. Thoát nước nhanh."
    );
  } else if (humidity > 85 && avgTemp >= 25 && avgTemp <= 30) {
    alerts.push(
      "⚠️ Cảnh báo VÀNG: Điều kiện thuận lợi cho ĐẠO ÔN. Theo dõi sát."
    );
  }

  // Rầy nâu: Nắng nóng + khô
  if (maxTemp > 32 && humidity < 70 && !condLower.includes("mưa")) {
    alerts.push(
      "⚠️ Cảnh báo ĐỎ: RẦY NÂU phát triển mạnh do nhiệt độ cao + khô hạn."
    );
    alerts.push(
      "💡 Khuyến cáo: Tưới nước đều, đặt bẫy dính vàng, kiểm tra gốc lúa 2 lần/ngày."
    );
  }

  // Lem lép hạt: Mưa lớn khi trổ bông
  if (
    (condLower.includes("mưa lớn") || rain > 10) &&
    avgTemp >= 25 &&
    avgTemp <= 32
  ) {
    alerts.push("⚠️ Cảnh báo CAM: LEM LÉP HẠT có thể bùng phát do mưa lớn.");
    alerts.push("💡 Khuyến cáo: Nếu lúa đang trổ, phun Validamycin 5L ngay.");
  }

  // Cháy bìa lá: Mưa bão + gió mạnh
  if (condLower.includes("bão") || (condLower.includes("mưa") && rain > 15)) {
    alerts.push(
      "⚠️ Cảnh báo ĐỎ: CHÁY BÌA LÁ do mưa bão tạo vết thương trên lá."
    );
    alerts.push(
      "💡 Khuyến cáo: Thoát nước trong 24h, vệ sinh dụng cụ, phun Kasumin 2L."
    );
  }

  // Sâu cuốn lá: Mưa + độ ẩm cao
  if (
    (condLower.includes("mưa") || humidity > 80) &&
    avgTemp >= 25 &&
    avgTemp <= 32
  ) {
    alerts.push("⚠️ Cảnh báo VÀNG: SÂU CUỐN LÁ phát triển do mưa + độ ẩm cao.");
    alerts.push(
      "💡 Khuyến cáo: Kiểm tra lá cuốn, phun Bt hoặc Beauveria bassiana khi thấy >5 lá cuốn/m²."
    );
  }

  // Nếu không có cảnh báo nào
  if (alerts.length === 0) {
    alerts.push("✅ Cảnh báo XANH: Thời tiết thuận lợi, nguy cơ bệnh thấp.");
    alerts.push("💡 Khuyến cáo: Tiếp tục theo dõi và chăm sóc bình thường.");
  }

  return alerts;
}

// Lưu dự báo vào database
async function saveWeatherToDB(forecasts) {
  try {
    for (const forecast of forecasts) {
      await Weather.findOneAndUpdate(
        { date: forecast.date, location: forecast.location },
        forecast,
        { upsert: true, new: true }
      );
    }
    console.log(`✅ Đã lưu ${forecasts.length} ngày dự báo vào database`);
  } catch (error) {
    console.error("Error saving weather to DB:", error);
  }
}

// Cron job: Cập nhật thời tiết mỗi 6 giờ
async function updateWeatherData() {
  try {
    console.log("🔄 Bắt đầu cập nhật dữ liệu thời tiết...");

    for (const location of Object.keys(LOCATIONS)) {
      const forecasts = await fetchWeatherFromAPI(location, 7);
      await saveWeatherToDB(forecasts);
    }

    console.log("✅ Cập nhật thời tiết hoàn tất!");
  } catch (error) {
    console.error("❌ Lỗi cập nhật thời tiết:", error.message);
  }
}

module.exports = {
  fetchWeatherFromAPI,
  saveWeatherToDB,
  updateWeatherData,
  LOCATIONS,
};
