// App.tsx
import React, { useState } from 'react';
import KeystrokeCapture from './components/KeystrokeCapture';
import VoiceCapture from './components/VoiceCapture';
import axios from 'axios';

type VerifyResponse = {
  verified: boolean;
  proof: { ipfs_url: string };
  contract: string;
};

type ExplanationData = {
  explanation: string;
  ipfs_url: string;
  from_model?: string;
};

const App = () => {
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [keystrokeBlob, setKeystrokeBlob] = useState<Blob | null>(null);
  const [verified, setVerified] = useState(false);
  const [cid, setCID] = useState<string | null>(null);
  const [contract, setContract] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<ExplanationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [explaining, setExplaining] = useState(false);

  const handleVerify = async () => {
    if (!voiceBlob && !keystrokeBlob) {
      alert('Please provide keystroke or voice input first.');
      return;
    }

    const formData = new FormData();
    if (voiceBlob) formData.append('voice', new File([voiceBlob], 'voice.wav'));
    if (keystrokeBlob) formData.append('keystroke', new File([keystrokeBlob], 'keystroke.csv'));

    try {
      setLoading(true);
      setVerified(false);
      setCID(null);
      setContract(null);
      setExplanation(null);

      const res = await axios.post<VerifyResponse>('http://localhost:8000/verify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = res.data;
      setVerified(data.verified);
      setCID(data.proof.ipfs_url);
      setContract(data.contract);
    } catch (err) {
      console.error('Verification failed:', err);
      alert('Error during verification.');
    } finally {
      setLoading(false);
    }
  };

  const handleExplainProof = async () => {
    if (!cid) return;

    try {
      setExplaining(true);
      const res = await axios.post('http://localhost:8000/explain-proof', {
        ipfs_url: cid,
      });

      setExplanation(res.data as ExplanationData);
    } catch (err) {
      console.error('Failed to explain proof:', err);
      alert('Could not generate explanation.');
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#dbeafe] to-[#e9d5ff] py-10 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 space-y-8 border border-white/30">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 drop-shadow-sm">
          🛡️ ZK-AI Identity Verifier
        </h1>

        <p className="text-lg text-center text-gray-700">
          Verify if you're human using <strong>biometrics + ZK proofs</strong> — voice + keystroke.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <VoiceCapture onCapture={setVoiceBlob} />
          <KeystrokeCapture onCapture={setKeystrokeBlob} />
        </div>

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-semibold text-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 ${
            loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
          }`}
        >
          {loading ? '🔄 Verifying...' : '🔍 Verify Identity'}
        </button>

        {(verified || cid) && (
          <div
            className={`border-l-8 ${
              verified ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
            } p-6 rounded-2xl shadow-inner space-y-3 animate-fade-in`}
          >
            <p className="text-xl font-bold text-gray-800">
              {verified ? '✅ Identity Verified' : '⚠️ Verification Failed!'}
            </p>

            <p className="text-gray-600">
              🧾 Proof uploaded →{' '}
              <a
                href={cid || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600 hover:text-blue-800"
              >
                IPFS Gateway
              </a>
            </p>

            {contract && (
              <p className="text-sm text-gray-500">
                🪪 Smart Contract: <code className="bg-white rounded px-1">{contract}</code>
              </p>
            )}

            <button
              onClick={handleExplainProof}
              disabled={explaining}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition shadow"
            >
              {explaining ? '🔄 Explaining...' : '🧠 Explain This'}
            </button>

            {explanation && (
  <div className="mt-3 bg-white border border-purple-300 p-4 rounded-xl text-purple-800">
    <h3 className="font-bold mb-2">LangChain Explanation</h3>

    {/* ✅ Only render if explanation is string */}
    {typeof explanation.explanation === 'string' && (
      <p>{explanation.explanation}</p>
    )}

    {explanation.from_model && (
      <p className="text-sm text-gray-600 mt-1">
        🔍 Generated using:{' '}
        <code>{explanation.from_model}</code>
      </p>
    )}

    {explanation.ipfs_url && (
      <p className="mt-2 text-sm">
        🔗{' '}
        <a
          href={explanation.ipfs_url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-blue-600"
        >
          View on IPFS ↗
        </a>
      </p>
    )}
  </div>
)}

          </div>
        )}
      </div>
    </div>
  );
};

export default App;
