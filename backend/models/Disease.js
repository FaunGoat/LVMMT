const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Hóa học", "Sinh học", "Canh tác"],
      required: true,
    },
    drugs: [String], // Chỉ dùng cho Hóa học & Sinh học
    dosage: String, // Chỉ dùng cho Hóa học & Sinh học
    notes: String, // Chỉ dùng cho Hóa học & Sinh học
    methods: [String], // Chỉ dùng cho Canh tác
  },
  { _id: false }
);

const diseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    scientificName: { type: String, required: true },
    commonName: { type: String },
    symptoms: [{ type: String, required: true }],
    causes: { type: String, required: true },
    treatments: [treatmentSchema],
    weatherTriggers: [{ type: String, required: true }],
    weatherPrevention: { type: String, required: true },
    severityRisk: {
      type: String,
      enum: ["Thấp", "Trung bình", "Cao", "Rất cao"],
      required: true,
    },
    economicLoss: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Disease", diseaseSchema);
