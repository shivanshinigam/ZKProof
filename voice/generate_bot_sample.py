from gtts import gTTS
import os
from pydub import AudioSegment

text = "Hello, I am a bot. Beep boop."
tts = gTTS(text)
tts.save("bot_temp.mp3")

# Convert mp3 to wav
sound = AudioSegment.from_mp3("bot_temp.mp3")
sound.export("voice_data/bot_test.wav", format="wav")

print("✅ Bot voice saved as voice_data/bot_test.wav")
