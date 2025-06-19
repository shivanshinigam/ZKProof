import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, UploadCloud } from 'lucide-react';

interface VoiceCaptureProps {
  onCapture?: (audioData: Blob) => void;
  onAnalysisComplete?: (results: any) => void;
}

export default function VoiceCapture({ onCapture, onAnalysisComplete }: VoiceCaptureProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioData(blob);
        onCapture?.(blob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('🎙️ Microphone access error:', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const playAudio = () => {
    if (!audioData) return;
    const url = URL.createObjectURL(audioData);
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setIsPlaying(false);
    audio.play();
    setIsPlaying(true);
  };

  const pauseAudio = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const reset = () => {
    setAudioData(null);
    setRecordingTime(0);
    setIsAnalyzing(false);
    setAnalysisResults(null);
    setIsPlaying(false);
    audioRef.current = null;
  };

  const analyzeVoice = async () => {
    if (!audioData) return;
    setIsAnalyzing(true);

    // Simulate ZK-AI analysis
    setTimeout(() => {
      const result = {
        confidence: 0.92,
        voicePrint: 'ZK_' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        features: {
          pitch: '148.5 Hz',
          tempo: '150 WPM',
          accent: 'Neutral Indian',
          emotion: 'Focused'
        },
        similarity: 92.4,
        verification: 'VERIFIED'
      };
      setAnalysisResults(result);
      setIsAnalyzing(false);
      onAnalysisComplete?.(result);
    }, 2500);
  };

  return (
    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 shadow-xl space-y-6">
      <div className="flex flex-col items-center gap-4">
        {/* 🎙️ Recorder circle */}
        <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
          isRecording
            ? 'border-red-500 bg-red-500/20 animate-pulse'
            : audioData
              ? 'border-green-500 bg-green-500/20'
              : 'border-gray-500 bg-gray-700/30'
        }`}>
          {isRecording ? (
            <MicOff className="text-red-500 w-10 h-10" />
          ) : (
            <Mic className={`${audioData ? 'text-green-500' : 'text-gray-400'} w-10 h-10`} />
          )}
        </div>

        {/* ⏱️ Timer */}
        {(isRecording || audioData) && (
          <div className="text-lg font-mono text-white">{formatTime(recordingTime)}</div>
        )}
      </div>

      {/* 🎛 Controls */}
      <div className="flex flex-wrap justify-center gap-4">
        {!isRecording && !audioData && (
          <button
            onClick={startRecording}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            Start Recording
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            Stop Recording
          </button>
        )}

        {audioData && !isRecording && (
          <>
            <button
              onClick={isPlaying ? pauseAudio : playAudio}
              className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={reset}
              className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full transition"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={analyzeVoice}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-60 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
            >
              <UploadCloud className="w-5 h-5 inline mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Voice'}
            </button>
          </>
        )}
      </div>

      {/* 🧠 AI Results */}
      {isAnalyzing && (
        <div className="text-blue-400 bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg text-sm text-center animate-pulse">
          🔍 Analyzing your voice with ZK-AI...
        </div>
      )}

      {analysisResults && (
        <div className="bg-gray-900/60 rounded-xl p-5 text-white text-sm">
          <h3 className="font-semibold text-lg mb-4 text-emerald-400">🧠 Voice Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400">Confidence</p>
              <div className="font-bold text-lg">{Math.round(analysisResults.confidence * 100)}%</div>
            </div>
            <div>
              <p className="text-gray-400">Voice ID</p>
              <div className="font-mono">{analysisResults.voicePrint}</div>
            </div>
            <div>
              <p className="text-gray-400">Pitch</p>
              <div>{analysisResults.features.pitch}</div>
            </div>
            <div>
              <p className="text-gray-400">Tempo</p>
              <div>{analysisResults.features.tempo}</div>
            </div>
            <div>
              <p className="text-gray-400">Accent</p>
              <div>{analysisResults.features.accent}</div>
            </div>
            <div>
              <p className="text-gray-400">Emotion</p>
              <div>{analysisResults.features.emotion}</div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex justify-between items-center">
            <span className="text-gray-400">Verification</span>
            <span className={`px-3 py-1 rounded text-sm font-semibold ${
              analysisResults.verification === 'VERIFIED'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              {analysisResults.verification}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
