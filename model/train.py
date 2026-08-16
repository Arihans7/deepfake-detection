import tensorflow as tf
import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

IMG_SIZE = 128


def load_data(path):
    """Load face images from extracted frames"""
    X, y = [], []

    for label, folder in enumerate(["real", "fake"]):
        folder_path = os.path.join(path, folder)

        if not os.path.exists(folder_path):
            print(f"Warning: {folder_path} does not exist, skipping...")
            continue

        images = [
            f for f in os.listdir(folder_path) if f.endswith((".jpg", ".jpeg", ".png"))
        ]
        print(f"Loading {len(images)} images from {folder}...")

        for img in images:
            img_path = os.path.join(folder_path, img)
            image = cv2.imread(img_path)

            if image is not None:
                # Ensure correct size
                if image.shape[:2] != (IMG_SIZE, IMG_SIZE):
                    image = cv2.resize(image, (IMG_SIZE, IMG_SIZE))
                image = image / 255.0
                X.append(image)
                y.append(label)

    if len(X) == 0:
        raise ValueError("No images found! Please run extract_faces.py first.")

    return np.array(X, dtype=np.float32), np.array(y, dtype=np.float32)


if __name__ == "__main__":
    print("Loading data...")
    X, y = load_data("frames")
    print(f"Loaded {len(X)} images: {np.sum(y == 0)} real, {np.sum(y == 1)} fake")

    if len(X) < 10:
        raise ValueError("Not enough data to train! Need at least 10 images.")

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"Training set: {len(X_train)}, Validation set: {len(X_val)}")

    print("Building model...")
    base = tf.keras.applications.MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3), include_top=False, weights="imagenet"
    )

    # Freeze base initially
    base.trainable = False

    model = tf.keras.Sequential(
        [
            base,
            tf.keras.layers.GlobalAveragePooling2D(),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Dense(256, activation="relu"),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.Dense(128, activation="relu"),
            tf.keras.layers.Dropout(0.3),
            tf.keras.layers.Dense(1, activation="sigmoid"),
        ]
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss="binary_crossentropy",
        metrics=["accuracy"],
    )

    print("Training model...")

    # Add callbacks
    from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau

    callbacks = [
        EarlyStopping(
            monitor="val_accuracy", patience=7, restore_best_weights=True, verbose=1
        ),
        ReduceLROnPlateau(
            monitor="val_loss", factor=0.5, patience=3, min_lr=1e-7, verbose=1
        ),
    ]

    history = model.fit(
        X_train,
        y_train,
        validation_data=(X_val, y_val),
        epochs=30,
        batch_size=32,
        callbacks=callbacks,
        verbose=1,
    )

    print("Saving model...")
    model.save("deepfake.h5")
    print("Model saved as deepfake.h5")

    # Print final metrics
    val_loss, val_acc = model.evaluate(X_val, y_val, verbose=0)
    print(f"\nFinal validation accuracy: {val_acc:.4f}")
