import cv2
import numpy as np
import tensorflow as tf
from mtcnn import MTCNN
import os

IMG_SIZE = 128

# Global variables for lazy loading
_model = None
_detector = None


def get_model():
    """Lazy load the model"""
    global _model
    if _model is None:
        if not os.path.exists("deepfake.h5"):
            raise FileNotFoundError(
                "Model file 'deepfake.h5' not found. Please train the model first."
            )
        _model = tf.keras.models.load_model("deepfake.h5")
    return _model


def get_detector():
    """Lazy load the face detector"""
    global _detector
    if _detector is None:
        _detector = MTCNN()
    return _detector


def predict_video(video_path, threshold=0.5):
    """
    Predict if a video is real or fake

    Args:
        video_path: Path to video file
        threshold: Classification threshold (default 0.5)

    Returns:
        String: "REAL", "FAKE", or "UNSURE"
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    model = get_model()
    detector = get_detector()

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        raise ValueError(f"Could not open video: {video_path}")

    preds = []
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % 10 == 0:
            try:
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                faces = detector.detect_faces(rgb_frame)

                if faces:
                    x, y, w, h = faces[0]["box"]
                    # Handle negative coordinates
                    x, y = max(0, x), max(0, y)
                    face = frame[y : y + h, x : x + w]

                    if face.size > 0:
                        face = cv2.resize(face, (IMG_SIZE, IMG_SIZE))
                        face = face / 255.0
                        face = np.expand_dims(face, axis=0)

                        pred = model.predict(face, verbose=0)[0][0]
                        preds.append(pred)
            except Exception as e:
                print(f"Error processing frame {frame_count}: {e}")

        frame_count += 1

    cap.release()

    if not preds:
        return "UNSURE"

    avg_pred = sum(preds) / len(preds)
    print(f"Analyzed {len(preds)} faces, average score: {avg_pred:.4f}")

    return "FAKE" if avg_pred > threshold else "REAL"
