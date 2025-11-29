const mongoose = require("mongoose");

const diseaseStageSchema = new mongoose.Schema(
  {
    diseaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewDisease",
      required: true,
      index: true,
    },
    stages: [
      {
        name: {
          type: String,
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        symptoms: [String],
        severity: {
          type: String,
          enum: ["Nhẹ", "Trung bình", "Nặng", "Rất nặng"],
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
        cropDamage: String,
        visualSigns: [String],
        spreadRate: String,
      },
    ],
    totalDuration: {
      type: String,
      required: true,
    },
    peakStage: {
      type: Number,
      required: true,
    },
    incubationPeriod: String,
    notes: String,
  },
  { timestamps: true }
);

diseaseStageSchema.index({ diseaseId: 1, "stages.order": 1 });

module.exports = mongoose.model("DiseaseStage", diseaseStageSchema);
