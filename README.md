# 🛡️ ZK-AI Identity Verifier

> **Proof you're human — without giving away your data.**  
Built with AI, Biometrics, ZK Proofs, IPFS, and Smart Contracts 🧠🔐🌐

---

## 📌 What is this?

A privacy-first human verification system that:

- Verifies you're human using **voice** and **keystroke** biometrics
- Uses **AI models** to classify input as "human" or "bot"
- Generates **Zero-Knowledge Proofs (ZKPs)** of the result
- Stores the proof on **IPFS** (decentralized storage)
- Anchors the CID on-chain via a **Solidity smart contract**
- Provides a **LangChain-based explanation** of the proof

### 🧪 Why?
Most human verification systems (CAPTCHAs, KYC) compromise your privacy.  
We flipped the script — using **ZKML** to verify *without revealing anything sensitive*.

---

## 🧰 Tech Stack

| Layer             | Tech Used                         |
|------------------|-----------------------------------|
| 👤 Biometrics     | Keystroke Dynamics, Voice Analysis |
| 🧠 AI Models       | Simple Random Forest (Human vs Bot) |
| 🔒 ZK Proofs       | `snarkjs`      |
| 📦 Decentralized Storage | IPFS via Pinata (returns CID)     |
| 🧾 Smart Contract | Solidity (Remix + Testnet)         |
| 🌐 Frontend       | React + Tailwind CSS               |
| 🤖 LLM Explainer  | LangChain + Hugging Face (Mistral) |

---

## 🚀 How it works (Step-by-Step)

1. **You speak or type**
2. App captures voice/keystroke data as blobs
3. Models analyze patterns and predict if human
4. If yes → Generate ZK Proof from prediction
5. Upload proof to **IPFS**, get a **CID**
6. CID is pushed to **blockchain** (smart contract)
7. Get an **IPFS link** + human-readable explanation via LangChain

---

## 🖼️ Demo Preview

| Task | Screenshot |
|------|------------|
| Voice + Keystroke Input | ✅ |
| Verification Result     | ✅ |
| IPFS Proof Link         | ✅ |
| Smart Contract CID      | ✅ |
| LangChain Explanation   | ✅ |

---

## 🧠 What is a ZK Proof?

> A **Zero-Knowledge Proof** allows you to prove something is true (e.g. “I am human”) without revealing why or how you know it.

🔐 Example:  
"I can prove I'm over 18 — without revealing my birthday."

In this project:  
"I can prove I’m human — without revealing my voice or typing pattern."

---

## 🌐 What is IPFS + CID?

- **IPFS**: InterPlanetary File System = decentralized, distributed file storage
- **CID**: Content Identifier = fingerprint hash of the uploaded file

Once the proof is uploaded, anyone with the CID can verify it, but **can’t reverse-engineer your data**.

---

## 🪙 What did we do in Remix?

- Wrote a Solidity smart contract to **store the CID**
- Deployed to a testnet (like Sepolia)
- Linked CID storage with the frontend
- ✅ Immutable + verifiable record on blockchain

---

## 🧪 Model Note

> The model was super simple — just to demo the pipeline.  
Only ~10-11 training samples each for human/bot using Random Forest!  
But it proves the concept works and can be scaled in the future.

---

## 📦 Local Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/ZK-AI-Identity-Verifier.git
cd ZK-AI-Identity-Verifier

# Backend
cd zk_ai_backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload

# Frontend
cd ../zk-ai-frontend
npm install
npm start
