"""
Complete pipeline runner for deepfake detection system
"""

import os
import sys


def run_command(cmd, description):
    """Run a command and handle errors"""
    print(f"\n{'='*60}")
    print(f"{description}")
    print(f"{'='*60}")
    result = os.system(cmd)
    if result != 0:
        print(f"Error: {description} failed with code {result}")
        return False
    return True


def main():
    print("Deepfake Detection Pipeline")
    print("=" * 60)

    # Step 1: Extract faces
    if not run_command(
        "python model/extract_faces.py", "Step 1: Extracting faces from videos"
    ):
        sys.exit(1)

    # Check if faces were extracted
    if not os.path.exists("frames/real") or not os.path.exists("frames/fake"):
        print("Error: Face extraction failed. Check if dataset folders exist.")
        sys.exit(1)

    # Step 2: Train model
    if not run_command("python model/train.py", "Step 2: Training the model"):
        sys.exit(1)

    # Check if model was created
    if not os.path.exists("deepfake.h5"):
        print("Error: Model training failed.")
        sys.exit(1)

    print("\n" + "=" * 60)
    print("Pipeline completed successfully!")
    print("=" * 60)
    print("\nYou can now:")
    print("1. Run the API server: python app.py")
    print("2. Test predictions on videos")


if __name__ == "__main__":
    main()
