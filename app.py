from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from model.predict_video import predict_video
import os
import tempfile

app = Flask(__name__)
CORS(app)
app.config["MAX_CONTENT_LENGTH"] = 100 * 1024 * 1024  # 100 MB

ALLOWED_VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".webm"}


@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Backend is running"})


@app.route("/predict", methods=["POST"])
def predict():
    if "video" not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    video = request.files["video"]
    if not video.filename:
        return jsonify({"error": "Empty filename"}), 400

    extension = os.path.splitext(video.filename)[1].lower()
    if extension not in ALLOWED_VIDEO_EXTENSIONS:
        return jsonify({
            "error": "Unsupported video format. Use MP4, AVI, MOV, MKV, or WEBM."
        }), 400

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=extension) as temp_file:
            temp_path = temp_file.name
            video.save(temp_path)

        result = predict_video(temp_path)
        return jsonify({"result": result})

    except FileNotFoundError as exc:
        return jsonify({"error": str(exc)}), 500
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    except Exception as exc:
        app.logger.exception("Prediction failed")
        return jsonify({"error": "Prediction failed. Please try again."}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
