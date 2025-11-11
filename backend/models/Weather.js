const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // YYYY-MM-DD
    location: { type: String, required: true },
    temperature: { type: String, required: true },
    humidity: { type: String, required: true },
    condition: { type: String, required: true },
    diseaseAlerts: [{ type: String, required: true }],
  },
  { timestamps: true }
);

// Index để tìm nhanh theo ngày + khu vực
weatherSchema.index({ date: 1, location: 1 });

module.exports = mongoose.model("Weather", weatherSchema);
