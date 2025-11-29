const mongoose = require("mongoose");

// Schema cũ - CHỈ GIỮ LẠI ĐỂ ĐỌC DỮ LIỆU CŨ
const oldDiseaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    scientificName: { type: String, required: true },
    commonName: { type: String },
    symptoms: [{ type: String }], // Không required
    causes: { type: String }, // Không required
    treatments: [
      {
        type: { type: String, enum: ["Hóa học", "Sinh học", "Canh tác"] },
        drugs: [String],
        dosage: String,
        notes: String,
        methods: [String],
      },
    ],
    weatherTriggers: [{ type: String }], // Không required
    weatherPrevention: { type: String }, // Không required
    severityRisk: {
      type: String,
      enum: ["Thấp", "Trung bình", "Cao", "Rất cao"],
      required: true,
    },
    economicLoss: { type: String, required: true },
    images: [
      {
        path: { type: String, required: true },
        caption: { type: String },
        alt: { type: String },
      },
    ],
    description: { type: String },
  },
  { timestamps: true, collection: "diseases" } // Chỉ định collection cũ
);

module.exports = mongoose.model("Disease", oldDiseaseSchema);
