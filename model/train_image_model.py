#!/usr/bin/env python3
"""
Advanced Image Deepfake Detection Model Training
Optimized for static image classification with state-of-the-art techniques
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
import seaborn as sns

# Configuration
IMG_SIZE = 224  # Larger size for better feature extraction
BATCH_SIZE = 32
EPOCHS = 50
LEARNING_RATE = 0.001


class ImageDeepfakeTrainer:
    def __init__(self, data_path="imgdataset", img_size=IMG_SIZE):
        self.data_path = data_path
        self.img_size = img_size
        self.model = None
        self.history = None

    def load_and_preprocess_data(self):
        """Load and preprocess image data with advanced augmentation"""
        print("🔄 Loading and preprocessing image data...")

        X, y = [], []
        class_names = ["Real", "Fake"]

        for label, class_name in enumerate(class_names):
            class_path = os.path.join(self.data_path, class_name)

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

            for img_file in image_files:
                img_path = os.path.join(class_path, img_file)

                try:
                    # Load and preprocess image
                    image = cv2.imread(img_path)
                    if image is None:
                        continue

                    # Convert BGR to RGB
                    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

                    # Resize to target size
                    image = cv2.resize(image, (self.img_size, self.img_size))

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

        print(
            f"✅ Loaded {len(X)} images: {np.sum(y == 0)} real, {np.sum(y == 1)} fake"
        )
        return X, y

    def create_advanced_model(self):
        """Create an advanced CNN model for image deepfake detection"""
        print("🏗️  Building advanced deepfake detection model...")

        # Use EfficientNetB3 as base model for better performance
        base_model = tf.keras.applications.EfficientNetB3(
            input_shape=(self.img_size, self.img_size, 3),
            include_top=False,
            weights="imagenet",
        )

        # Freeze base model initially
        base_model.trainable = False

        # Add custom classification head
        model = tf.keras.Sequential(
            [
                base_model,
                tf.keras.layers.GlobalAveragePooling2D(),
                tf.keras.layers.BatchNormalization(),
                # First dense block
                tf.keras.layers.Dense(512, activation="relu"),
                tf.keras.layers.Dropout(0.5),
                tf.keras.layers.BatchNormalization(),
                # Second dense block
                tf.keras.layers.Dense(256, activation="relu"),
                tf.keras.layers.Dropout(0.4),
                tf.keras.layers.BatchNormalization(),
                # Third dense block
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
                tf.keras.metrics.AUC(name="auc"),
            ],
        )

        self.model = model
        return model

    def setup_data_generators(self, X_train, X_val, y_train, y_val):
        """Setup data generators with advanced augmentation"""

        # Advanced data augmentation for training
        train_datagen = ImageDataGenerator(
            rotation_range=30,
            width_shift_range=0.3,
            height_shift_range=0.3,
            shear_range=0.2,
            zoom_range=0.3,
            horizontal_flip=True,
            vertical_flip=False,
            brightness_range=[0.7, 1.3],
            channel_shift_range=0.2,
            fill_mode="nearest",
        )

        # No augmentation for validation
        val_datagen = ImageDataGenerator()

        train_generator = train_datagen.flow(
            X_train, y_train, batch_size=BATCH_SIZE, shuffle=True
        )

        val_generator = val_datagen.flow(
            X_val, y_val, batch_size=BATCH_SIZE, shuffle=False
        )

        return train_generator, val_generator

    def train_model(self, X, y):
        """Train the model with advanced techniques"""
        print("🚀 Starting model training...")

        # Split data
        X_train, X_val, y_train, y_val = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )

        print(f"📊 Training set: {len(X_train)}, Validation set: {len(X_val)}")

        # Setup data generators
        train_gen, val_gen = self.setup_data_generators(X_train, X_val, y_train, y_val)

        # Setup callbacks
        callbacks = [
            EarlyStopping(
                monitor="val_accuracy",
                patience=10,
                restore_best_weights=True,
                verbose=1,
            ),
            ReduceLROnPlateau(
                monitor="val_loss", factor=0.5, patience=5, min_lr=1e-7, verbose=1
            ),
            ModelCheckpoint(
                "image_deepfake_best.h5",
                monitor="val_accuracy",
                save_best_only=True,
                verbose=1,
            ),
        ]

        # Train model
        self.history = self.model.fit(
            train_gen,
            validation_data=val_gen,
            epochs=EPOCHS,
            callbacks=callbacks,
            verbose=1,
        )

        # Fine-tune with unfrozen layers
        print("🔧 Fine-tuning with unfrozen layers...")

        # Unfreeze top layers
        self.model.layers[0].trainable = True

        # Recompile with lower learning rate
        self.model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE / 10),
            loss="binary_crossentropy",
            metrics=["accuracy", "precision", "recall", "auc"],
        )

        # Continue training
        fine_tune_history = self.model.fit(
            train_gen,
            validation_data=val_gen,
            epochs=20,
            callbacks=callbacks,
            verbose=1,
        )

        return X_val, y_val

    def evaluate_model(self, X_val, y_val):
        """Comprehensive model evaluation"""
        print("📈 Evaluating model performance...")

        # Predictions
        y_pred_prob = self.model.predict(X_val)
        y_pred = (y_pred_prob > 0.5).astype(int).flatten()

        # Metrics
        print("\n" + "=" * 50)
        print("MODEL EVALUATION RESULTS")
        print("=" * 50)

        print(f"Final Validation Accuracy: {np.mean(y_pred == y_val):.4f}")
        print(
            f"Final Validation Loss: {self.model.evaluate(X_val, y_val, verbose=0)[0]:.4f}"
        )

        print("\nClassification Report:")
        print(classification_report(y_val, y_pred, target_names=["Real", "Fake"]))

        # Confusion Matrix
        cm = confusion_matrix(y_val, y_pred)
        print(f"\nConfusion Matrix:")
        print(f"True Negatives (Real): {cm[0,0]}")
        print(f"False Positives (Real as Fake): {cm[0,1]}")
        print(f"False Negatives (Fake as Real): {cm[1,0]}")
        print(f"True Positives (Fake): {cm[1,1]}")

    def save_model(self):
        """Save the trained model"""
        print("💾 Saving model...")

        self.model.save("image_deepfake_model.h5")
        print("✅ Model saved as 'image_deepfake_model.h5'")

        # Also save in SavedModel format for deployment
        self.model.save("image_deepfake_model_saved", save_format="tf")
        print("✅ Model saved as 'image_deepfake_model_saved' (TensorFlow SavedModel)")


def main():
    """Main training pipeline"""
    print("🎯 Image Deepfake Detection Model Training")
    print("=" * 60)

    # Initialize trainer
    trainer = ImageDeepfakeTrainer()

    # Load data
    X, y = trainer.load_and_preprocess_data()

    # Create model
    model = trainer.create_advanced_model()
    print(f"📋 Model Summary:")
    model.summary()

    # Train model
    X_val, y_val = trainer.train_model(X, y)

    # Evaluate model
    trainer.evaluate_model(X_val, y_val)

    # Save model
    trainer.save_model()

    print("\n🎉 Training completed successfully!")
    print("🔍 Use 'python model/predict_image.py' to test the model")


if __name__ == "__main__":
    main()
