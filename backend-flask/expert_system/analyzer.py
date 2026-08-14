"""Visual feature extraction and rule-based disease matching."""

import random
from io import BytesIO

from PIL import Image

from expert_system.disease_db import get_diseases_for_crop


def analyze_visual_features(image: Image.Image) -> dict:
    """Extract color-based visual features from a crop image (64x64 sample)."""
    img = image.convert("RGB").resize((64, 64))
    pixels = list(img.getdata())

    brown_score = yellow_score = green_score = white_score = 0
    dark_brown_score = water_soaked_score = 0
    total = len(pixels)

    for r, g, b in pixels:
        if 40 < r < 120 and 30 < g < 90 and b < 70:
            dark_brown_score += 1
        if 100 < r < 180 and 50 < g < 130 and b < 90:
            brown_score += 1
        if r > 160 and g > 160 and b < 120:
            yellow_score += 1
        if g > r and g > b and g > 80:
            green_score += 1
        if r > 200 and g > 200 and b > 200:
            white_score += 1
        if 50 < r < 130 and 60 < g < 120 and 40 < b < 100:
            water_soaked_score += 1

    brown_ratio = brown_score / total
    dark_brown_ratio = dark_brown_score / total
    yellow_ratio = yellow_score / total
    green_ratio = green_score / total
    white_ratio = white_score / total
    water_soaked_ratio = water_soaked_score / total

    has_significant_brown = brown_ratio > 0.05 or dark_brown_ratio > 0.05
    has_blight = (brown_ratio > 0.1 or dark_brown_ratio > 0.1) and green_ratio < 0.7

    return {
        "brownSpots": max(brown_ratio, dark_brown_ratio) * (1.5 if has_blight else 1),
        "yellowEdges": yellow_ratio,
        "whiteMold": white_ratio,
        "healthyGreen": green_ratio,
        "rustColor": brown_ratio * 0.9,
        "blackSpots": dark_brown_ratio * 1.2,
        "wilting": yellow_ratio * 0.6,
        "waterSoaked": max(water_soaked_ratio, dark_brown_ratio) * 1.3,
        "isLeafDisease": has_significant_brown and green_ratio > 0.2,
        "isSevere": dark_brown_ratio > 0.15,
    }


def score_disease(features: dict, disease: dict) -> float:
    """Rule-based expert system: match visual features to disease patterns."""
    is_leaf = (
        "root" not in disease["name"].lower()
        and "scurf" not in disease["name"].lower()
        and "tuber" not in disease["name"].lower()
    )
    leaf_penalty = 0.3 if not is_leaf and features.get("isLeafDisease") else 1.0

    patterns = disease.get("visualPatterns") or []

    if not patterns:
        score = features["healthyGreen"] * 100 - features["brownSpots"] * 80 - features["blackSpots"] * 50
        max_score = 100
    else:
        score = 0
        max_score = len(patterns) * 100
        for pattern in patterns:
            if features.get(pattern):
                score += features[pattern] * 100

    adjusted = score * leaf_penalty
    confidence = min(95, (adjusted / max_score) * 100 + random.random() * 10) if max_score > 0 else random.random() * 20
    return round(confidence, 1)


def analyze_crop_image(image_bytes: bytes, crop_id: str) -> dict:
    """Run the full rule-based expert system pipeline on an uploaded image."""
    image = Image.open(BytesIO(image_bytes))
    features = analyze_visual_features(image)
    diseases = get_diseases_for_crop(crop_id)

    scored = []
    for disease in diseases:
        confidence = score_disease(features, disease)
        scored.append({**disease, "confidence": confidence})

    scored.sort(key=lambda d: d["confidence"], reverse=True)
    best = scored[0]
    treatment = best.get("treatment", {})

    return {
        "cropId": crop_id,
        "diseaseId": best["id"],
        "diseaseName": best["nameHi"],
        "diseaseNameEn": best["name"],
        "severity": best["severity"],
        "severityLevel": best["severityLevel"],
        "confidence": best["confidence"],
        "symptoms": best.get("symptomsHi", best.get("symptoms", [])),
        "symptomsEn": best.get("symptoms", []),
        "treatment": {
            "organic": treatment.get("organicHi") or treatment.get("organic"),
            "chemical": treatment.get("chemicalHi") or treatment.get("chemical"),
            "dosage": treatment.get("dosageHi") or treatment.get("dosage"),
            "frequency": treatment.get("frequencyHi") or treatment.get("frequency"),
        },
        "visualFeatures": {k: round(v, 4) for k, v in features.items() if isinstance(v, float)},
        "alternatives": [
            {"name": d["nameHi"], "confidence": d["confidence"]}
            for d in scored[1:3]
        ],
        "engine": "rule-based-expert-system",
    }
