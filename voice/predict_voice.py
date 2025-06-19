import joblib
import librosa
import numpy as np
import os

MODEL_PATH = "models/voice_model.joblib"

def extract_features(file_path):
    audio, sr = librosa.load(file_path, sr=16000)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    return np.mean(mfcc.T, axis=0)

def predict_voice_file(file_path, model=None):
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("❌ Voice model not found.")
        model = joblib.load(MODEL_PATH)

    features = extract_features(file_path).reshape(1, -1)
    return model.predict(features)[0]  # 0=Bot, 1=Human
    print(f"[DEBUG] Audio shape: {audio.shape}, Sample rate: {sr}")
    print(f"[DEBUG] Duration: {audio.shape[0] / sr:.2f} seconds")


# CLI optional
if __name__ == "__main__":
    file_path = input("🎤 Enter path to .wav voice file: ").strip()
    pred = predict_voice_file(file_path)
    print("🧑 Detected: Human" if pred == 1 else "🤖 Detected: Bot")
