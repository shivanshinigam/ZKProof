import os
import requests
from dotenv import load_dotenv

load_dotenv()

PINATA_API_KEY = os.getenv("PINATA_API_KEY")
PINATA_SECRET_API_KEY = os.getenv("PINATA_SECRET_API_KEY")

if not PINATA_API_KEY or not PINATA_SECRET_API_KEY:
    raise EnvironmentError("❌ Pinata API credentials not found in .env file.")

def upload_to_ipfs(json_data: dict) -> str:
    """
    Uploads the given JSON object to IPFS via Pinata.
    Returns the public gateway URL.
    """
    url = "https://api.pinata.cloud/pinning/pinJSONToIPFS"
    headers = {
        "Content-Type": "application/json",
        "pinata_api_key": PINATA_API_KEY,
        "pinata_secret_api_key": PINATA_SECRET_API_KEY
    }

    try:
        response = requests.post(url, json=json_data, headers=headers)
        response.raise_for_status()

        ipfs_hash = response.json().get("IpfsHash")
        if not ipfs_hash:
            raise ValueError("❌ IPFS upload succeeded but no hash returned.")

        gateway_url = f"https://gateway.pinata.cloud/ipfs/{ipfs_hash}"
        print(f"✅ Proof uploaded to IPFS!\n🔗 CID: {ipfs_hash}\n🌍 Gateway URL: {gateway_url}")
        return gateway_url

    except requests.exceptions.RequestException as e:
        print("❌ Failed to upload to IPFS:", str(e))
        raise RuntimeError("IPFS upload failed") from e
