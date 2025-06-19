import json
import time
import hashlib
import os


def generate_proof(voice_result: int, keystroke_result: int) -> str:
    """
    Generates a ZK-style proof JSON with a hash, returns the file path.
    """
    # Step 1: Combine results into a proof dict
    is_verified = voice_result == 1 and keystroke_result == 1
    proof = {
        "voice_result": int(voice_result),
        "keystroke_result": int(keystroke_result),
        "verified": is_verified,
        "timestamp": int(time.time())
    }

    # Step 2: Hash the proof for tamper-evidence
    proof_string = json.dumps(proof, sort_keys=True)
    proof_hash = hashlib.sha256(proof_string.encode()).hexdigest()
    proof["hash"] = proof_hash

    # Step 3: Save to local JSON file
    filename = f"zk_proof_{int(time.time())}.json"
    filepath = os.path.join(os.getcwd(), filename)
    with open(filepath, "w") as f:
        json.dump(proof, f, indent=2)

    return filepath
