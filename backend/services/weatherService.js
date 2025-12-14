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
    // TRUYỀN dateString cho analyzeDiseaseRisk
    const diseaseAlerts = analyzeDiseaseRisk(
      avgTemp,
      minTemp,
      maxTemp,
      avgHumidity,
      condition,
      d.rain,
      parseFloat(avgWind),
      date // <-- THÊM date
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
  windSpeed,
  dateString
) {
  const alerts = [];
  const cond = condition.toLowerCase();
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // 1-12

  // ===== BỆNH NẤM =====

  // 1. ĐẠO ÔN (Năm nay)
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

  // 2. LEM LÉP HẠT (Tháng 7-10)
  if (month >= 7 && month <= 10) {
    if ((cond.includes("mưa") || rain > 3) && humidity > 75 && avgTemp >= 26) {
      alerts.push({
        level: "warning",
        disease: "Lem Lép Hạt",
        message: "Điều kiện thuận lợi cho nấm gây bệnh",
        action:
          "Phun Propiconazole, Tebuconazole. Thoát nước tốt khi nước ngập.",
      });
    }
  }

  // 3. KHỒ VĂN (Tháng 8-10)
  if (month >= 8 && month <= 10) {
    if (humidity > 80 && avgTemp >= 24 && avgTemp <= 28) {
      alerts.push({
        level: "warning",
        disease: "Khồ Vằn",
        message: "Nguy cơ trên bẹ lá tại giai đoạn trổ",
        action: "Phun Isoprothiolane, Thiram. Kiểm tra định kỳ.",
      });
    }
  }

  // 4. VÀNG LÁ CHÍN SỚM (Tháng 6-9)
  if (month >= 6 && month <= 9) {
    if (
      humidity > 85 &&
      avgTemp >= 25 &&
      avgTemp <= 30 &&
      cond.includes("mưa")
    ) {
      alerts.push({
        level: "info",
        disease: "Vàng Lá Chín Sớm",
        message: "Phát triển từ từ trong điều kiện mưa ẩm",
        action: "Giảm nitrogen, thoát nước tốt. Xử lý lá bệnh nếu nhẹ.",
      });
    }
  }

  // 5. THỐI BẸ (Tháng 7-10, giai đoạn trổ)
  if (month >= 7 && month <= 10) {
    if (humidity > 80 && avgTemp >= 25 && avgTemp <= 28) {
      alerts.push({
        level: "info",
        disease: "Thối Bẹ",
        message: "Nguy cơ tại giai đoạn trổ, gây hạt lửng",
        action: "Phun Kasugamycin hoặc Iprodione. Thoát nước tốt.",
      });
    }
  }

  // 6. ĐỐM NÂUM (Tháng 5-9)
  if (month >= 5 && month <= 9) {
    if (humidity > 75 && avgTemp >= 22 && avgTemp <= 28) {
      alerts.push({
        level: "info",
        disease: "Đốm Nâu",
        message: "Tấn công lá non, lá thấp",
        action: "Phun Mancozeb, Propiconazole. Vệ sinh ruộng.",
      });
    }
  }

  // 7. LÚAI VỠN (Tháng 6-8, mạ non)
  if (month >= 6 && month <= 8) {
    if (humidity > 80 && avgTemp >= 26 && avgTemp <= 30) {
      alerts.push({
        level: "info",
        disease: "Lúa Vợn",
        message: "Cây cao vọt, mảnh khảnh tại giai đoạn mạ",
        action: "Chọn giống, điều chỉnh lượng N. Không phun được.",
      });
    }
  }

  // 8. ĐỐM VÒNG (Tháng 5-7, đầu mùa)
  if (month >= 5 && month <= 7) {
    if (
      humidity > 75 &&
      avgTemp >= 20 &&
      avgTemp <= 26 &&
      cond.includes("mưa")
    ) {
      alerts.push({
        level: "info",
        disease: "Đốm Vòng",
        message: "Đốm mắt cua hình bầu dục trên lá",
        action: "Phun Mancozeb. Vệ sinh đất, hạt giống.",
      });
    }
  }

  // 9. THỐI THÂN (Tháng 9-10, giai đoạn chín)
  if (month >= 9 && month <= 10) {
    if (humidity > 80 && avgTemp >= 25 && rain > 5) {
      alerts.push({
        level: "warning",
        disease: "Thối Thân",
        message: "Giai đoạn chín, gốc thân bị hoại tử",
        action: "Giảm nước, thoát nước tốt. Không cứu được nếu nặng.",
      });
    }
  }

  // ===== BỆNH VI KHUẨN =====

  // 10. CHÁY BÌA LÁ (Năm nay, nhất là khi mưa bão)
  if ((cond.includes("mưa") || rain > 5) && humidity > 85) {
    alerts.push({
      level: "danger",
      disease: "Cháy Bìa Lá",
      message: "Bệnh vi khuẩn lây lan nhanh qua nước mưa",
      action: "Phun streptomycin + Copper. Thoát nước mạnh, cắt lá bệnh.",
    });
  } else if (humidity > 85 && windSpeed > 3) {
    alerts.push({
      level: "warning",
      disease: "Cháy Bìa Lá",
      message: "Điều kiện lây lan qua gió",
      action: "Theo dõi sát sao, chuẩn bị thuốc phun.",
    });
  }

  // 11. SỌC TRONG (Tháng 6-9)
  if (month >= 6 && month <= 9) {
    if (humidity > 80 && avgTemp >= 25 && cond.includes("mưa")) {
      alerts.push({
        level: "info",
        disease: "Sọc Trong",
        message: "Sọc vàng dọc gân lá",
        action: "Phun Streptomycin hoặc Kasugamycin. Thoát nước.",
      });
    }
  }

  // ===== BỆNH VIRUS =====

  // 12. VÀNG LÙN (Tháng 5-8, do rầy nâu truyền)
  if (month >= 5 && month <= 8) {
    if (maxTemp > 28 && humidity < 70) {
      alerts.push({
        level: "danger",
        disease: "Vàng Lùn",
        message: "Do rầy nâu truyền virus, lúa lùn xòi",
        action:
          "Kiểm soát rầy nâu ngay. Cách ly cây bệnh. Loại bỏ cây lành từ.",
      });
    }
  }

  // 13. LÙIN XOẮN LÁ (Tháng 5-8, do rầy nâu)
  if (month >= 5 && month <= 8) {
    if (maxTemp > 30 && humidity < 75) {
      alerts.push({
        level: "warning",
        disease: "Lùn Xoắn Lá",
        message: "Lá xoắn như mũi khoan, mép lá rách",
        action: "Phòng rầy nâu. Loại bỏ cây bệnh sớm. Gieo lúa đúng lịch.",
      });
    }
  }

  // ===== SÂU HẠI =====

  // 14. RẦY NÂU (Năm nay, nhất là nóng khô)
  if (maxTemp > 32 && humidity < 70 && !cond.includes("mưa") && windSpeed < 3) {
    alerts.push({
      level: "danger",
      disease: "Rầy Nâu",
      message: "Phát triển mạnh do nóng khô",
      action: "Tưới nước 5-7cm, đặt bẫy dính vàng. Phun Imidacloprid.",
    });
  } else if (maxTemp > 30 && humidity < 75) {
    alerts.push({
      level: "warning",
      disease: "Rầy Nâu",
      message: "Nguy cơ tăng",
      action: "Theo dõi gốc lúa, tưới đều. Kiểm tra lá non.",
    });
  }

  // 15. SÂU CUỐN LÁ (Tháng 6-9, nóng ẩm)
  if (month >= 6 && month <= 9) {
    if (humidity > 75 && avgTemp >= 25 && cond.includes("mưa")) {
      alerts.push({
        level: "warning",
        disease: "Sâu Cuốn Lá",
        message: "Ăn biểu bì lá, cuốn lá lại",
        action: "Phun Chlorantraniliprole, Spinosad. Xua sâu bằng âm thanh.",
      });
    }
  }

  // 16. SÂU ĐỤC THÂN 2 CHẤM (Tháng 5-8, dảnh héo)
  if (month >= 5 && month <= 8) {
    if (humidity > 75 && avgTemp >= 24 && cond.includes("mưa")) {
      alerts.push({
        level: "danger",
        disease: "Sâu Đục Thân 2 Chấm",
        message: "Sâu non đục thân, gây dảnh héo hoặc bông bạc",
        action: "Phun Cartap 50%, Profenofos. Kiểm tra và đốt sâu non trên lá.",
      });
    }
  }

  // 17. BỌ TRĨ (Tháng 6-7, mạ non)
  if (month >= 6 && month <= 7) {
    if (humidity > 70 && avgTemp >= 22 && avgTemp <= 28) {
      alerts.push({
        level: "info",
        disease: "Bọ Trĩ",
        message: "Hại mạ non, lá cuốn khô vàng",
        action: "Phun Dimethoate hoặc Cypermethrin. Kiểm soát ở mạ.",
      });
    }
  }

  // 18. NHỆN GIÉ (Tháng 7-9, khô nóng)
  if (month >= 7 && month <= 9) {
    if (humidity < 70 && maxTemp > 30) {
      alerts.push({
        level: "warning",
        disease: "Nhện Gié",
        message: "Chích hút bẹ lá gây vết thâm đen (cạo gió)",
        action: "Phun nước liên tục. Phun Phenthoate, Dicofol.",
      });
    }
  }

  // 19. MUỖI HÀNH (Tháng 5-7)
  if (month >= 5 && month <= 7) {
    if (humidity > 75 && avgTemp >= 24 && cond.includes("mưa")) {
      alerts.push({
        level: "info",
        disease: "Muỗi Hành",
        message: "Biến bẹ lá thành ống tròn như cọng hành",
        action: "Phun Dimethoate, Cypermethrin. Loại bỏ cây bệnh.",
      });
    }
  }

  // 20. BỌ XÍT HÔI (Tháng 8-10, giai đoạn ngậm sữa)
  if (month >= 8 && month <= 10) {
    if (humidity > 70 && avgTemp >= 25) {
      alerts.push({
        level: "info",
        disease: "Bọ Xít Hôi",
        message: "Chích hút hạt giai đoạn ngậm sữa, hạt lép đắng",
        action: "Phun Cypermethrin, Imidacloprid. Kiểm tra hàng ngày.",
      });
    }
  }

  // Nếu không có cảnh báo nguy hiểm/cảnh báo, thêm success
  const hasRealAlert = alerts.some(
    (a) => a.level === "danger" || a.level === "warning"
  );

  if (!hasRealAlert) {
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
