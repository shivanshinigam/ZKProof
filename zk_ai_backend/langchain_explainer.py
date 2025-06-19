#langchain_explainer.py

import os
from dotenv import load_dotenv
from langchain_huggingface import HuggingFaceEndpoint
from langchain.prompts import PromptTemplate

load_dotenv()

# ✅ Set up the updated HuggingFaceEndpoint class correctly
llm = HuggingFaceEndpoint(
    repo_id="mistralai/Mistral-7B-Instruct-v0.3",
    huggingfacehub_api_token=os.environ["HUGGINGFACEHUB_API_TOKEN"],
    temperature=0.2,
    max_new_tokens=200,
)

# 🧠 Prompt
template = """
You're an expert in biometric AI systems and ZK proofs.

Here is a proof dictionary:
{proof}

Explain in simple words why the user was verified or not.
"""

prompt = PromptTemplate(template=template, input_variables=["proof"])

def explain_proof(zk_proof: dict) -> dict:
    full_prompt = prompt.format(proof=zk_proof)
    explanation = llm.invoke(full_prompt)
    return {
        "explanation": explanation,
        "from_model": "mistralai/Mistral-7B-Instruct-v0.3"
    }
