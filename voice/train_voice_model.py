import os
import numpy as np
import librosa
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib 

DATA_DIR = "voice_data"
MODEL_PATH = "models/voice_model.joblib"

def extract_features(file_path):
    audio, sr = librosa.load(file_path, sr=16000)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    return np.mean(mfcc.T, axis=0)

def load_data():
    X = []
    y = []
    for root, dirs, files in os.walk(DATA_DIR):
        for file in files:
            if file.endswith(".wav"):
                file_path = os.path.join(root, file)
                # Use folder name (root) to determine label
                label = 1 if "human" in root.lower() else 0
                features = extract_features(file_path)
                X.append(features)
                y.append(label)
    return np.array(X), np.array(y)

def train():
    X, y = load_data()
    print(f"📂 Loaded {len(X)} voice samples")
    print(f"🧾 Label distribution: {np.unique(y, return_counts=True)}")

    if len(np.unique(y)) < 2:
        print("❌ Not enough label diversity to train (need both human and bot samples).")
        return

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("✅ Accuracy:", accuracy_score(y_test, y_pred))
    print(classification_report(y_test, y_pred))

    os.makedirs("models", exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"💾 Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train()
