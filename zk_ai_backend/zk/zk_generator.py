import json
import time
import hashlib

def generate_proof(voice_result: int, keystroke_result: int) -> dict:
    """
    Generates a ZK-style proof dictionary with integrity hash.
    """
    # ✅ Verification logic: Human if voice OR keystroke shows 1
    is_verified = voice_result == 1 or keystroke_result == 1

    # 📄 Construct proof object
    proof = {
        "voice_result": voice_result,
        "keystroke_result": keystroke_result,
        "verified": is_verified,
        "timestamp": int(time.time())
    }

    # 🔐 Add SHA-256 hash for ZK integrity
    proof_string = json.dumps(proof, sort_keys=True)
    proof_hash = hashlib.sha256(proof_string.encode()).hexdigest()
    proof["hash"] = proof_hash

    return proof
