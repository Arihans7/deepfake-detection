import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import os

print("=" * 60)
print("ADVANCED FINE-TUNING - DEEPFAKE DETECTION MODEL")
print("=" * 60)

# Check if model exists
if not os.path.exists("deepfake.h5"):
    print("Error: deepfake.h5 not found!")
    exit(1)

# Check if frames exist
if not os.path.exists("frames/real") or not os.path.exists("frames/fake"):
    print("Error: frames folders not found!")
    exit(1)

# Count frames
real_count = len(
    [f for f in os.listdir("frames/real") if f.endswith((".jpg", ".jpeg", ".png"))]
)
fake_count = len(
    [f for f in os.listdir("frames/fake") if f.endswith((".jpg", ".jpeg", ".png"))]
)

print(
    f"\nDataset: {real_count} real + {fake_count} fake = {real_count + fake_count} total frames\n"
)

# Load model
print("Loading model...")
model = load_model("deepfake.h5")
print("✓ Model loaded\n")

# Unfreeze some layers for better adaptation
print("Unfreezing last 15 layers for fine-tuning...")
for layer in model.layers[-15:]:
    layer.trainable = True

# Strong augmentation for training
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255,
    validation_split=0.2,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.15,
    zoom_range=0.15,
    horizontal_flip=True,
    brightness_range=[0.7, 1.3],
    fill_mode="nearest",
)

# No augmentation for validation
val_datagen = ImageDataGenerator(rescale=1.0 / 255, validation_split=0.2)

train_generator = train_datagen.flow_from_directory(
    "frames",
    target_size=(128, 128),
    batch_size=32,
    class_mode="binary",
    subset="training",
    shuffle=True,
)

val_generator = val_datagen.flow_from_directory(
    "frames",
    target_size=(128, 128),
    batch_size=32,
    class_mode="binary",
    subset="validation",
    shuffle=False,
)

print(f"Training: {train_generator.samples} samples")
print(f"Validation: {val_generator.samples} samples\n")

# Compile with metrics
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss="binary_crossentropy",
    metrics=["accuracy", tf.keras.metrics.Precision(), tf.keras.metrics.Recall()],
)

# Callbacks for optimal training
callbacks = [
    EarlyStopping(
        monitor="val_accuracy", patience=5, restore_best_weights=True, verbose=1
    ),
    ReduceLROnPlateau(
        monitor="val_loss", factor=0.5, patience=3, min_lr=1e-7, verbose=1
    ),
    ModelCheckpoint(
        "deepfake_best.h5", monitor="val_accuracy", save_best_only=True, verbose=1
    ),
]

# Train
print("Fine-tuning (max 20 epochs with early stopping)...\n")
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=20,
    callbacks=callbacks,
    verbose=1,
)

# Evaluate
print("\nFinal Evaluation:")
results = model.evaluate(val_generator, verbose=0)
print(f"Loss: {results[0]:.4f}")
print(f"Accuracy: {results[1]:.4f} ({results[1]*100:.2f}%)")
print(f"Precision: {results[2]:.4f}")
print(f"Recall: {results[3]:.4f}")

# Save
print("\nSaving models...")
model.save("deepfake.h5")
print("✓ deepfake.h5 (main model updated)")
model.save("deepfake_finetuned_backup.h5")
print("✓ deepfake_finetuned_backup.h5 (backup)")

print("\n" + "=" * 60)
print(f"FINE-TUNING COMPLETE - Accuracy: {results[1]*100:.2f}%")
print("=" * 60)
print("\nModel ready for use. Test with: python app.py")
