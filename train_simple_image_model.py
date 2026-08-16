#!/usr/bin/env python3
"""
Simple Image Deepfake Detection Model Training
No face detection dependencies required
"""

import tensorflow as tf
import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import matplotlib.pyplot as plt

# Configuration
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 30
LEARNING_RATE = 0.001


def load_image_data(data_path="imgdataset", img_size=IMG_SIZE):
    """Load and preprocess image data"""
    print("🔄 Loading image data...")

    X, y = [], []
    class_names = ["Real", "Fake"]

    for label, class_name in enumerate(class_names):
        class_path = os.path.join(data_path, class_name)

        if not os.path.exists(class_path):
            print(f"⚠️  Warning: {class_path} does not exist, skipping...")
            continue

        # Get all image files
        image_files = [
            f
            for f in os.listdir(class_path)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".tiff"))
        ]

        print(f"📁 Loading {len(image_files)} images from {class_name}...")

        for i, img_file in enumerate(image_files):
            if i % 1000 == 0:
                print(f"  Progress: {i}/{len(image_files)}")

            img_path = os.path.join(class_path, img_file)

            try:
                # Load and preprocess image
                image = cv2.imread(img_path)
                if image is None:
                    continue

                # Convert BGR to RGB
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

                # Resize to target size
                image = cv2.resize(image, (img_size, img_size))

                # Normalize to [0, 1]
                image = image.astype(np.float32) / 255.0

                X.append(image)
                y.append(label)

            except Exception as e:
                print(f"❌ Error loading {img_file}: {e}")
                continue

    if len(X) == 0:
        raise ValueError("❌ No images found! Please check your dataset path.")

    X = np.array(X, dtype=np.float32)
    y = np.array(y, dtype=np.float32)

    print(f"✅ Loaded {len(X)} images: {np.sum(y == 0)} real, {np.sum(y == 1)} fake")
    return X, y


def create_model(img_size=IMG_SIZE):
    """Create CNN model for image deepfake detection"""
    print("🏗️  Building deepfake detection model...")

    # Use EfficientNetB0 as base model (lighter than B3)
    base_model = tf.keras.applications.EfficientNetB0(
        input_shape=(img_size, img_size, 3), include_top=False, weights="imagenet"
    )

    # Freeze base model initially
    base_model.trainable = False

    # Add custom classification head
    model = tf.keras.Sequential(
        [
            base_model,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.BatchNormalization(),
            # Dense layers
            tf.keras.layers.Dense(256, activation="relu"),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dropout(0.3),
            # Output layer
            tf.keras.layers.Dense(1, activation="sigmoid", name="predictions"),
        ]
    )

    # Compile model
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss="binary_crossentropy",
        metrics=[
            "accuracy",
            tf.keras.metrics.Precision(name="precision"),
            tf.keras.metrics.Recall(name="recall"),
        ],
    )

    return model


def train_model(X, y, model):
    """Train the model"""
    print("🚀 Starting model training...")

    # Split data
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"📊 Training set: {len(X_train)}, Validation set: {len(X_val)}")

    # Data augmentation for training
    train_datagen = ImageDataGenerator(
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.15,
        zoom_range=0.15,
        horizontal_flip=True,
        brightness_range=[0.8, 1.2],
        fill_mode="nearest",
    )

    # No augmentation for validation
    val_datagen = ImageDataGenerator()

    train_generator = train_datagen.flow(
        X_train, y_train, batch_size=BATCH_SIZE, shuffle=True
    )

    val_generator = val_datagen.flow(X_val, y_val, batch_size=BATCH_SIZE, shuffle=False)

    # Setup callbacks
    callbacks = [
        EarlyStopping(
            monitor="val_accuracy", patience=7, restore_best_weights=True, verbose=1
        ),
        ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=3, min_lr=1e-7, verbose=1
        ),
        ModelCheckpoint(
            "image_deepfake_best.h5",
            monitor="val_accuracy",
            save_best_only=True,
            verbose=1,
        ),
    ]

    # Train model
    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=EPOCHS,
        callbacks=callbacks,
        verbose=1,
    )

    return model, X_val, y_val, history


def evaluate_model(model, X_val, y_val):
    """Evaluate model performance"""
    print("📈 Evaluating model performance...")

    # Predictions
    y_pred_prob = model.predict(X_val)
    y_pred = (y_pred_prob > 0.5).astype(int).flatten()

    # Metrics
    print("\n" + "=" * 50)
    print("MODEL EVALUATION RESULTS")
    print("=" * 50)

    accuracy = np.mean(y_pred == y_val)
    print(f"Final Validation Accuracy: {accuracy:.4f} ({accuracy*100:.2f}%)")

    print("\nClassification Report:")
    print(classification_report(y_val, y_pred, target_names=["Real", "Fake"]))

    # Confusion Matrix
    cm = confusion_matrix(y_val, y_pred)
    print(f"\nConfusion Matrix:")
    print(f"True Negatives (Real): {cm[0,0]}")
    print(f"False Positives (Real as Fake): {cm[0,1]}")
    print(f"False Negatives (Fake as Real): {cm[1,0]}")
    print(f"True Positives (Fake): {cm[1,1]}")


def main():
    """Main training pipeline"""
    print("🎯 Simple Image Deepfake Detection Model Training")
    print("=" * 60)

    # Check if dataset exists
    if not os.path.exists("imgdataset"):
        print("❌ Dataset directory 'imgdataset' not found!")
        print("Please ensure your dataset is organized as:")
        print("  imgdataset/")
        print("    ├── Real/")
        print("    └── Fake/")
        return

    try:
        # Load data
        X, y = load_image_data()

        # Create model
        model = create_model()
        print(f"\n📋 Model Summary:")
        model.summary()

        # Train model
        model, X_val, y_val, history = train_model(X, y, model)

        # Evaluate model
        evaluate_model(model, X_val, y_val)

        # Save model
        print("\n💾 Saving model...")
        model.save("image_deepfake_model.h5")
        print("✅ Model saved as 'image_deepfake_model.h5'")

        print("\n🎉 Training completed successfully!")
        print("🔍 Use 'python model/predict_image.py' to test the model")
        print("🌐 Use 'python image_app.py' to start the web interface")

    except Exception as e:
        print(f"❌ Training failed: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    main()
