const mongoose = require("mongoose");

const diseaseSymptomSchema = new mongoose.Schema(
  {
    diseaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Disease",
      required: true,
      unique: true,
      index: true,
    },
    symptoms: [
      {
        part: {
          type: String,
          enum: ["Lá", "Thân", "Bông", "Hạt", "Rễ", "Ngọn", "Gốc", "Toàn cây"],
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        stage: {
          type: String,
          enum: ["Sớm", "Giữa", "Muộn", "Tất cả"],
          required: true,
        },
        severity: {
          type: String,
          enum: ["Nhẹ", "Trung bình", "Nặng", "Rất nặng"],
          required: true,
        },
        visualCharacteristics: {
          // Đặc điểm hình thái
          color: [String], // ["Vàng", "Nâu", "Đen"]
          shape: String, // "Hình thoi", "Tròn", "Không đều"
          size: String, // "2-5mm", "Lớn dần"
          texture: String, // "Khô", "Ướt", "Mềm"
          pattern: String, // "Đốm rải rác", "Khu trú", "Lan tỏa"
          location: String, // "Mép lá", "Giữa lá", "Gân lá"
        },
        progression: String, // Diễn biến triệu chứng
        images: [
          {
            path: String,
            caption: String,
            stage: String, // "Sớm", "Giữa", "Muộn"
          },
        ],
        distinguishingFeatures: [String], // Đặc điểm phân biệt
        microscopicFeatures: String, // Đặc điểm vi thể
        fieldDiagnosis: [String], // Cách chẩn đoán ngoài đồng
      },
    ],
    diagnosticChecklist: [
      {
        // Danh sách kiểm tra chẩn đoán
        question: String,
        expectedAnswer: String,
        importance: {
          type: String,
          enum: ["Quan trọng", "Tham khảo", "Bổ sung"],
        },
      },
    ],
    similarDiseases: [
      {
        diseaseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Disease",
        },
        similarities: [String], // Điểm giống nhau
        differences: [String], // Điểm khác biệt để phân biệt
        confusionRisk: {
          type: String,
          enum: ["Cao", "Trung bình", "Thấp"],
        },
      },
    ],
    laboratoryTests: [
      {
        // Xét nghiệm phòng thí nghiệm
        testName: String,
        procedure: String,
        expectedResult: String,
        cost: String,
        duration: String,
      },
    ],
    notes: String,
  },
  { timestamps: true }
);

// Index để tìm kiếm theo triệu chứng
diseaseSymptomSchema.index({
  "symptoms.description": "text",
  "symptoms.distinguishingFeatures": "text",
});

module.exports = mongoose.model("DiseaseSymptom", diseaseSymptomSchema);
