#!/usr/bin/env python3
"""
Image Deepfake Detection Prediction Module
Handles single image and batch image predictions
"""

import tensorflow as tf
import cv2
import numpy as np
import os
import argparse
from pathlib import Path


class ImageDeepfakePredictor:
    def __init__(self, model_path="image_deepfake_model.h5", img_size=224):
        self.img_size = img_size
        self.model = None
        self.load_model(model_path)

    def load_model(self, model_path):
        """Load the trained model"""
        try:
            if os.path.exists(model_path):
                self.model = tf.keras.models.load_model(model_path)
                print(f"✅ Model loaded from {model_path}")
            else:
                # Try alternative paths
                alt_paths = [
                    "image_deepfake_best.h5",
                    "deepfake.h5",
                    "deepfake_best.h5",
                ]

                for alt_path in alt_paths:
                    if os.path.exists(alt_path):
                        self.model = tf.keras.models.load_model(alt_path)
                        print(f"✅ Model loaded from {alt_path}")
                        break
                else:
                    raise FileNotFoundError(
                        "❌ No trained model found! Please train a model first."
                    )

        except Exception as e:
            raise Exception(f"❌ Error loading model: {e}")

    def preprocess_image(self, image_path):
        """Preprocess a single image for prediction"""
        try:
            # Load image
            if isinstance(image_path, str):
                image = cv2.imread(image_path)
                if image is None:
                    raise ValueError(f"Could not load image: {image_path}")
            else:
                image = image_path  # Already loaded image

            # Convert BGR to RGB
            image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

            # Resize to model input size
            image = cv2.resize(image, (self.img_size, self.img_size))

            # Normalize to [0, 1]
            image = image.astype(np.float32) / 255.0

            # Add batch dimension
            image = np.expand_dims(image, axis=0)

            return image

        except Exception as e:
            raise Exception(f"❌ Error preprocessing image: {e}")

    def predict_single_image(self, image_path, verbose=True):
        """Predict if a single image is deepfake or real"""
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image_path)

            # Make prediction
            prediction = self.model.predict(processed_image, verbose=0)[0][0]

            # Interpret result
            is_fake = prediction > 0.5
            confidence = prediction if is_fake else (1 - prediction)
            label = "FAKE" if is_fake else "REAL"

            if verbose:
                print(
                    f"🔍 Image: {os.path.basename(image_path) if isinstance(image_path, str) else 'uploaded_image'}"
                )
                print(f"📊 Prediction: {label} (confidence: {confidence:.2%})")
                print(f"📈 Raw score: {prediction:.4f}")

            return {
                "prediction": label,
                "confidence": float(confidence),
                "raw_score": float(prediction),
                "is_fake": bool(is_fake),
            }

        except Exception as e:
            raise Exception(f"❌ Error predicting image: {e}")

    def predict_batch_images(self, image_paths):
        """Predict multiple images at once"""
        results = []

        print(f"🔄 Processing {len(image_paths)} images...")

        for i, image_path in enumerate(image_paths):
            try:
                result = self.predict_single_image(image_path, verbose=False)
                result["image_path"] = image_path
                results.append(result)

                if (i + 1) % 10 == 0:
                    print(f"✅ Processed {i + 1}/{len(image_paths)} images")

            except Exception as e:
                print(f"❌ Error processing {image_path}: {e}")
                results.append({"image_path": image_path, "error": str(e)})

        return results

    def predict_from_directory(self, directory_path):
        """Predict all images in a directory"""
        directory = Path(directory_path)

        if not directory.exists():
            raise FileNotFoundError(f"Directory not found: {directory_path}")

        # Get all image files
        image_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tiff"}
        image_paths = [
            str(p) for p in directory.rglob("*") if p.suffix.lower() in image_extensions
        ]

        if not image_paths:
            raise ValueError(f"No images found in {directory_path}")

        print(f"📁 Found {len(image_paths)} images in {directory_path}")

        return self.predict_batch_images(image_paths)


def main():
    """Command line interface for image prediction"""
    parser = argparse.ArgumentParser(description="Image Deepfake Detection")
    parser.add_argument("--image", "-i", type=str, help="Path to single image")
    parser.add_argument(
        "--directory", "-d", type=str, help="Path to directory of images"
    )
    parser.add_argument(
        "--model",
        "-m",
        type=str,
        default="image_deepfake_model.h5",
        help="Path to model file",
    )
    parser.add_argument(
        "--output", "-o", type=str, help="Output file for batch results"
    )

    args = parser.parse_args()

    if not args.image and not args.directory:
        print("❌ Please provide either --image or --directory")
        return

    try:
        # Initialize predictor
        predictor = ImageDeepfakePredictor(args.model)

        if args.image:
            # Single image prediction
            result = predictor.predict_single_image(args.image)

        elif args.directory:
            # Directory prediction
            results = predictor.predict_from_directory(args.directory)

            # Print summary
            fake_count = sum(1 for r in results if r.get("is_fake", False))
            real_count = len(results) - fake_count

            print(f"\n📊 SUMMARY:")
            print(f"Total images: {len(results)}")
            print(f"Real images: {real_count}")
            print(f"Fake images: {fake_count}")

            # Save results if requested
            if args.output:
                import json

                with open(args.output, "w") as f:
                    json.dump(results, f, indent=2)
                print(f"💾 Results saved to {args.output}")

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    main()
