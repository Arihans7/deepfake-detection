#!/usr/bin/env python3
"""
Complete Image Deepfake Detection Training Pipeline
Handles preprocessing, training, and evaluation
"""

import os
import sys
import argparse
from pathlib import Path

# Add model directory to path
sys.path.append("model")

from model.image_preprocessing import ImagePreprocessor
from model.train_image_model import ImageDeepfakeTrainer


def main():
    """Main training pipeline"""
    parser = argparse.ArgumentParser(
        description="Image Deepfake Detection Training Pipeline"
    )
    parser.add_argument(
        "--data-dir",
        "-d",
        type=str,
        default="imgdataset",
        help="Path to image dataset directory",
    )
    parser.add_argument(
        "--preprocess", "-p", action="store_true", help="Run preprocessing step"
    )
    parser.add_argument(
        "--preprocess-output",
        type=str,
        default="processed_images",
        help="Output directory for preprocessed images",
    )
    parser.add_argument("--train", "-t", action="store_true", help="Run training step")
    parser.add_argument(
        "--img-size", "-s", type=int, default=224, help="Target image size for training"
    )
    parser.add_argument(
        "--epochs", "-e", type=int, default=50, help="Number of training epochs"
    )
    parser.add_argument(
        "--batch-size", "-b", type=int, default=32, help="Training batch size"
    )
    parser.add_argument(
        "--no-face-detection",
        action="store_true",
        help="Skip face detection in preprocessing",
    )
    parser.add_argument(
        "--no-enhancement",
        action="store_true",
        help="Skip image enhancement in preprocessing",
    )

    args = parser.parse_args()

    print("🎯 Image Deepfake Detection Training Pipeline")
    print("=" * 60)

    # Check if dataset exists
    if not os.path.exists(args.data_dir):
        print(f"❌ Dataset directory not found: {args.data_dir}")
        print("Please ensure your dataset is organized as:")
        print("  imgdataset/")
        print("    ├── Real/")
        print("    └── Fake/")
        return

    # Step 1: Preprocessing (optional)
    if args.preprocess:
        print("\n🔄 Step 1: Preprocessing Images")
        print("-" * 40)

        try:
            preprocessor = ImagePreprocessor(
                target_size=args.img_size, use_face_detection=not args.no_face_detection
            )

            preprocessor.preprocess_dataset(
                args.data_dir,
                args.preprocess_output,
                extract_faces=not args.no_face_detection,
                enhance=not args.no_enhancement,
            )

            print("✅ Preprocessing completed successfully!")

            # Use preprocessed data for training
            data_dir = args.preprocess_output

        except Exception as e:
            print(f"❌ Preprocessing failed: {e}")
            return
    else:
        data_dir = args.data_dir
        print("⏭️  Skipping preprocessing step")

    # Step 2: Training
    if args.train:
        print(f"\n🚀 Step 2: Training Model")
        print("-" * 40)

        try:
            # Initialize trainer
            trainer = ImageDeepfakeTrainer(data_path=data_dir, img_size=args.img_size)

            # Load and preprocess data
            X, y = trainer.load_and_preprocess_data()

            # Create model
            model = trainer.create_advanced_model()
            print(f"\n📋 Model Architecture:")
            model.summary()

            # Train model
            X_val, y_val = trainer.train_model(X, y)

            # Evaluate model
            trainer.evaluate_model(X_val, y_val)

            # Save model
            trainer.save_model()

            print("\n🎉 Training completed successfully!")

        except Exception as e:
            print(f"❌ Training failed: {e}")
            return
    else:
        print("⏭️  Skipping training step")

    # Final instructions
    print("\n" + "=" * 60)
    print("🎯 PIPELINE COMPLETED")
    print("=" * 60)

    if args.train:
        print("\n📁 Generated Files:")
        print("  ├── image_deepfake_model.h5 (main model)")
        print("  ├── image_deepfake_best.h5 (best checkpoint)")
        print("  └── image_deepfake_model_saved/ (deployment format)")

        print("\n🚀 Next Steps:")
        print(
            "  1. Test single image: python model/predict_image.py --image path/to/image.jpg"
        )
        print(
            "  2. Test directory: python model/predict_image.py --directory path/to/images/"
        )
        print("  3. Start web API: python image_app.py")
        print("  4. Access web interface: http://localhost:5001")

    if not args.preprocess and not args.train:
        print("\n💡 Usage Examples:")
        print("  Full pipeline: python train_image_pipeline.py --preprocess --train")
        print("  Just preprocessing: python train_image_pipeline.py --preprocess")
        print("  Just training: python train_image_pipeline.py --train")
        print(
            "  Custom settings: python train_image_pipeline.py --train --img-size 256 --epochs 30"
        )


if __name__ == "__main__":
    main()
