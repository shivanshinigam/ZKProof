import os
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib

def load_data(data_dir="data"):
    X = []
    y = []

    for file in os.listdir(data_dir):
        if file.endswith(".csv"):
            path = os.path.join(data_dir, file)
            df = pd.read_csv(path, header=None).squeeze()

            if len(df) == 10:  # Only use samples with exactly 10 intervals
                X.append(df.to_numpy())
                label = 1 if "human" in file else 0
                y.append(label)
            else:
                print(f"⚠️ Skipped {file} (length {len(df)})")

    return np.array(X), np.array(y)

def train():
    X, y = load_data()

    print(f"Loaded {len(X)} samples")

    model = LogisticRegression()
    model.fit(X, y)

    y_pred = model.predict(X)

    print("✅ Accuracy:", accuracy_score(y, y_pred))
    print(classification_report(y, y_pred))

    # Save model
    os.makedirs("models", exist_ok=True)
    joblib.dump(model, "models/keystroke_model.joblib")
    print("💾 Model saved to models/keystroke_model.joblib")

    # Save feature weights
    np.save("models/keystroke_feature_weights.npy", model.coef_)
    print("📊 Feature weights saved to models/keystroke_feature_weights.npy")

if __name__ == "__main__":
    train()
