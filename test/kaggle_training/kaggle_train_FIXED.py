# ============================================
# FARMGUARD AI - KAGGLE TRAINING SCRIPT (FIXED)
# Copy this entire cell into Kaggle and run!
# Uses CORRECT preprocessing for MobileNetV2
# ============================================

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import numpy as np
import json
import os
import shutil

print("TensorFlow version:", tf.__version__)
print("GPU Available:", tf.config.list_physical_devices('GPU'))

# ============================================
# CONFIGURATION
# ============================================
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 20
LEARNING_RATE = 0.001

# Find dataset path
DATASET_PATH = None
possible_paths = [
    "/kaggle/input/plantdisease/PlantVillage",
    "/kaggle/input/plantvillage-dataset/plantvillage dataset/color",
    "/kaggle/input/plant-disease/PlantVillage",
    "/kaggle/input/new-plant-diseases-dataset/New Plant Diseases Dataset(Augmented)/train",
    "/kaggle/input/plant-village/Plant_leave_diseases_dataset_without_augmentation"
]

for path in possible_paths:
    if os.path.exists(path):
        DATASET_PATH = path
        break

if DATASET_PATH is None:
    import glob
    possible = glob.glob("/kaggle/input/**/Apple*", recursive=True)
    if possible:
        DATASET_PATH = os.path.dirname(possible[0])

print(f"Using dataset path: {DATASET_PATH}")
print(f"Dataset exists: {os.path.exists(DATASET_PATH)}")

if os.path.exists(DATASET_PATH):
    classes = sorted(os.listdir(DATASET_PATH))
    print(f"Found {len(classes)} classes")

# ============================================
# DATA GENERATORS WITH CORRECT PREPROCESSING
# ============================================
print("\n" + "="*50)
print("Setting up data generators with MobileNetV2 preprocessing...")
print("="*50)

# IMPORTANT: Use MobileNetV2's preprocessing function!
# This normalizes to [-1, 1] range which is what the pretrained weights expect

train_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,  # CORRECT: [-1, 1] range
    rotation_range=25,
    width_shift_range=0.15,
    height_shift_range=0.15,
    shear_range=0.15,
    zoom_range=0.15,
    horizontal_flip=True,
    fill_mode='nearest',
    validation_split=0.2
)

val_datagen = ImageDataGenerator(
    preprocessing_function=preprocess_input,  # CORRECT: [-1, 1] range
    validation_split=0.2
)

train_generator = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',
    shuffle=True
)

val_generator = val_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    shuffle=False
)

NUM_CLASSES = len(train_generator.class_indices)
print(f"\nNumber of classes: {NUM_CLASSES}")
print(f"Training samples: {train_generator.samples}")
print(f"Validation samples: {val_generator.samples}")

class_names = list(train_generator.class_indices.keys())

# ============================================
# BUILD MODEL
# ============================================
print("\n" + "="*50)
print("Building MobileNetV2 model...")
print("="*50)

base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

# Freeze base model
base_model.trainable = False

# Simple but effective head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dropout(0.2)(x)
predictions = Dense(NUM_CLASSES, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

model.compile(
    optimizer=Adam(learning_rate=LEARNING_RATE),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

print(f"Model has {model.count_params():,} parameters")

# ============================================
# CALLBACKS
# ============================================
callbacks = [
    EarlyStopping(
        monitor='val_accuracy',
        patience=5,
        restore_best_weights=True,
        verbose=1
    ),
    ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=2,
        min_lr=1e-7,
        verbose=1
    ),
    ModelCheckpoint(
        '/kaggle/working/best_model.keras',
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    )
]

# ============================================
# PHASE 1: Train top layers
# ============================================
print("\n" + "="*50)
print("PHASE 1: Training classification head...")
print("="*50)

history1 = model.fit(
    train_generator,
    epochs=8,
    validation_data=val_generator,
    callbacks=callbacks,
    verbose=1
)

# ============================================
# PHASE 2: Fine-tune last few layers
# ============================================
print("\n" + "="*50)
print("PHASE 2: Fine-tuning...")
print("="*50)

# Unfreeze last 30 layers
for layer in base_model.layers[-30:]:
    if not isinstance(layer, tf.keras.layers.BatchNormalization):
        layer.trainable = True

model.compile(
    optimizer=Adam(learning_rate=LEARNING_RATE / 10),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

history2 = model.fit(
    train_generator,
    epochs=EPOCHS - 8,
    validation_data=val_generator,
    callbacks=callbacks,
    verbose=1
)

# ============================================
# EVALUATE
# ============================================
print("\n" + "="*50)
print("Evaluating model...")
print("="*50)

val_loss, val_acc = model.evaluate(val_generator, verbose=1)
print(f"\nFinal Validation Accuracy: {val_acc*100:.2f}%")

# ============================================
# SAVE FOR TENSORFLOW.JS
# ============================================
print("\n" + "="*50)
print("Converting to TensorFlow.js format...")
print("="*50)

# Save Keras model
model.save('/kaggle/working/plant_disease_model.keras')

# Install tensorflowjs
import subprocess
subprocess.run(['pip', 'install', 'tensorflowjs', '-q'])

import tensorflowjs as tfjs

# Convert to tfjs
tfjs.converters.save_keras_model(model, '/kaggle/working/tfjs_model')

# Save class names
with open('/kaggle/working/tfjs_model/class_names.json', 'w') as f:
    json.dump(class_names, f, indent=2)

# Create preprocessing info
preprocessing_info = {
    "input_size": IMG_SIZE,
    "preprocessing": "mobilenet_v2",
    "normalization": "divide_127.5_subtract_1",
    "note": "Use: tensor.div(127.5).sub(1) for preprocessing"
}
with open('/kaggle/working/tfjs_model/preprocessing.json', 'w') as f:
    json.dump(preprocessing_info, f, indent=2)

# Create zip file
shutil.make_archive('/kaggle/working/farmguard_model', 'zip', '/kaggle/working/tfjs_model')

print("\n" + "="*50)
print("DONE!")
print("="*50)
print(f"\nFinal accuracy: {val_acc*100:.2f}%")
print("\nFiles created:")
print("  - /kaggle/working/farmguard_model.zip (download this!)")
print("\nAfter downloading:")
print("  1. Extract the ZIP")
print("  2. Copy all files to your public/model/ folder")
print("  3. Use this preprocessing in JavaScript:")
print("     tensor = tensor.toFloat().div(127.5).sub(1)")
print("="*50)
