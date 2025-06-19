# proof_uploader.py
import os
import requests
from dotenv import load_dotenv

load_dotenv()

PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_API_KEY = os.getenv("PINATA_SECRET_API_KEY")

def upload_to_ipfs(json_data: dict) -> str:
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    headers = {
        "Content-Type": "application/json",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY
    }

    response = requests.post(url, json=json_data, headers=headers)
    response.raise_for_status()

    ipfs_hash = response.json()["IpfsHash"]
    gateway_url = f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
    print(f"✅ Proof uploaded to IPFS!\n🔗 CID: {ipfs_hash}\n🌍 Gateway URL: {gateway_url}")
    return gateway_url
