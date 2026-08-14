# backend-flask/app.py
"""Flask AI microservice — Rule-Based Expert System for Crop Health."""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv

from expert_system.analyzer import analyze_crop_image
from expert_system.disease_db import CROPS

load_dotenv()

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

# ✅ Enable CORS for Express Backend
cors_config = {
    "origins": [
        os.getenv("ALLOWED_ORIGIN", "http://localhost:5000"),
        "http://localhost:5000"  # Fallback for local testing
    ],
    "methods": ["GET", "POST"],
    "allow_headers": ["Content-Type"]
}
CORS(app, resources={"/api/*": cors_config})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "kisan-mitra-flask-ai",
        "engine": "rule-based-expert-system"
    })


@app.route("/api/crops", methods=["GET"])
def list_crops():
    return jsonify({"crops": CROPS})


@app.route("/api/analyze", methods=["POST"])
def analyze():
    if "image" not in request.files:
        return jsonify({"error": "Image file is required."}), 400

    image_file = request.files["image"]
    if not image_file.filename:
        return jsonify({"error": "Empty image file."}), 400

    crop_id = (request.form.get("crop") or "wheat").lower().strip()
    valid_ids = {c["id"] for c in CROPS}
    if crop_id not in valid_ids:
        crop_id = "wheat"

    try:
        image_bytes = image_file.read()
        result = analyze_crop_image(image_bytes, crop_id)
        return jsonify(result)
    except Exception as exc:
        print(f"✗ Analysis error: {str(exc)}")
        return jsonify({"error": f"Analysis failed: {str(exc)}"}), 500

@app.route("/")
def home():
    return {"message": "Kisan Mitra Flask API is running!"}

if __name__ == "__main__":
    # ✅ Use PORT environment variable (platform-provided)
    port = int(os.getenv("PORT", 5001))
    host = os.getenv("HOST", "0.0.0.0")
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    
    print(f"✓ Flask running on {host}:{port}")
    app.run(host=host, port=port, debug=debug)
