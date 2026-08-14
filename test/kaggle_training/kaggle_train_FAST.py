# ============================================================
# FARMGUARD AI - FAST 15-CLASS MODEL TRAINING
# Dataset: PlantVillage (Pepper, Potato, Tomato only)
# Estimated time: 10-15 minutes on GPU
# ============================================================

import os
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import shutil

print("=" * 60)
print("FARMGUARD AI - FAST 15-CLASS MODEL TRAINING")
print("=" * 60)

# ============================================================
# 1. CONFIGURATION
# ============================================================
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 8  # Fewer epochs for speed, still good accuracy

# Find the dataset
POSSIBLE_PATHS = [
    '/kaggle/input/plantdisease',
    '/kaggle/input/plantdisease/PlantVillage',
    '/kaggle/input/plantvillage/PlantVillage',
    '/kaggle/input/plant-village/PlantVillage', 
    '/kaggle/input/plantvillage-dataset/PlantVillage',
    '/kaggle/input/plantvillage-dataset/plantvillage dataset/PlantVillage',
    '/kaggle/input/plantvillage-dataset/plantvillage dataset/color',
    '/kaggle/input/tomato-potato-pepper-plant-disease/PlantVillage',
]

DATASET_DIR = None
for path in POSSIBLE_PATHS:
    if os.path.exists(path):
        DATASET_DIR = path
        break

if DATASET_DIR is None:
    print("\n❌ Dataset not found! Searching for any plant-related folders...")
    for root, dirs, files in os.walk('/kaggle/input'):
        for d in dirs:
            if 'plant' in d.lower() or 'tomato' in d.lower() or 'potato' in d.lower():
                potential = os.path.join(root, d)
                print(f"  Found: {potential}")
                if os.path.isdir(potential):
                    subdirs = os.listdir(potential)
                    if len(subdirs) > 5:
                        DATASET_DIR = potential
                        break
        if DATASET_DIR:
            break

if DATASET_DIR is None:
    print("\n⚠️ Please check available datasets:")
    os.system('ls -la /kaggle/input/')
    raise Exception("Dataset not found!")

print(f"\n✅ Found dataset at: {DATASET_DIR}")
print(f"📁 Classes found: {sorted(os.listdir(DATASET_DIR))}")

# ============================================================
# 2. DATA GENERATORS
# ============================================================
print("\n📊 Setting up data generators...")

# Use simple rescaling to [0,1] - this is what we'll use in the app
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2,
    validation_split=0.2
)

train_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',
    shuffle=True
)

val_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    shuffle=False
)

NUM_CLASSES = len(train_generator.class_indices)
CLASS_NAMES = list(train_generator.class_indices.keys())

print(f"\n✅ Found {NUM_CLASSES} classes:")
for i, name in enumerate(CLASS_NAMES):
    print(f"   {i}: {name}")

print(f"\n📈 Training samples: {train_generator.samples}")
print(f"📈 Validation samples: {val_generator.samples}")

# ============================================================
# 3. BUILD MODEL
# ============================================================
print("\n🔧 Building MobileNetV2 model...")

# Use MobileNetV2 with pretrained weights
base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

# Freeze base model initially
base_model.trainable = False

# Build the model
model = keras.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dropout(0.3),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(NUM_CLASSES, activation='softmax')
])

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# ============================================================
# 4. TRAIN - PHASE 1 (Fast initial training)
# ============================================================
print("\n" + "=" * 60)
print("🚀 PHASE 1: Training top layers (fast)")
print("=" * 60)

history1 = model.fit(
    train_generator,
    epochs=4,
    validation_data=val_generator,
    verbose=1
)

# ============================================================
# 5. FINE-TUNE (Unfreeze some layers)
# ============================================================
print("\n" + "=" * 60)
print("🔥 PHASE 2: Fine-tuning (last 30 layers)")
print("=" * 60)

# Unfreeze last 30 layers
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

history2 = model.fit(
    train_generator,
    epochs=4,
    validation_data=val_generator,
    verbose=1
)

# ============================================================
# 6. EVALUATE
# ============================================================
print("\n" + "=" * 60)
print("📊 EVALUATION")
print("=" * 60)

val_loss, val_acc = model.evaluate(val_generator, verbose=0)
print(f"\n✅ Final Validation Accuracy: {val_acc*100:.2f}%")
print(f"✅ Final Validation Loss: {val_loss:.4f}")

# ============================================================
# 7. SAVE FOR TENSORFLOW.JS
# ============================================================
print("\n" + "=" * 60)
print("💾 SAVING MODEL FOR TENSORFLOW.JS")
print("=" * 60)

# Save Keras model first
os.makedirs('output_model', exist_ok=True)
model.save('output_model/model.h5')
print("✅ Saved Keras model")

# Save class names
with open('output_model/class_names.json', 'w') as f:
    json.dump(CLASS_NAMES, f, indent=2)
print("✅ Saved class names")

# Convert to TensorFlow.js
print("\n📦 Converting to TensorFlow.js format...")
try:
    import tensorflowjs as tfjs
    tfjs.converters.save_keras_model(model, 'output_model/tfjs_model')
    print("✅ Converted to TensorFlow.js format")
except ImportError:
    print("⚠️ tensorflowjs not installed, installing...")
    os.system('pip install tensorflowjs')
    import tensorflowjs as tfjs
    tfjs.converters.save_keras_model(model, 'output_model/tfjs_model')
    print("✅ Converted to TensorFlow.js format")

# Create ZIP for download
print("\n📦 Creating downloadable ZIP...")
shutil.make_archive('farmguard_model_15class', 'zip', 'output_model/tfjs_model')
print("✅ Created farmguard_model_15class.zip")

# Also copy class names to tfjs folder
shutil.copy('output_model/class_names.json', 'output_model/tfjs_model/')

# ============================================================
# 8. GENERATE FRONTEND CODE
# ============================================================
print("\n" + "=" * 60)
print("📝 FRONTEND INTEGRATION CODE")
print("=" * 60)

print(f"""
// ============================================================
// DISEASE_CLASSES for FarmGuardScanner.js
// Copy this to replace the existing DISEASE_CLASSES array
// ============================================================

const DISEASE_CLASSES = [""")

for i, name in enumerate(CLASS_NAMES):
    # Parse class name
    parts = name.replace('___', '__').split('__')
    crop = parts[0].replace('_', ' ').title() if len(parts) > 0 else 'Unknown'
    disease = parts[1].replace('_', ' ').title() if len(parts) > 1 else 'Unknown'
    
    is_healthy = 'healthy' in name.lower()
    severity = 'none' if is_healthy else ('high' if 'blight' in name.lower() or 'virus' in name.lower() else 'medium')
    
    key = name.replace('___', '_').replace('__', '_').replace(' ', '')
    key = ''.join(word.capitalize() if i > 0 else word.lower() for i, word in enumerate(key.split('_')))
    
    color = 'text-neon-green' if is_healthy else ('text-alert-red' if severity == 'high' else 'text-yellow-400')
    bg = 'bg-neon-green/20' if is_healthy else ('bg-alert-red/20' if severity == 'high' else 'bg-yellow-400/20')
    border = 'border-neon-green' if is_healthy else ('border-alert-red' if severity == 'high' else 'border-yellow-400')
    
    display_name = f"{crop} - {disease}" if not is_healthy else f"{crop} - Healthy"
    
    print(f"  {{ id: {i}, key: '{key}', name: '{display_name}', crop: '{crop}', severity: '{severity}', color: '{color}', bgColor: '{bg}', borderColor: '{border}' }},")

print("""];

// ============================================================
// PREPROCESSING: Use this in runPredictionOnImage()
// ============================================================
// tensor = tensor.toFloat().div(255.0);  // NOT div(127.5).sub(1)
""")

print("\n" + "=" * 60)
print("🎉 TRAINING COMPLETE!")
print("=" * 60)
print(f"""
📥 DOWNLOAD INSTRUCTIONS:
1. Click 'Save Version' in Kaggle (top right)
2. Wait for it to complete
3. Go to Output tab
4. Download 'farmguard_model_15class.zip'

📁 THEN IN YOUR PROJECT:
1. Extract the ZIP
2. Copy all files to: public/model/
3. Replace existing model files
4. Update DISEASE_CLASSES in FarmGuardScanner.js with the code above
5. Change preprocessing to: tensor.div(255.0) instead of div(127.5).sub(1)

✅ Model uses [0,1] normalization (rescale=1./255)
✅ Expected accuracy: 90%+
""")

print(f"\n📊 Final Results:")
print(f"   Classes: {NUM_CLASSES}")
print(f"   Accuracy: {val_acc*100:.2f}%")
print(f"   Model: MobileNetV2 (fine-tuned)")
