// backend-node/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const cropHealthRoutes = require("./routes/cropHealth");

const app = express();

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✓ MongoDB connected successfully"))
  .catch((error) => {
    console.error("✗ MongoDB connection failed:", error.message);
    process.exit(1);
  });

// ✅ CORS Configuration — Allow Netlify Frontend + Internal Flask
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN,
  "https://kisanmitraaaa.netlify.app",
  "http://localhost:3000",
  "http://localhost:3001"
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Health Check Endpoint
app.get("/", (_req, res) => {
  res.json({ message: "Kisan Mitra Backend is running!" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "kisan-mitra-backend" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/crop-health", cropHealthRoutes);

// Error Handler
app.use((err, _req, res, _next) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error"
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`✓ Server running on ${HOST}:${PORT}`);
  console.log(`✓ CORS enabled for: ${corsOptions.origin.join(", ")}`);
});
