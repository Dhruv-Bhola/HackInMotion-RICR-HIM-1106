const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const cropHealthRoutes = require("./routes/cropHealth");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((error) => console.error("MongoDB connection failed:", error.message));

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/crop-health", cropHealthRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Kisan Mitra Backend is running!" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "kisan-mitra-backend" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
