const mongoose = require("mongoose");

const newDiseaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    scientificName: {
      type: String,
      required: true,
    },
    commonName: String,
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "Bệnh nấm",
        "Sâu hại",
        "Bệnh vi khuẩn",
        "Bệnh virus",
        "Sâu bệnh khác",
      ],
      required: true,
    },
    severityRisk: {
      type: String,
      enum: ["Rất cao", "Cao", "Trung bình", "Thấp"],
      required: true,
      index: true,
    },
    economicLoss: {
      type: String,
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        caption: String,
        alt: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: "new_diseases", // Collection mới
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual để lấy tất cả thông tin liên quan
newDiseaseSchema.virtual("stages", {
  ref: "DiseaseStage",
  localField: "_id",
  foreignField: "diseaseId",
  justOne: true,
});

newDiseaseSchema.virtual("seasons", {
  ref: "DiseaseSeason",
  localField: "_id",
  foreignField: "diseaseId",
  justOne: true,
});

newDiseaseSchema.virtual("causes", {
  ref: "DiseaseCause",
  localField: "_id",
  foreignField: "diseaseId",
  justOne: true,
});

newDiseaseSchema.virtual("symptoms", {
  ref: "DiseaseSymptom",
  localField: "_id",
  foreignField: "diseaseId",
  justOne: true,
});

newDiseaseSchema.virtual("treatments", {
  ref: "DiseaseTreatment",
  localField: "_id",
  foreignField: "diseaseId",
  justOne: true,
});

newDiseaseSchema.virtual("prevention", {
  ref: "DiseasePrevention",
  localField: "_id",
  foreignField: "diseaseId",
  justOne: true,
});

newDiseaseSchema.virtual("weatherCorrelation", {
  ref: "WeatherDiseaseCorrelation",
  localField: "_id",
  foreignField: "diseaseId",
  justOne: true,
});

// Index để tìm kiếm nhanh
newDiseaseSchema.index({
  name: "text",
  scientificName: "text",
  commonName: "text",
});

module.exports = mongoose.model("NewDisease", newDiseaseSchema);
