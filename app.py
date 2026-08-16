from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from model.predict_video import predict_video
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes
app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024  # 100MB max file size


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Backend is running"})


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "video" not in request.files:
            return jsonify({"error": "No video file provided"}), 400

        video = request.files["video"]

        if video.filename == "":
            return jsonify({"error": "Empty filename"}), 400

        # Save with original extension
        ext = os.path.splitext(video.filename)[1] or ".mp4"
        path = f"temp{ext}"
        video.save(path)

        try:
            result = predict_video(path)
            return jsonify({"result": result})
        finally:
            # Clean up temp file
            if os.path.exists(path):
                os.remove(path)

    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
