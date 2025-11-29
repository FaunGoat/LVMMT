const mongoose = require("mongoose");

const diseasePreventionSchema = new mongoose.Schema(
  {
    diseaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewDisease",
      required: true,
      unique: true,
      index: true,
    },
    culturalPractices: [
      {
        practice: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        timing: String,
        frequency: String,
        procedure: [String],
        effectiveness: {
          type: Number,
          min: 1,
          max: 5,
        },
        cost: {
          type: String,
          enum: ["Thấp", "Trung bình", "Cao", "Rất cao"],
        },
        laborRequirement: String,
        benefits: [String],
        limitations: [String],
      },
    ],
    varietySelection: [
      {
        varietyName: {
          type: String,
          required: true,
        },
        scientificName: String,
        resistanceLevel: {
          type: String,
          enum: [
            "Kháng cao",
            "Kháng trung bình",
            "Dung nạp",
            "Nhạy cảm",
            "Rất nhạy cảm",
          ],
          required: true,
        },
        resistanceGenes: [String],
        yieldPotential: String,
        growthDuration: String,
        suitableRegions: [String],
        suitableSeasons: [String],
        notes: String,
        seedSource: String,
        seedTreatment: String,
      },
    ],
    seedTreatment: [
      {
        method: String,
        materials: [String],
        procedure: [String],
        effectiveness: Number,
        cost: String,
      },
    ],
    soilManagement: [
      {
        practice: {
          type: String,
          required: true,
        },
        description: String,
        timing: String,
        materials: [String],
        procedure: [String],
        benefits: [String],
        frequency: String,
      },
    ],
    waterManagement: [
      {
        practice: {
          type: String,
          required: true,
        },
        timing: String,
        description: String,
        waterDepth: String,
        duration: String,
        frequency: String,
        cropStage: [String],
        benefits: [String],
        precautions: [String],
      },
    ],
    nutritionManagement: [
      {
        nutrient: String,
        recommendation: String,
        timing: String,
        application: String,
        notes: String,
      },
    ],
    sanitationPractices: [
      {
        practice: String,
        timing: String,
        procedure: [String],
        importance: {
          type: String,
          enum: ["Rất quan trọng", "Quan trọng", "Nên làm"],
        },
      },
    ],
    cropRotation: {
      recommendedCrops: [String],
      rotationCycle: String,
      benefits: [String],
      considerations: [String],
    },
    biologicalControl: [
      {
        agent: String,
        application: String,
        timing: String,
        effectiveness: Number,
        cost: String,
      },
    ],
    monitoringSchedule: [
      {
        frequency: {
          type: String,
          required: true,
        },
        cropStage: String,
        whatToCheck: [String],
        tools: [String],
        threshold: String,
        recordKeeping: String,
        actionTriggers: [
          {
            condition: String,
            action: String,
          },
        ],
      },
    ],
    earlyWarningSystem: {
      indicators: [String],
      monitoringTools: [String],
      alertThresholds: String,
      responseProtocol: [String],
    },
    quarantineMeasures: [
      {
        measure: String,
        description: String,
        timing: String,
      },
    ],
    farmHygiene: [
      {
        practice: String,
        frequency: String,
        procedure: [String],
      },
    ],
    preventiveSchedule: {
      preSeasonPreparation: [String],
      earlySeasonActions: [String],
      midSeasonActions: [String],
      lateSeasonActions: [String],
      postHarvestActions: [String],
    },
    costEffectiveness: {
      totalPreventionCost: String,
      potentialLossPrevented: String,
      returnOnInvestment: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DiseasePrevention", diseasePreventionSchema);
