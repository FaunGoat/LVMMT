const mongoose = require("mongoose");

const diseaseAlertSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["success", "info", "warning", "danger"],
      default: "info",
    },
    disease: { type: String, required: true },
    message: { type: String, required: true },
    action: { type: String, required: true },
  },
  { _id: false }
);

const weatherSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    location: { type: String, required: true },
    temperature: { type: String, required: true },
    humidity: { type: String, required: true },
    condition: { type: String, required: true },
    windSpeed: { type: String },
    rainfall: { type: String },
    diseaseAlerts: [diseaseAlertSchema], // Structured alerts
  },
  { timestamps: true }
);

// Index để tìm nhanh theo ngày + khu vực
weatherSchema.index({ date: 1, location: 1 });

module.exports = mongoose.model("Weather", weatherSchema);
