# ============================================
# FARMGUARD AI - KAGGLE TRAINING SCRIPT
# Copy this entire cell into Kaggle and run!
# ============================================



import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import json
import os
import shutil

print("TensorFlow version:", tf.__version__)

# ============================================
# CONFIGURATION
# ============================================
IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 15  # Increase if you have time
LEARNING_RATE = 0.0001

# Path to PlantVillage dataset on Kaggle
# Make sure you've added the dataset: "emmarex/plantdisease"
DATASET_PATH = "/kaggle/input/plantdisease/PlantVillage"

# If using the other dataset format:
if not os.path.exists(DATASET_PATH):
    DATASET_PATH = "/kaggle/input/plantvillage-dataset/plantvillage dataset/color"
if not os.path.exists(DATASET_PATH):
    DATASET_PATH = "/kaggle/input/plant-disease/PlantVillage"
if not os.path.exists(DATASET_PATH):
    # Try to find it
    import glob
    possible = glob.glob("/kaggle/input/**/Apple*", recursive=True)
    if possible:
        DATASET_PATH = os.path.dirname(possible[0])
        print(f"Found dataset at: {DATASET_PATH}")

print(f"Using dataset path: {DATASET_PATH}")
print(f"Dataset exists: {os.path.exists(DATASET_PATH)}")

if os.path.exists(DATASET_PATH):
    classes = sorted(os.listdir(DATASET_PATH))
    print(f"Found {len(classes)} classes:")
    for i, c in enumerate(classes):
        print(f"  {i}: {c}")

# ============================================
# DATA GENERATORS
# ============================================
print("\n" + "="*50)
print("Setting up data generators...")
print("="*50)

# Data augmentation for training
train_datagen = ImageDataGenerator(
    rescale=1./255,  # IMPORTANT: Normalize to [0,1]
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    vertical_flip=True,
    fill_mode='nearest',
    validation_split=0.2  # 20% for validation
)

# Only rescaling for validation
val_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2
)

# Training generator
train_generator = train_datagen.flow_from_directory(
    DATASET_PATH,
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',
    shuffle=True
)

# Validation generator
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

# Save class names in order
class_names = list(train_generator.class_indices.keys())
print(f"\nClass names: {class_names[:5]}... (showing first 5)")

# ============================================
# BUILD MODEL
# ============================================
print("\n" + "="*50)
print("Building MobileNetV2 model...")
print("="*50)

# Load pre-trained MobileNetV2
base_model = MobileNetV2(
    weights='imagenet',
    include_top=False,
    input_shape=(IMG_SIZE, IMG_SIZE, 3)
)

# Freeze base model initially
base_model.trainable = False

# Add custom classification head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(512, activation='relu')(x)
x = Dropout(0.3)(x)
x = Dense(256, activation='relu')(x)
x = Dropout(0.2)(x)
predictions = Dense(NUM_CLASSES, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=predictions)

model.compile(
    optimizer=Adam(learning_rate=LEARNING_RATE),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

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
        patience=3,
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
# TRAIN PHASE 1: Train only the top layers
# ============================================
print("\n" + "="*50)
print("PHASE 1: Training top layers only...")
print("="*50)

history1 = model.fit(
    train_generator,
    epochs=5,
    validation_data=val_generator,
    callbacks=callbacks,
    verbose=1
)

# ============================================
# TRAIN PHASE 2: Fine-tune the model
# ============================================
print("\n" + "="*50)
print("PHASE 2: Fine-tuning entire model...")
print("="*50)

# Unfreeze all layers
base_model.trainable = True

# Recompile with lower learning rate
model.compile(
    optimizer=Adam(learning_rate=LEARNING_RATE / 10),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

history2 = model.fit(
    train_generator,
    epochs=EPOCHS,
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

loss, accuracy = model.evaluate(val_generator)
print(f"\nFinal Validation Accuracy: {accuracy*100:.2f}%")
print(f"Final Validation Loss: {loss:.4f}")

# ============================================
# SAVE MODEL
# ============================================
print("\n" + "="*50)
print("Saving model...")
print("="*50)

# Create output directory
os.makedirs('/kaggle/working/model_output', exist_ok=True)

# Save Keras model
model.save('/kaggle/working/model_output/plant_disease_model.keras')
print("Saved Keras model")

# Save as SavedModel format (required for tfjs conversion)
model.save('/kaggle/working/saved_model', save_format='tf')
print("Saved TensorFlow SavedModel")

# Save class names
with open('/kaggle/working/model_output/class_names.json', 'w') as f:
    json.dump(class_names, f, indent=2)
print("Saved class_names.json")

# ============================================
# CONVERT TO TENSORFLOW.JS
# ============================================
print("\n" + "="*50)
print("Converting to TensorFlow.js format...")
print("="*50)

import subprocess

# Convert to tfjs
result = subprocess.run([
    'tensorflowjs_converter',
    '--input_format=tf_saved_model',
    '--output_format=tfjs_graph_model',
    '--signature_name=serving_default',
    '--saved_model_tags=serve',
    '/kaggle/working/saved_model',
    '/kaggle/working/tfjs_model'
], capture_output=True, text=True)

print(result.stdout)
if result.stderr:
    print("Errors:", result.stderr)

# Copy class_names.json to tfjs folder
shutil.copy(
    '/kaggle/working/model_output/class_names.json',
    '/kaggle/working/tfjs_model/class_names.json'
)

# ============================================
# CREATE ZIP FOR DOWNLOAD
# ============================================
print("\n" + "="*50)
print("Creating downloadable ZIP...")
print("="*50)

shutil.make_archive(
    '/kaggle/working/farmguard_model',
    'zip',
    '/kaggle/working/tfjs_model'
)

print("\n" + "="*50)
print("DONE!")
print("="*50)
print(f"\nModel trained with {accuracy*100:.2f}% validation accuracy!")
print("\nDownload these files from the Output section:")
print("  1. farmguard_model.zip - Contains the TensorFlow.js model")
print("     Extract and copy contents to your 'public/model/' folder")
print("\nFiles in the ZIP:")
for f in os.listdir('/kaggle/working/tfjs_model'):
    size = os.path.getsize(f'/kaggle/working/tfjs_model/{f}')
    print(f"  - {f} ({size/1024:.1f} KB)")

print("\n" + "="*50)
print("INSTRUCTIONS:")
print("="*50)
print("""
1. Click 'Save Version' in Kaggle (top right)
2. Wait for it to finish running
3. Go to Output section and download 'farmguard_model.zip'
4. Extract the ZIP file
5. Copy ALL files to your project's 'public/model/' folder:
   - model.json
   - group1-shard*.bin (may be multiple files)
   - class_names.json
6. Restart your Next.js server
""")
