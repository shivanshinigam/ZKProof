#verifier.py
import os
import uuid
import ffmpeg
import pandas as pd
from voice.predict_voice import predict_voice_file
from keystroke.test_model import predict_keystroke_file
from .zk.zk_generator import generate_proof




# ✅ Utility: Convert .webm → .wav
def convert_webm_to_wav(input_path: str, output_path: str):
    (
        ffmpeg
        .input(input_path)
        .output(output_path, format='wav', acodec='pcm_s16le', ac=1, ar='16k')
        .run(overwrite_output=True)
    )


# ✅ Core pipeline function
def run_verification_pipeline(voice_path: str = None, keystroke_path: str = None):
    voice_result = None
    keystroke_result = None

    # 🔊 Handle voice input
    if voice_path and voice_path.endswith(".webm"):
        wav_path = voice_path.replace(".webm", ".wav")
        convert_webm_to_wav(voice_path, wav_path)
        voice_result = predict_voice_file(wav_path)
        print(f"[🔊] Voice prediction: {voice_result}")
    elif voice_path and voice_path.endswith(".wav"):
        voice_result = predict_voice_file(voice_path)
        print(f"[🔊] Voice prediction: {voice_result}")

    # ⌨️ Handle keystroke input
    if keystroke_path:
        keystroke_result = predict_keystroke_file(keystroke_path)
        print(f"[⌨️] Keystroke prediction: {keystroke_result}")

    # 🛡️ Decide verification based on at least one positive
    is_verified = (voice_result == "human") or (keystroke_result == "human")

    # 🧾 Generate ZK Proof
    zk_proof = generate_proof(
    voice_result=1 if voice_result == "human" else 0,
    keystroke_result=1 if keystroke_result == "human" else 0
)


    return is_verified, zk_proof
