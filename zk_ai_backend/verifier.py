# verifier.py ✅ FIXED VERSION
import os
import uuid
import ffmpeg
import pandas as pd
from voice.predict_voice import predict_voice_file
from keystroke.test_model import predict_keystroke_file
from .zk.zk_generator import generate_proof

def convert_webm_to_wav(input_path: str, output_path: str):
    (
        ffmpeg
        .input(input_path)
        .output(output_path, format='wav', acodec='pcm_s16le', ac=1, ar='16k')
        .run(overwrite_output=True)
    )

def run_verification_pipeline(voice_path: str = None, keystroke_path: str = None):
    voice_result = None
    keystroke_result = None

    # 🔊 Handle voice
    if voice_path:
        if voice_path.endswith(".webm"):
            wav_path = voice_path.replace(".webm", ".wav")
            convert_webm_to_wav(voice_path, wav_path)
            voice_result = predict_voice_file(wav_path)
        elif voice_path.endswith(".wav"):
            voice_result = predict_voice_file(voice_path)
        print(f"[🔊] Voice prediction: {voice_result} ({'Human' if voice_result == 1 else 'Bot'})")

    # ⌨️ Handle keystroke
    if keystroke_path:
        keystroke_result = predict_keystroke_file(keystroke_path)
        print(f"[⌨️] Keystroke prediction: {keystroke_result} ({'Human' if keystroke_result == 1 else 'Bot'})")

    # ✅ At least one must be human
    is_verified = bool((voice_result == 1) or (keystroke_result == 1))




    # 🧾 Generate ZK proof with 0/1 format
    zk_proof = generate_proof(
        voice_result=int(voice_result) if voice_result is not None else 0,
        keystroke_result=int(keystroke_result) if keystroke_result is not None else 0,
    )

    return is_verified, zk_proof
