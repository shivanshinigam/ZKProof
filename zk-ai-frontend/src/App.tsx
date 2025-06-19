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

      const res = await axios.post<VerifyResponse>(
        'http://localhost:8000/verify',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const data = res.data;
      console.log('✅ Response from /verify:', data);

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

      const explanationData = res.data as ExplanationData;
      setExplanation(explanationData);
    } catch (err) {
      console.error('Failed to explain proof:', err);
      alert('Could not generate explanation.');
    } finally {
      setExplaining(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans">
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-indigo-600">
          🛡️ ZK-AI Identity Verifier
        </h1>

        <p className="text-gray-700 text-center">
          This tool verifies human identity using keystroke and voice
          biometrics with zero-knowledge proof.
        </p>

        <KeystrokeCapture onCapture={setKeystrokeBlob} />
        <VoiceCapture onCapture={setVoiceBlob} />

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full py-3 rounded-xl text-white font-semibold transition ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {loading ? 'Verifying...' : '🔍 Verify Identity'}
        </button>

        {(verified || cid) && (
          <div className="bg-green-100 border border-green-400 p-4 rounded-lg text-green-800 space-y-2">
            <p className="text-lg font-bold">
              {verified ? '✅ Identity Verified' : '⚠️ Verification Failed!'}
            </p>

            <p>
              🧾 View ZK Proof →{' '}
              <a
                href={cid || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-600"
              >
                IPFS Link
              </a>
            </p>

            {contract && (
              <p>
                🪪 Verified by Smart Contract:{' '}
                <code className="bg-white p-1 rounded">{contract}</code>
              </p>
            )}

            <button
              className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
              onClick={handleExplainProof}
              disabled={explaining}
            >
              {explaining ? 'Explaining...' : '🧠 Explain This'}
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
