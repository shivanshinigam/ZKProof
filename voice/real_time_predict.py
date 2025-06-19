import sounddevice as sd
import scipy.io.wavfile as wav
import librosa
import numpy as np
import joblib
import os
import tempfile

MODEL_PATH = "models/voice_model.joblib"
SAMPLE_RATE = 16000
DURATION = 5  # seconds

def record_temp_audio():
    print("🎙️ Start speaking...")
    recording = sd.rec(int(SAMPLE_RATE * DURATION), samplerate=SAMPLE_RATE, channels=1, dtype='int16')
    sd.wait()
    
    temp_path = tempfile.mktemp(suffix=".wav")
    wav.write(temp_path, SAMPLE_RATE, recording)
    print(f"✅ Audio recorded to temp file")
    return temp_path

def extract_features(file_path):
    audio, sr = librosa.load(file_path, sr=SAMPLE_RATE)
    mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13)
    return np.mean(mfcc.T, axis=0)

def predict_realtime():
    if not os.path.exists(MODEL_PATH):
        print("❌ Model not found. Please train it first.")
        return

    model = joblib.load(MODEL_PATH)
    audio_file = record_temp_audio()
    features = extract_features(audio_file).reshape(1, -1)
    prediction = model.predict(features)[0]

    os.remove(audio_file)

    if prediction == 1:
        print("🧑 Detected: Human")
    else:
        print("🤖 Detected: Bot")

if __name__ == "__main__":
    input("🎤 Press Enter to record 5s voice and predict...")
    predict_realtime()
