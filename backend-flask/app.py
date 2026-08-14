"""Flask AI microservice — Rule-Based Expert System for Crop Health."""

import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request

from expert_system.analyzer import analyze_crop_image
from expert_system.disease_db import CROPS

load_dotenv()

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "kisan-mitra-flask-ai", "engine": "rule-based-expert-system"})


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
        return jsonify({"error": f"Analysis failed: {str(exc)}"}), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(host="0.0.0.0", port=port, debug=debug)
