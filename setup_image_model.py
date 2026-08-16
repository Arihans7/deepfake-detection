#!/usr/bin/env python3
"""
Setup script for Image Deepfake Detection
Checks dependencies and prepares environment
"""

import os
import sys
import subprocess
import importlib.util


def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        return False
    print(f"✅ Python {version.major}.{version.minor}.{version.micro}")
    return True


def check_package(package_name, import_name=None):
    """Check if a package is installed"""
    if import_name is None:
        import_name = package_name

    try:
        spec = importlib.util.find_spec(import_name)
        if spec is not None:
            print(f"✅ {package_name}")
            return True
        else:
            print(f"❌ {package_name} - Not installed")
            return False
    except ImportError:
        print(f"❌ {package_name} - Import error")
        return False


def install_requirements():
    """Install requirements from requirements.txt"""
    print("\n🔄 Installing requirements...")
    try:
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"]
        )
        print("✅ Requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install requirements: {e}")
        return False


def check_dataset():
    """Check if dataset exists and is properly structured"""
    print("\n📁 Checking dataset structure...")

    dataset_path = "imgdataset"
    if not os.path.exists(dataset_path):
        print(f"❌ Dataset directory not found: {dataset_path}")
        print("Please create the following structure:")
        print("  imgdataset/")
        print("    ├── Real/")
        print("    └── Fake/")
        return False

    real_path = os.path.join(dataset_path, "Real")
    fake_path = os.path.join(dataset_path, "Fake")

    if not os.path.exists(real_path):
        print(f"❌ Real images directory not found: {real_path}")
        return False

    if not os.path.exists(fake_path):
        print(f"❌ Fake images directory not found: {fake_path}")
        return False

    # Count images
    real_images = len(
        [
            f
            for f in os.listdir(real_path)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".tiff"))
        ]
    )
    fake_images = len(
        [
            f
            for f in os.listdir(fake_path)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".tiff"))
        ]
    )

    print(f"✅ Dataset structure correct")
    print(f"  📊 Real images: {real_images}")
    print(f"  📊 Fake images: {fake_images}")
    print(f"  📊 Total images: {real_images + fake_images}")

    if real_images + fake_images < 100:
        print(
            "⚠️  Warning: Dataset is quite small. Consider adding more images for better performance."
        )

    return True


def create_directories():
    """Create necessary directories"""
    print("\n📁 Creating directories...")

    directories = ["uploads", "processed_images", "model/__pycache__"]

    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"✅ {directory}")


def main():
    """Main setup function"""
    print("🔧 Image Deepfake Detection Setup")
    print("=" * 50)

    # Check Python version
    print("\n🐍 Checking Python version...")
    if not check_python_version():
        return

    # Check core packages
    print("\n📦 Checking core packages...")
    required_packages = [
        ("tensorflow", "tensorflow"),
        ("opencv-python", "cv2"),
        ("numpy", "numpy"),
        ("scikit-learn", "sklearn"),
        ("flask", "flask"),
        ("pillow", "PIL"),
        ("matplotlib", "matplotlib"),
        ("seaborn", "seaborn"),
    ]

    missing_packages = []
    for package_name, import_name in required_packages:
        if not check_package(package_name, import_name):
            missing_packages.append(package_name)

    # Install missing packages
    if missing_packages:
        print(f"\n⚠️  Missing packages: {', '.join(missing_packages)}")
        response = input("Install missing packages? (y/n): ").lower().strip()

        if response == "y":
            if not install_requirements():
                print("❌ Setup failed due to package installation errors")
                return
        else:
            print("❌ Setup cancelled. Please install required packages manually.")
            return

    # Check optional packages
    print("\n📦 Checking optional packages...")
    optional_packages = [("mtcnn", "mtcnn"), ("dlib", "dlib")]

    for package_name, import_name in optional_packages:
        check_package(package_name, import_name)

    # Check dataset
    check_dataset()

    # Create directories
    create_directories()

    # Final status
    print("\n" + "=" * 50)
    print("🎉 SETUP COMPLETED")
    print("=" * 50)

    print("\n🚀 Quick Start:")
    print("  1. Full training pipeline:")
    print("     python train_image_pipeline.py --preprocess --train")
    print("\n  2. Just train with existing data:")
    print("     python train_image_pipeline.py --train")
    print("\n  3. Start web interface:")
    print("     python image_app.py")

    print("\n📚 Available Scripts:")
    print("  ├── train_image_pipeline.py - Complete training pipeline")
    print("  ├── model/train_image_model.py - Advanced model training")
    print("  ├── model/predict_image.py - Image prediction")
    print("  ├── model/image_preprocessing.py - Image preprocessing")
    print("  └── image_app.py - Web API server")


if __name__ == "__main__":
    main()
