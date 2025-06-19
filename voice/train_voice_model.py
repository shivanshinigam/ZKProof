# voice/train_voice_model.py
import os
import numpy as np
import librosa
from sklearn.ensemble import RandomForestClassifier
import joblib

DATASET_DIR = "voice_data"
MODEL_PATH = "models/voice_model.joblib"

def extract_features(file_path):
    audio, sr = librosa.load(file_path, sr=16000)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    return np.mean(mfcc.T, axis=0)

X = []
y = []

for label_dir, label_val in [("human", 1), ("bot", 0)]:
    folder = os.path.join(DATASET_DIR, label_dir)
    for filename in os.listdir(folder):
        if filename.endswith(".wav"):
            file_path = os.path.join(folder, filename)
            try:
                features = extract_features(file_path)
                X.append(features)
                y.append(label_val)
                print(f"✅ Processed: {file_path}")
            except Exception as e:
                print(f"❌ Failed: {file_path} - {e}")

# Train model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X, y)

# Save model
os.makedirs("models", exist_ok=True)
joblib.dump(clf, MODEL_PATH)
print(f"🎉 Model saved to {MODEL_PATH}")
