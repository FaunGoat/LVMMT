const mongoose = require("mongoose");

const weatherDiseaseCorrelationSchema = new mongoose.Schema(
  {
    diseaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disease", // Lưu ý: Đảm bảo ref đúng với tên Model Disease chính
      required: true,
      unique: true,
      index: true,
    },
    weatherTriggers: [
      {
        condition: {
          type: String,
          required: true,
        }, // "Mưa kéo dài"
        description: String,
        threshold: {
          temperature: {
            min: Number,
            max: Number,
            optimal: Number,
            critical: Number, // Ngưỡng nguy hiểm
            unit: { type: String, default: "°C" },
          },
          humidity: {
            min: Number,
            max: Number,
            optimal: Number,
            critical: Number,
            unit: { type: String, default: "%" },
          },
          rainfall: {
            amount: String, // ">50mm/ngày"
            duration: String, // "3-5 ngày liên tục"
            intensity: String, // "Mưa lớn", "Mưa vừa"
            critical: String,
          },
          windSpeed: {
            range: String,
            impact: String,
            unit: { type: String, default: "m/s" },
          },
          dewPoint: Number, // Điểm sương
          soilMoisture: String,
          sunlight: String, // "Ít nắng", "Nhiều mây"
        },
        riskLevel: {
          type: String,
          enum: ["Rất cao", "Cao", "Trung bình", "Thấp"],
          required: true,
        },
        riskScore: {
          type: Number,
          min: 0,
          max: 100,
        }, // Điểm số nguy cơ
        durationToOutbreak: String, // "2-3 ngày sau khi..."
        response: String, // Hành động cần làm
        preventiveWindow: String, // "Phun phòng trước 1-2 ngày"
        seasonalVariation: String, // Khác biệt theo mùa
      },
    ],
    forecastAlerts: [
      {
        condition: {
          type: String,
          required: true,
        },
        warningTime: String, // "7 ngày trước"
        severity: {
          type: String,
          enum: ["Thông tin", "Cảnh báo", "Nguy hiểm", "Khẩn cấp"],
        },
        recommendedActions: [String],
        preparationSteps: [String],
        estimatedRisk: String,
        affectedCropStages: [String], // Giai đoạn cây dễ bị hại
        communicationMethod: [String], // "SMS", "App", "Radio"
      },
    ],
    weatherPatterns: [
      {
        // Mô hình thời tiết
        pattern: String, // "El Niño", "La Niña"
        impact: String,
        historicalData: String,
        predictiveValue: String,
      },
    ],
    microclimateFactors: [
      {
        // Yếu tố vi khí hậu
        factor: String,
        impact: String,
        management: String,
      },
    ],
    climateChangeProjections: {
      // Dự báo biến đổi khí hậu
      shortTerm: String, // 5-10 năm
      longTerm: String, // >10 năm
      adaptationStrategies: [String],
    },
    historicalOutbreaks: [
      {
        // Lịch sử dịch bệnh theo thời tiết
        date: Date,
        location: String,
        weatherConditions: {
          temperature: String,
          humidity: String,
          rainfall: String,
        },
        severity: String,
        affectedArea: String,
        economicImpact: String,
        lessonLearned: String,
      },
    ],
    regionalWeatherImpact: [
      {
        // Ảnh hưởng theo vùng
        region: String,
        specificConditions: String,
        riskProfile: String,
      },
    ],
    realTimeMonitoring: {
      // Giám sát thời gian thực
      dataSource: [String], // "Trạm khí tượng", "Vệ tinh"
      updateFrequency: String,
      alertSystem: String,
      decisionSupport: String,
    },
  },
  { timestamps: true }
);

// Đã loại bỏ index gây lỗi:
/*
weatherDiseaseCorrelationSchema.index({
  "weatherTriggers.riskLevel": 1,
  "forecastAlerts.severity": 1,
});
*/

// Nếu cần, bạn có thể thêm các index đơn giản trên các trường mảng riêng lẻ như sau:
// weatherDiseaseCorrelationSchema.index({ "weatherTriggers.riskLevel": 1 });
// weatherDiseaseCorrelationSchema.index({ "forecastAlerts.severity": 1 });

module.exports = mongoose.model(
  "WeatherDiseaseCorrelation",
  weatherDiseaseCorrelationSchema
);
