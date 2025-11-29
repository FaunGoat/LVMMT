const mongoose = require("mongoose");

const diseaseTreatmentSchema = new mongoose.Schema(
  {
    diseaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NewDisease",
      required: true,
      unique: true,
      index: true,
    },
    treatments: [
      {
        type: {
          type: String,
          enum: ["Hóa học", "Sinh học", "Canh tác", "Tổng hợp"],
          required: true,
        },
        priority: {
          type: Number,
          min: 1,
          max: 5,
          required: true,
        },
        methods: [
          {
            name: {
              type: String,
              required: true,
            },
            category: String,
            activeIngredient: String,
            concentration: String,
            dosage: {
              type: String,
              required: true,
            },
            frequency: String,
            timing: String,
            applicationMethod: {
              type: String,
              enum: [
                "Phun",
                "Rải",
                "Ngâm hạt",
                "Tưới gốc",
                "Bón vào đất",
                "Trộn hạt giống",
                "Khác",
              ],
            },
            coverage: String,
            waterVolume: String,
            equipmentRequired: [String],
            effectiveStages: [String],
            efficacyRate: Number,
            cost: String,
            effectiveness: {
              type: Number,
              min: 1,
              max: 5,
            },
            speedOfAction: String,
            duration: String,
            compatibility: [String],
            incompatibility: [String],
            sideEffects: [String],
            resistance: {
              level: String,
              rotation: [String],
              notes: String,
            },
          },
        ],
        procedure: [String],
        bestPractices: [String],
        commonMistakes: [String],
        notes: String,
        warnings: [String],
        safetyPeriod: String,
        environmentalImpact: String,
        successRate: Number,
      },
    ],
    integratedPestManagement: {
      strategy: String,
      decisionThreshold: String,
      monitoringSchedule: String,
      actionPlan: [String],
    },
    organicAlternatives: [
      {
        method: String,
        description: String,
        effectiveness: Number,
        cost: String,
      },
    ],
    emergencyProtocol: {
      immediateActions: [String],
      supportContacts: [String],
      reportingProcedure: String,
    },
    resistanceManagement: String,
    postTreatmentCare: [String],
    successIndicators: [String],
    failureReasons: [String],
    costBenefitAnalysis: {
      treatmentCost: String,
      expectedYieldLoss: String,
      netBenefit: String,
    },
  },
  { timestamps: true }
);

diseaseTreatmentSchema.index({
  "treatments.type": 1,
  "treatments.priority": 1,
});

module.exports = mongoose.model("DiseaseTreatment", diseaseTreatmentSchema);
