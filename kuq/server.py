"""
Kuq — Local Backend Server
Serves the front-end and stores anonymous user data locally.
"""

import json
import os
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory

app = Flask(__name__)

# Path to the data file
DATA_FILE = os.path.join(os.path.dirname(__file__), "responses.json")

# ----------------------------
# Serve front-end files
# ----------------------------
@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/<path:filename>")
def static_files(filename):
    return send_from_directory(".", filename)

# ----------------------------
# API: Save a response
# ----------------------------
@app.route("/api/respond", methods=["POST"])
def save_response():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "No data provided"}), 400

        consent = data.get("consent")  # "yes" or "no"
        answers = data.get("answers", {})
        scores = data.get("scores", {})
        profile_name = data.get("profile_name", "Unknown")
        layer_scores = data.get("layer_scores", {})

        # Build the response record
        record = {
            "timestamp": datetime.now().isoformat(),
            "consent": consent,
            "profile_name": profile_name,
            "answers": answers,
            "scores": scores,
            "layer_scores": layer_scores
        }

        # Load existing data
        responses = []
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, "r") as f:
                try:
                    responses = json.load(f)
                except json.JSONDecodeError:
                    responses = []

        # Append new record
        responses.append(record)

        # Save back
        with open(DATA_FILE, "w") as f:
            json.dump(responses, f, indent=2)

        return jsonify({"status": "saved", "total_responses": len(responses)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ----------------------------
# API: Get summary stats
# ----------------------------
@app.route("/api/stats", methods=["GET"])
def get_stats():
    if not os.path.exists(DATA_FILE):
        return jsonify({"total": 0, "consented": 0, "declined": 0, "profiles": {}}), 200

    with open(DATA_FILE, "r") as f:
        try:
            responses = json.load(f)
        except json.JSONDecodeError:
            return jsonify({"total": 0, "consented": 0, "declined": 0, "profiles": {}}), 200

    consented = [r for r in responses if r.get("consent") == "yes"]
    declined = [r for r in responses if r.get("consent") == "no"]

    # Count profiles (only from consented)
    profiles = {}
    for r in consented:
        name = r.get("profile_name", "Unknown")
        profiles[name] = profiles.get(name, 0) + 1

    return jsonify({
        "total": len(responses),
        "consented": len(consented),
        "declined": len(declined),
        "profiles": profiles
    }), 200

# ----------------------------
# API: Get all responses
# ----------------------------
@app.route("/api/responses", methods=["GET"])
def get_responses():
    if not os.path.exists(DATA_FILE):
        return jsonify([]), 200

    with open(DATA_FILE, "r") as f:
        try:
            responses = json.load(f)
        except json.JSONDecodeError:
            return jsonify([]), 200

    return jsonify(responses), 200

# ----------------------------
# API: Get only consented responses
# ----------------------------
@app.route("/api/responses/consented", methods=["GET"])
def get_consented_responses():
    if not os.path.exists(DATA_FILE):
        return jsonify([]), 200

    with open(DATA_FILE, "r") as f:
        try:
            responses = json.load(f)
        except json.JSONDecodeError:
            return jsonify([]), 200

    consented = [r for r in responses if r.get("consent") == "yes"]
    return jsonify(consented), 200

# ----------------------------
# Run
# ----------------------------
if __name__ == "__main__":
    print("=" * 50)
    print("  Kuq — Local Server")
    print("  Open http://localhost:5000 in your browser")
    print("=" * 50)
    app.run(debug=True, port=5000)
