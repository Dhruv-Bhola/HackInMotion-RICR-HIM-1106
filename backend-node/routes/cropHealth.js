// backend-node/routes/cropHealth.js
const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");
const authMiddleware = require("../middleware/auth");
const CropScan = require("../models/CropScan");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname) || ".jpg"}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed."));
    }
  }
});

const CROP_MAP = {
  "गेहूं": "wheat",
  "धान": "rice",
  "धान (चावल)": "rice",
  "मक्का": "corn",
  "सरसों": "wheat",
  "आलू": "potato",
  tomato: "tomato",
  potato: "potato",
  corn: "corn",
  wheat: "wheat",
  rice: "rice"
};

router.post("/analyze", authMiddleware, upload.single("image"), async (req, res) => {
  let savedPath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "Crop image is required." });
    }

    savedPath = req.file.path;
    const cropInput = req.body.crop || "wheat";
    const cropId = CROP_MAP[cropInput] || cropInput.toLowerCase();

    // ✅ Use environment variable, fallback to localhost for dev
    const flaskUrl = `${process.env.FLASK_API_URL || "http://localhost:5001"}/api/analyze`;
    
    console.log(`Forwarding to Flask: ${flaskUrl}`);

    const form = new FormData();
    form.append("image", fs.createReadStream(savedPath), {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    form.append("crop", cropId);

    const flaskResponse = await fetch(flaskUrl, {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
      timeout: 30000  // 30 second timeout
    });

    if (!flaskResponse.ok) {
      const errText = await flaskResponse.text();
      console.error(`✗ Flask error (${flaskResponse.status}):`, errText);
      return res.status(502).json({
        message: "AI analysis service unavailable. Please check Flask service.",
        detail: errText
      });
    }

    const analysis = await flaskResponse.json();

    // ✅ Save to MongoDB
    const scan = await CropScan.create({
      userId: req.user.id,
      crop: cropInput,
      diseaseName: analysis.diseaseName,
      diseaseId: analysis.diseaseId,
      severity: analysis.severity,
      severityLevel: analysis.severityLevel,
      confidence: analysis.confidence,
      symptoms: analysis.symptoms || [],
      treatment: analysis.treatment || {},
      imageFilename: req.file.filename,
      rawAnalysis: analysis
    });

    res.json({
      message: "Crop health analysis complete.",
      scanId: scan._id,
      result: analysis
    });
  } catch (error) {
    console.error("✗ Crop health analyze error:", error);
    res.status(500).json({
      message: error.message || "Failed to analyze crop image."
    });
  } finally {
    if (savedPath && fs.existsSync(savedPath)) {
      fs.unlinkSync(savedPath);
    }
  }
});

router.get("/history", authMiddleware, async (req, res) => {
  try {
    const scans = await CropScan.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("-rawAnalysis");

    res.json({ scans });
  } catch (error) {
    console.error("✗ History error:", error);
    res.status(500).json({ message: "Failed to fetch scan history." });
  }
});

module.exports = router;
