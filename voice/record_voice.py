import sounddevice as sd
import numpy as np
import scipy.io.wavfile as wav
import os
from gtts import gTTS
import tempfile
import time
from pydub import AudioSegment

SAMPLE_RATE = 16000  # Hz
DURATION = 5  # seconds
DATA_DIR = "voice_data"


def record_voice(label):
    os.makedirs(DATA_DIR, exist_ok=True)
    filename = os.path.join(DATA_DIR, f"{label}_{int(time.time())}.wav")

    if label.lower() == "bot":
        # Generate and save synthetic bot voice
        text = "Hello, I am a bot. Beep boop."
        tts = gTTS(text)
        temp_mp3 = os.path.join(DATA_DIR, "bot_temp.mp3")
        tts.save(temp_mp3)

        sound = AudioSegment.from_mp3(temp_mp3)
        sound.export(filename, format="wav")
        os.remove(temp_mp3)

        print(f"✅ Bot voice saved as {filename}")
    else:
        print(f"🎙️ Recording human voice for label: {label}")
        print("Start speaking...")
        recording = sd.rec(int(SAMPLE_RATE * DURATION), samplerate=SAMPLE_RATE, channels=1, dtype='int16')
        sd.wait()
        wav.write(filename, SAMPLE_RATE, recording)
        print(f"✅ Saved to {filename}")

    return filename

if __name__ == "__main__":
    label = input("Enter label (human/bot): ").strip().lower()
    record_voice(label)
