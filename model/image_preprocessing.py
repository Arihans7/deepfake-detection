#!/usr/bin/env python3
"""
Advanced Image Preprocessing Pipeline for Deepfake Detection
Handles face detection, extraction, and enhancement
"""

import cv2
import numpy as np
import os
from pathlib import Path

try:
    import dlib

    DLIB_AVAILABLE = True
except ImportError:
    DLIB_AVAILABLE = False
    print("⚠️  dlib not available, using alternative face detection methods")

try:
    from mtcnn import MTCNN

    MTCNN_AVAILABLE = True
except ImportError:
    MTCNN_AVAILABLE = False
    print("⚠️  MTCNN not available, using alternative face detection methods")

import tensorflow as tf


class ImagePreprocessor:
    def __init__(self, target_size=224, use_face_detection=True):
        self.target_size = target_size
        self.use_face_detection = use_face_detection

        # Initialize face detectors
        if use_face_detection:
            try:
                # Try MTCNN first (more accurate)
                if MTCNN_AVAILABLE:
                    self.mtcnn = MTCNN()
                    self.face_detector = "mtcnn"
                    print("✅ Using MTCNN for face detection")
                else:
                    raise ImportError("MTCNN not available")
            except:
                try:
                    # Fallback to dlib
                    if DLIB_AVAILABLE:
                        self.detector = dlib.get_frontal_face_detector()
                        self.face_detector = "dlib"
                        print("✅ Using dlib for face detection")
                    else:
                        raise ImportError("dlib not available")
                except:
                    # Fallback to OpenCV Haar cascades
                    cascade_path = (
                        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
                    )
                    self.face_cascade = cv2.CascadeClassifier(cascade_path)
                    self.face_detector = "opencv"
                    print("✅ Using OpenCV Haar cascades for face detection")
                    cascade_path = (
                        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
                    )
                    self.face_cascade = cv2.CascadeClassifier(cascade_path)
                    self.face_detector = "opencv"
                    print("✅ Using OpenCV Haar cascades for face detection")

    def detect_faces_mtcnn(self, image):
        """Detect faces using MTCNN"""
        try:
            result = self.mtcnn.detect_faces(image)
            faces = []

            for face in result:
                x, y, w, h = face["box"]
                # Ensure coordinates are within image bounds
                x = max(0, x)
                y = max(0, y)
                w = min(w, image.shape[1] - x)
                h = min(h, image.shape[0] - y)

                if w > 30 and h > 30:  # Minimum face size
                    faces.append((x, y, w, h))

            return faces
        except:
            return []

    def detect_faces_dlib(self, image):
        """Detect faces using dlib"""
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            faces = self.detector(gray)

            face_coords = []
            for face in faces:
                x, y, w, h = face.left(), face.top(), face.width(), face.height()
                face_coords.append((x, y, w, h))

            return face_coords
        except:
            return []

    def detect_faces_opencv(self, image):
        """Detect faces using OpenCV Haar cascades"""
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
            faces = self.face_cascade.detectMultiScale(
                gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
            )

            return [(x, y, w, h) for x, y, w, h in faces]
        except:
            return []

    def detect_faces(self, image):
        """Detect faces using the available detector"""
        if not self.use_face_detection:
            return []

        if self.face_detector == "mtcnn":
            return self.detect_faces_mtcnn(image)
        elif self.face_detector == "dlib":
            return self.detect_faces_dlib(image)
        elif self.face_detector == "opencv":
            return self.detect_faces_opencv(image)
        else:
            return []

    def extract_face(self, image, face_coords, margin=0.2):
        """Extract face with margin"""
        x, y, w, h = face_coords

        # Add margin
        margin_x = int(w * margin)
        margin_y = int(h * margin)

        # Calculate new coordinates
        x1 = max(0, x - margin_x)
        y1 = max(0, y - margin_y)
        x2 = min(image.shape[1], x + w + margin_x)
        y2 = min(image.shape[0], y + h + margin_y)

        # Extract face
        face = image[y1:y2, x1:x2]

        return face

    def enhance_image(self, image):
        """Apply image enhancement techniques"""
        # Convert to LAB color space for better enhancement
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)

        # Apply CLAHE to L channel
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l = clahe.apply(l)

        # Merge channels and convert back to RGB
        enhanced = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(enhanced, cv2.COLOR_LAB2RGB)

        return enhanced

    def preprocess_single_image(self, image_path, extract_faces=True, enhance=True):
        """Preprocess a single image"""
        try:
            # Load image
            if isinstance(image_path, str):
                image = cv2.imread(image_path)
                if image is None:
                    raise ValueError(f"Could not load image: {image_path}")
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            else:
                image = image_path

            processed_images = []

            if extract_faces and self.use_face_detection:
                # Detect faces
                faces = self.detect_faces(image)

                if faces:
                    # Process each detected face
                    for face_coords in faces:
                        face = self.extract_face(image, face_coords)

                        if enhance:
                            face = self.enhance_image(face)

                        # Resize to target size
                        face = cv2.resize(face, (self.target_size, self.target_size))
                        processed_images.append(face)
                else:
                    # No faces detected, use full image
                    if enhance:
                        image = self.enhance_image(image)

                    image = cv2.resize(image, (self.target_size, self.target_size))
                    processed_images.append(image)
            else:
                # Use full image without face detection
                if enhance:
                    image = self.enhance_image(image)

                image = cv2.resize(image, (self.target_size, self.target_size))
                processed_images.append(image)

            return processed_images

        except Exception as e:
            raise Exception(f"Error preprocessing image: {e}")

    def preprocess_dataset(
        self, input_dir, output_dir, extract_faces=True, enhance=True
    ):
        """Preprocess entire dataset"""
        input_path = Path(input_dir)
        output_path = Path(output_dir)

        if not input_path.exists():
            raise FileNotFoundError(f"Input directory not found: {input_dir}")

        # Create output directory
        output_path.mkdir(parents=True, exist_ok=True)

        # Process each class directory
        for class_dir in input_path.iterdir():
            if class_dir.is_dir():
                class_output_dir = output_path / class_dir.name
                class_output_dir.mkdir(exist_ok=True)

                print(f"📁 Processing {class_dir.name}...")

                # Get all image files
                image_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tiff"}
                image_files = [
                    f
                    for f in class_dir.iterdir()
                    if f.suffix.lower() in image_extensions
                ]

                processed_count = 0

                for img_file in image_files:
                    try:
                        # Preprocess image
                        processed_images = self.preprocess_single_image(
                            str(img_file), extract_faces, enhance
                        )

                        # Save processed images
                        for i, processed_img in enumerate(processed_images):
                            if len(processed_images) > 1:
                                output_filename = (
                                    f"{img_file.stem}_face_{i}{img_file.suffix}"
                                )
                            else:
                                output_filename = img_file.name

                            output_file_path = class_output_dir / output_filename

                            # Convert RGB to BGR for saving
                            save_img = cv2.cvtColor(processed_img, cv2.COLOR_RGB2BGR)
                            cv2.imwrite(str(output_file_path), save_img)

                        processed_count += 1

                        if processed_count % 100 == 0:
                            print(
                                f"✅ Processed {processed_count}/{len(image_files)} images"
                            )

                    except Exception as e:
                        print(f"❌ Error processing {img_file}: {e}")

                print(
                    f"✅ Completed {class_dir.name}: {processed_count} images processed"
                )


def main():
    """Command line interface for preprocessing"""
    import argparse

    parser = argparse.ArgumentParser(
        description="Image Preprocessing for Deepfake Detection"
    )
    parser.add_argument(
        "--input", "-i", type=str, required=True, help="Input directory"
    )
    parser.add_argument(
        "--output", "-o", type=str, required=True, help="Output directory"
    )
    parser.add_argument("--size", "-s", type=int, default=224, help="Target image size")
    parser.add_argument("--no-faces", action="store_true", help="Skip face detection")
    parser.add_argument(
        "--no-enhance", action="store_true", help="Skip image enhancement"
    )

    args = parser.parse_args()

    try:
        preprocessor = ImagePreprocessor(
            target_size=args.size, use_face_detection=not args.no_faces
        )

        preprocessor.preprocess_dataset(
            args.input,
            args.output,
            extract_faces=not args.no_faces,
            enhance=not args.no_enhance,
        )

        print("🎉 Preprocessing completed successfully!")

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()
