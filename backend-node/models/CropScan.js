const mongoose = require("mongoose");

const cropScanSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    crop: { type: String, required: true },
    diseaseName: { type: String, required: true },
    diseaseId: { type: String },
    severity: { type: Number, default: 0 },
    severityLevel: { type: String, default: "none" },
    confidence: { type: Number, default: 0 },
    symptoms: [String],
    treatment: {
      organic: String,
      chemical: String,
      dosage: String,
      frequency: String
    },
    imageFilename: { type: String },
    rawAnalysis: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CropScan", cropScanSchema);
