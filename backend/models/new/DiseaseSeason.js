const mongoose = require("mongoose");

const diseaseSeasonSchema = new mongoose.Schema(
  {
    diseaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewDisease",
      required: true,
      unique: true,
      index: true,
    },
    seasons: [
      {
        type: {
          type: String,
          enum: ["Đông Xuân", "Hè Thu", "Cả năm"],
          required: true,
        },
        startMonth: {
          type: Number,
          min: 1,
          max: 12,
          required: true,
        },
        endMonth: {
          type: Number,
          min: 1,
          max: 12,
          required: true,
        },
        riskLevel: {
          type: String,
          enum: ["Rất cao", "Cao", "Trung bình", "Thấp"],
          required: true,
        },
        peakMonths: [
          {
            type: Number,
            min: 1,
            max: 12,
          },
        ],
        description: String,
        historicalOutbreaks: [
          {
            year: Number,
            month: Number,
            severity: String,
            affectedArea: String,
          },
        ],
      },
    ],
    criticalPeriods: [
      {
        cropStage: {
          type: String,
          enum: [
            "Gieo mạ",
            "Cấy non",
            "Đẻ nhánh",
            "Làm đòng",
            "Trổ bông",
            "Chín sữa",
            "Chín vàng",
            "Thu hoạch",
          ],
          required: true,
        },
        riskLevel: {
          type: String,
          enum: ["Rất cao", "Cao", "Trung bình", "Thấp"],
          required: true,
        },
        daysAfterPlanting: {
          min: Number,
          max: Number,
        },
        description: String,
        preventiveMeasures: [String],
        earlyWarningSigns: [String],
      },
    ],
    regionalVariations: [
      {
        region: String,
        peakSeason: String,
        notes: String,
      },
    ],
    climateImpact: String,
  },
  { timestamps: true }
);

diseaseSeasonSchema.index({ "seasons.type": 1, "seasons.riskLevel": 1 });
diseaseSeasonSchema.index({ "criticalPeriods.cropStage": 1 });

module.exports = mongoose.model("DiseaseSeason", diseaseSeasonSchema);
