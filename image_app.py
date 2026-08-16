#!/usr/bin/env python3
"""
Flask Web Application for Image Deepfake Detection
Provides REST API endpoints for image classification
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import os
import cv2
import numpy as np
from werkzeug.utils import secure_filename
import tensorflow as tf
from model.predict_image import ImageDeepfakePredictor
import base64
from io import BytesIO
from PIL import Image
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max file size
app.config["UPLOAD_FOLDER"] = "uploads"

# Ensure upload directory exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "bmp", "tiff"}

# Global predictor instance
predictor = None


def allowed_file(filename):
    """Check if file extension is allowed"""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def init_predictor():
    """Initialize the image predictor"""
    global predictor
    try:
        # Try different model paths
        model_paths = [
            "image_deepfake_model.h5",
            "image_deepfake_best.h5",
            "deepfake.h5",
            "deepfake_best.h5",
        ]

        for model_path in model_paths:
            if os.path.exists(model_path):
                predictor = ImageDeepfakePredictor(model_path)
                print(f"✅ Loaded model: {model_path}")
                return True

        print("❌ No trained model found!")
        return False

    except Exception as e:
        print(f"❌ Error initializing predictor: {e}")
        return False


@app.route("/")
def index():
    """Main page"""
    return render_template("image_index.html")


@app.route("/api/health")
def health_check():
    """Health check endpoint"""
    return jsonify(
        {
            "status": "healthy",
            "model_loaded": predictor is not None,
            "timestamp": datetime.now().isoformat(),
        }
    )


@app.route("/api/predict", methods=["POST"])
def predict_image():
    """Predict if uploaded image is deepfake"""
    global predictor

    if predictor is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        # Check if file is in request
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type"}), 400

        # Save uploaded file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        # Make prediction
        result = predictor.predict_single_image(filepath, verbose=False)

        # Add additional metadata
        result["filename"] = filename
        result["timestamp"] = datetime.now().isoformat()

        # Clean up uploaded file (optional)
        # os.remove(filepath)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/predict_base64", methods=["POST"])
def predict_base64():
    """Predict from base64 encoded image"""
    global predictor

    if predictor is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.get_json()

        if "image" not in data:
            return jsonify({"error": "No image data provided"}), 400

        # Decode base64 image
        image_data = data["image"]
        if image_data.startswith("data:image"):
            # Remove data URL prefix
            image_data = image_data.split(",")[1]

        # Decode and convert to OpenCV format
        image_bytes = base64.b64decode(image_data)
        image_pil = Image.open(BytesIO(image_bytes))
        image_cv = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)

        # Make prediction
        result = predictor.predict_single_image(image_cv, verbose=False)

        # Add metadata
        result["timestamp"] = datetime.now().isoformat()

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/predict_batch", methods=["POST"])
def predict_batch():
    """Predict multiple images at once"""
    global predictor

    if predictor is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        # Check if files are in request
        if "files" not in request.files:
            return jsonify({"error": "No files provided"}), 400

        files = request.files.getlist("files")

        if not files or all(f.filename == "" for f in files):
            return jsonify({"error": "No files selected"}), 400

        results = []
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        for i, file in enumerate(files):
            if file and allowed_file(file.filename):
                try:
                    # Save file
                    filename = secure_filename(file.filename)
                    filename = f"{timestamp}_{i}_{filename}"
                    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
                    file.save(filepath)

                    # Make prediction
                    result = predictor.predict_single_image(filepath, verbose=False)
                    result["filename"] = file.filename
                    result["index"] = i

                    results.append(result)

                except Exception as e:
                    results.append(
                        {"filename": file.filename, "index": i, "error": str(e)}
                    )

        # Summary statistics
        successful_predictions = [r for r in results if "error" not in r]
        fake_count = sum(1 for r in successful_predictions if r.get("is_fake", False))

        return jsonify(
            {
                "results": results,
                "summary": {
                    "total_files": len(files),
                    "successful_predictions": len(successful_predictions),
                    "fake_detected": fake_count,
                    "real_detected": len(successful_predictions) - fake_count,
                    "errors": len(results) - len(successful_predictions),
                },
                "timestamp": datetime.now().isoformat(),
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/model_info")
def model_info():
    """Get information about the loaded model"""
    global predictor

    if predictor is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        model = predictor.model

        info = {
            "model_loaded": True,
            "input_shape": model.input_shape,
            "output_shape": model.output_shape,
            "total_params": model.count_params(),
            "layers": len(model.layers),
            "model_type": "Image Deepfake Detection",
            "image_size": predictor.img_size,
        }

        return jsonify(info)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    """Serve uploaded files"""
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


@app.errorhandler(413)
def too_large(e):
    """Handle file too large error"""
    return jsonify({"error": "File too large. Maximum size is 16MB."}), 413


@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({"error": "Endpoint not found"}), 404


@app.errorhandler(500)
def internal_error(e):
    """Handle internal server errors"""
    return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    print("🚀 Starting Image Deepfake Detection API...")

    # Initialize predictor
    if init_predictor():
        print("✅ Model loaded successfully")
    else:
        print("⚠️  Warning: No model loaded. Please train a model first.")

    print("🌐 API Endpoints:")
    print("  POST /api/predict - Single image prediction")
    print("  POST /api/predict_base64 - Base64 image prediction")
    print("  POST /api/predict_batch - Batch image prediction")
    print("  GET  /api/model_info - Model information")
    print("  GET  /api/health - Health check")

    # Run the app
    app.run(host="0.0.0.0", port=5001, debug=True)
