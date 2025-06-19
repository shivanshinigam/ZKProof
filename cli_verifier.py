from voice.predict_voice import predict_voice_file
from voice.record_voice import record_voice
from keystroke.record_keystroke import record_keystroke_and_save
from keystroke.test_model import predict_keystroke_file
import time

def verify_identity():
    print("\n🛡️ Welcome to ZK-AI Identity Verifier")

    # Step 1: Record voice (real-time)
    print("\n🎤 Step 1: Voice Recording")
    voice_path = record_voice("test")
    time.sleep(1)

    # Step 2: Predict voice
    voice_result = predict_voice_file(voice_path)
    print(f"🔊 Voice Prediction: {'Human' if voice_result == 1 else 'Bot'}")

    # Step 3: Record keystroke (real-time)
    print("\n⌨️ Step 2: Keystroke Recording")
    keystroke_path = record_keystroke_and_save(label="1", filename="test")
    time.sleep(1)

    # Step 4: Predict keystroke
    keystroke_result = predict_keystroke_file(keystroke_path)
    print(f"⌨️ Keystroke Prediction: {'Human' if keystroke_result == 1 else 'Bot'}")

    # Step 5: Final Decision
    print("\n🔐 Final Decision:")
    if voice_result == 1 and keystroke_result == 1:
        print("✅ Access Granted: Verified Human")
    else:
        print("❌ Access Denied: Bot behavior detected")

if __name__ == "__main__":
    verify_identity()
