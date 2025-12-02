const mongoose = require("mongoose");

const diseaseCauseSchema = new mongoose.Schema(
  {
    diseaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewDisease",
      required: true,
      unique: true,
      index: true,
    },
    pathogen: {
      type: {
        type: String,
        enum: ["Nấm", "Vi khuẩn", "Virus", "Côn trùng", "Sinh lý"],
        required: true,
      },
      scientificName: String,
      commonName: String,
      taxonomy: {
        // Phân loại sinh học
        kingdom: String,
        phylum: String,
        class: String,
        order: String,
        family: String,
        genus: String,
        species: String,
      },
      lifecycle: String, // Vòng đời mầm bệnh
      survivalMechanism: String, // Cơ chế tồn tại
      spreadMethod: [String], // Phương thức lây lan
      hostRange: [String], // Ký chủ (các loại cây bị hại)
      optimumConditions: String,
    },
    environmentalFactors: [
      {
        factor: {
          type: String,
          enum: [
            "Thời tiết",
            "Nhiệt độ",
            "Độ ẩm",
            "Ánh sáng",
            "pH đất",
            "Lượng mưa",
            "Gió",
            "Sương mù",
          ],
          required: true,
        },
        optimalRange: String, // "25-30°C"
        threshold: {
          // Ngưỡng kích hoạt
          min: Number,
          max: Number,
          critical: Number, // Mức nguy hiểm
        },
        description: String,
        impact: {
          type: String,
          enum: ["Rất cao", "Cao", "Trung bình", "Thấp"],
        },
      },
    ],
    cropFactors: [
      {
        factor: {
          type: String,
          enum: [
            "Giống nhạy cảm",
            "Mật độ trồng",
            "Độ tuổi cây",
            "Tình trạng dinh dưỡng",
            "Stress sinh lý",
            "Vết thương cơ học",
          ],
          required: true,
        },
        description: String,
        impact: {
          type: String,
          enum: ["Rất cao", "Cao", "Trung bình", "Thấp"],
        },
        preventionTips: [String],
      },
    ],
    soilFactors: [
      {
        factor: {
          type: String,
          enum: [
            "pH đất",
            "Dinh dưỡng",
            "Cấu trúc đất",
            "Thoát nước",
            "Vi sinh vật đất",
            "Độ mặn",
          ],
          required: true,
        },
        optimalRange: String,
        description: String,
        remediation: [String], // Biện pháp cải tạo
      },
    ],
    managementFactors: [
      // Yếu tố quản lý
      {
        factor: String, // "Tưới tiêu", "Bón phân", "Vệ sinh ruộng"
        description: String,
        impact: String,
        bestPractices: [String],
      },
    ],
    predisposingFactors: [String], // Yếu tố thuận lợi
    resistanceFactors: [String], // Yếu tố kháng bệnh
    interactionWithOtherDiseases: [
      {
        // Tương tác với bệnh khác
        diseaseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Disease",
        },
        interactionType: String, // "Cộng hưởng", "Đối kháng"
        description: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiseaseCause", diseaseCauseSchema);
