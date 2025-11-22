const Disease = require("../models/Disease");
const Weather = require("../models/Weather");

// Lấy featured items cho trang Home
exports.getFeaturedItems = async (req, res) => {
  try {
    // Lấy 3 bệnh nguy hiểm nhất
    const featuredDiseases = await Disease.find({})
      .sort({ severityRisk: -1 }) // Sắp xếp theo độ nguy hiểm
      .limit(3)
      .select("name description images");

    // Format data cho frontend
    const featuredItems = featuredDiseases.map((disease) => ({
      title: disease.name,
      description:
        disease.description || "Học cách nhận biết và phòng trừ hiệu quả.",
      link: "/sustainable-methods",
      images: disease.images || [],
    }));

    res.json({
      success: true,
      data: featuredItems,
    });
  } catch (error) {
    console.error("Error fetching featured items:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy thông tin nổi bật",
    });
  }
};

// Lấy cảnh báo thời tiết gần đây
exports.getRecentWeatherAlert = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Lấy cảnh báo mới nhất có diseaseAlerts
    const recentAlert = await Weather.findOne({
      date: { $gte: today },
      diseaseAlerts: { $exists: true, $not: { $size: 0 } },
    })
      .sort({ date: 1 })
      .limit(1);

    if (!recentAlert) {
      return res.json({
        success: true,
        data: {
          message: "Thời tiết hiện tại thuận lợi, không có cảnh báo đặc biệt.",
          date: new Date().toLocaleDateString("vi-VN"),
          hasAlert: false,
        },
      });
    }

    // Tạo summary từ disease alerts
    const alertSummary = recentAlert.diseaseAlerts
      .map((alert) => {
        if (typeof alert === "string") return alert;
        return alert.disease;
      })
      .join(", ");

    res.json({
      success: true,
      data: {
        message: `Cảnh báo: ${alertSummary}. Hãy kiểm tra thường xuyên đồng ruộng của bạn.`,
        date: new Date(recentAlert.date).toLocaleDateString("vi-VN"),
        location: recentAlert.location,
        condition: recentAlert.condition,
        hasAlert: true,
      },
    });
  } catch (error) {
    console.error("Error fetching weather alert:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy cảnh báo thời tiết",
    });
  }
};

// Lấy thống kê tổng quan
exports.getHomeStats = async (req, res) => {
  try {
    const totalDiseases = await Disease.countDocuments();
    const highRiskDiseases = await Disease.countDocuments({
      severityRisk: { $in: ["Cao", "Rất cao"] },
    });

    const today = new Date().toISOString().split("T")[0];
    const weatherData = await Weather.find({
      date: { $gte: today },
    }).limit(7);

    const daysWithAlerts = weatherData.filter(
      (w) => w.diseaseAlerts && w.diseaseAlerts.length > 0
    ).length;

    res.json({
      success: true,
      data: {
        totalDiseases,
        highRiskDiseases,
        daysWithAlerts,
        totalForecastDays: weatherData.length,
      },
    });
  } catch (error) {
    console.error("Error fetching home stats:", error);
    res.status(500).json({
      success: false,
      error: "Không thể lấy thống kê",
    });
  }
};
