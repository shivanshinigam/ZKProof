import json
import time
import hashlib
import os

def generate_proof(voice_result: int, keystroke_result: int) -> dict:
    """
    Generates a ZK-style proof dictionary (with hash) for direct use and upload.
    """
    # Step 1: Construct the proof
    is_verified = voice_result == 1 and keystroke_result == 1
    proof = {
        "voice_result": int(voice_result),
        "keystroke_result": int(keystroke_result),
        "verified": is_verified,
        "timestamp": int(time.time())
    }

    # Step 2: Generate a SHA-256 hash for proof integrity
    proof_string = json.dumps(proof, sort_keys=True)
    proof_hash = hashlib.sha256(proof_string.encode()).hexdigest()
    proof["hash"] = proof_hash

    return proof  # 👈 return the actual proof data (dict)
