import numpy as np
import matplotlib.pyplot as plt

# Load feature weights
weights = np.load("models/keystroke_feature_weights.npy")[0]

# Plotting
plt.figure(figsize=(10, 4))
plt.bar(range(1, len(weights)+1), weights, color="skyblue")
plt.xlabel("Keystroke Interval Position (1–10)")
plt.ylabel("Weight (Importance)")
plt.title("🔍 Keystroke Feature Importance (Logistic Regression)")
plt.grid(True)
plt.tight_layout()
plt.savefig("models/feature_importance.png")
plt.show()
