#record_keystroke.py
import time
import csv
import os
import getpass

TARGET_SENTENCE = "hello world"
DATA_DIR = "data"

def record_keystroke_and_save(label="1", filename=None):
    print(f"🧠 Type the following exactly:\n➡️  {TARGET_SENTENCE}")
    print("Ready? Press Enter to start...")
    input()

    print("Start typing...")

    keystroke_timings = []
    prev_time = None

    typed = ""
    while typed != TARGET_SENTENCE:
        ch = getpass.getpass(prompt="Type next char: ")[0]  # one char at a time
        typed += ch

        now = time.time()
        if prev_time is not None:
            delta = now - prev_time
            keystroke_timings.append(delta)
        prev_time = now

    print("✅ Done typing!")

    os.makedirs(DATA_DIR, exist_ok=True)
    if not filename:
        filename = f"test_{int(time.time())}"
    path = os.path.join(DATA_DIR, f"{filename}.csv")

    with open(path, "w", newline="") as f:
        writer = csv.writer(f)
        for t in keystroke_timings:
            writer.writerow([t])

    print(f"💾 Saved timings to {path} (label = {label})")
    return path  # ✅ return full path


# If run directly
if __name__ == "__main__":
    label = input("Enter label (1=human, 0=bot): ")
    filename = input("Filename to save (without .csv): ")
    record_keystroke_and_save(label, filename)
