import joblib
import numpy as np
import pandas as pd
import os

MODEL_PATH = "models/keystroke_model.joblib"

def predict_keystroke_file(file_path, model=None):
    if model is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("❌ Keystroke model not found.")
        model = joblib.load(MODEL_PATH)

    df = pd.read_csv(file_path)

    # Sanity check: ensure the structure is right
    if not set(['key', 'event', 'time']).issubset(df.columns):
        raise ValueError("⚠️ CSV format invalid. Expected columns: key, event, time")

    key_downs = df[df['event'] == 'down'].reset_index(drop=True)
    key_ups = df[df['event'] == 'up'].reset_index(drop=True)

    if len(key_downs) != len(key_ups):
        raise ValueError("⚠️ Mismatched number of key down/up events.")

    if len(key_downs) != 10:
        raise ValueError(f"⚠️ Invalid keystroke sample length (got {len(key_downs)}, expected 10 key presses).")

    # Feature 1: Hold durations (key_ups.time - key_downs.time)
    hold_durations = key_ups['time'].values - key_downs['time'].values
    X = hold_durations.reshape(1, -1)

    return model.predict(X)[0]  # 0 = Bot, 1 = Human
