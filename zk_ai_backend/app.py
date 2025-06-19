from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import shutil
import os
import json
import uuid
import requests

from zk_ai_backend.verifier import run_verification_pipeline
from zk_ai_backend.proof_uploader import upload_to_ipfs
from zk_ai_backend.langchain_explainer import explain_proof

app = FastAPI()

# 🌐 Enable CORS so frontend can call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# 🔐 Endpoint: Identity verification
@app.post("/verify")
async def verify_user(
    voice: Optional[UploadFile] = File(None),
    keystroke: Optional[UploadFile] = File(None)
):
    voice_path = f"temp_voice_{uuid.uuid4().hex}.wav"
    keystroke_path = f"temp_keys_{uuid.uuid4().hex}.csv"

    # Save files
    if voice:
        with open(voice_path, "wb") as vfile:
            shutil.copyfileobj(voice.file, vfile)
    if keystroke:
        with open(keystroke_path, "wb") as kfile:
            shutil.copyfileobj(keystroke.file, kfile)

    # 🔍 Run verification
    is_verified, zk_proof = run_verification_pipeline(
        voice_path if voice else None,
        keystroke_path if keystroke else None
    )

    # 📤 Upload ZK proof to IPFS
    ipfs_url = upload_to_ipfs(zk_proof)
    zk_proof["ipfs_url"] = ipfs_url

    # 🧹 Cleanup
    if os.path.exists(voice_path):
        os.remove(voice_path)
    if os.path.exists(keystroke_path):
        os.remove(keystroke_path)

    # ✅ Return result
    return {
        "verified": is_verified,
        "proof": zk_proof,
        "contract": "0x7EF2e0048f5bAeDe046f6BF797943daF4ED8CB47"
    }

# 🧠 Endpoint: LangChain Explanation
@app.post("/explain-proof")
async def explain_proof_endpoint(payload: dict):
    ipfs_url = payload.get("ipfs_url")
    if not ipfs_url:
        return {"error": "Missing 'ipfs_url'"}

    try:
        # ⬇️ Download ZK proof from IPFS
        response = requests.get(ipfs_url)
        response.raise_for_status()
        zk_proof = response.json()
    except Exception as e:
        return {"error": f"Failed to fetch proof from IPFS: {str(e)}"}

    # 🧠 Generate explanation with LangChain
    explanation_text = explain_proof(zk_proof)

    # 📤 Upload explanation to IPFS
    explanation_obj = {"explanation": explanation_text}
    ipfs_explanation_url = upload_to_ipfs(explanation_obj)
    explanation_obj["ipfs_url"] = ipfs_explanation_url

    return explanation_obj
