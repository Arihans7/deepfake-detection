import os
import time

import cv2
import numpy as np
import tensorflow as tf
from mtcnn import MTCNN

IMG_SIZE = 128
FRAME_SAMPLE_INTERVAL = 10

# Global variables for lazy loading
_model = None
_detector = None


def get_model():
    """Load the trained model once and reuse it for subsequent requests."""
    global _model
    if _model is None:
        if not os.path.exists("deepfake.h5"):
            raise FileNotFoundError(
                "Model file 'deepfake.h5' not found. Please train the model first."
            )
        _model = tf.keras.models.load_model("deepfake.h5")
    return _model


def get_detector():
    """Load the MTCNN face detector once and reuse it."""
    global _detector
    if _detector is None:
        _detector = MTCNN()
    return _detector


def predict_video(video_path, threshold=0.5):
    """Analyze a video and return a transparent, structured detection result.

    The model is assumed to output a sigmoid probability where higher values
    indicate a higher likelihood of the face being manipulated.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    start_time = time.perf_counter()
    model = get_model()
    detector = get_detector()

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Could not open video: {video_path}")

    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
    fps = float(cap.get(cv2.CAP_PROP_FPS) or 0)
    duration = total_frames / fps if fps > 0 else 0

    predictions = []
    sampled_frames = 0
    detected_faces = 0
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % FRAME_SAMPLE_INTERVAL == 0:
            sampled_frames += 1
            try:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                faces = detector.detect_faces(rgb_frame)

                if faces:
                    # Use the highest-confidence detected face in the frame.
                    face_data = max(faces, key=lambda item: item.get("confidence", 0))
                    x, y, w, h = face_data["box"]
                    x, y = max(0, x), max(0, y)
                    w, h = max(0, w), max(0, h)
                    face = frame[y : y + h, x : x + w]

                    if face.size > 0:
                        detected_faces += 1
                        face = cv2.resize(face, (IMG_SIZE, IMG_SIZE))
                        face = face.astype(np.float32) / 255.0
                        face = np.expand_dims(face, axis=0)

                        prediction = float(model.predict(face, verbose=0)[0][0])
                        predictions.append(prediction)
            except Exception as exc:
                print(f"Error processing frame {frame_count}: {exc}")

        frame_count += 1

    cap.release()

    processing_time = round(time.perf_counter() - start_time, 2)

    if not predictions:
        return {
            "label": "UNSURE",
            "confidence": 0.0,
            "raw_score": None,
            "frames_analyzed": 0,
            "frames_sampled": sampled_frames,
            "faces_detected": 0,
            "total_frames": total_frames,
            "fps": round(fps, 2),
            "duration_seconds": round(duration, 2),
            "processing_time_seconds": processing_time,
        }

    avg_score = float(np.mean(predictions))
    is_fake = avg_score > threshold
    confidence = avg_score if is_fake else 1.0 - avg_score

    return {
        "label": "FAKE" if is_fake else "REAL",
        "confidence": round(confidence * 100, 2),
        "raw_score": round(avg_score, 6),
        "frames_analyzed": len(predictions),
        "frames_sampled": sampled_frames,
        "faces_detected": detected_faces,
        "total_frames": total_frames,
        "fps": round(fps, 2),
        "duration_seconds": round(duration, 2),
        "processing_time_seconds": processing_time,
    }
