const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Hóa học", "Sinh học", "Canh tác"],
      required: true,
    },
    drugs: [String],
    dosage: String,
    notes: String,
    methods: [String],
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
    // CẬP NHẬT: Dùng path local thay vì URL
    images: [
      {
        path: { type: String, required: true }, // Local path: "dao-on-1.jpg"
        caption: { type: String },
        alt: { type: String },
      },
    ],
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Disease", diseaseSchema);
