import csv
import os
import random

TARGET_LENGTH = len("hello world")
NUM_SAMPLES = 3  # Make 3 fake bot CSVs

def generate_bot_timing(fake_id):
    os.makedirs("data", exist_ok=True)
    path = f"data/bot{fake_id}.csv"
    
    with open(path, "w", newline="") as f:
        writer = csv.writer(f)

        # Simulate near-perfect typing delay (e.g., 0.1s with slight noise)
        base_delay = 0.1
        for _ in range(TARGET_LENGTH - 1):
            fake_delay = round(random.uniform(base_delay - 0.005, base_delay + 0.005), 4)
            writer.writerow([fake_delay])
    
    print(f"🤖 Bot {fake_id} sample saved to {path}")

# Generate 3 fake bot samples
for i in range(1, NUM_SAMPLES + 1):
    generate_bot_timing(i)
