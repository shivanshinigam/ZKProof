import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Pause, RotateCcw, Upload } from 'lucide-react';

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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioData(audioBlob);
        onCapture?.(audioBlob);
        
        // Stop all tracks to turn off microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const playAudio = () => {
    if (audioData && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioData);
      audioRef.current = new Audio(audioUrl);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
      
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resetRecording = () => {
    setAudioData(null);
    setRecordingTime(0);
    setAnalysisResults(null);
    setIsAnalyzing(false);
    
    if (audioRef.current) {
      audioRef.current = null;
    }
  };

  const analyzeVoice = async () => {
    if (!audioData) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = {
        confidence: 0.94,
        voicePrint: "VP_" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        features: {
          pitch: "142.3 Hz",
          tempo: "165 WPM",
          accent: "North American",
          emotion: "Neutral"
        },
        similarity: 94.2,
        verification: "VERIFIED"
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
      onAnalysisComplete?.(mockResults);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
      <div className="text-center space-y-6">
        {/* Recording Indicator */}
        <div className="relative">
          <div className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
            isRecording 
              ? 'border-red-500 bg-red-500/20 animate-pulse' 
              : audioData 
                ? 'border-emerald-500 bg-emerald-500/20' 
                : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
          }`}>
            {isRecording ? (
              <MicOff className="w-12 h-12 text-red-400" />
            ) : audioData ? (
              <Mic className="w-12 h-12 text-emerald-400" />
            ) : (
              <Mic className="w-12 h-12 text-slate-400" />
            )}
          </div>
          
          {isRecording && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              REC
            </div>
          )}
        </div>

        {/* Recording Time */}
        {(isRecording || audioData) && (
          <div className="text-2xl font-mono text-white">
            {formatTime(recordingTime)}
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isRecording && !audioData && (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>
          )}

          {isRecording && (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <MicOff className="w-5 h-5" />
              <span>Stop Recording</span>
            </button>
          )}

          {audioData && !isRecording && (
            <>
              <button
                onClick={isPlaying ? pauseAudio : playAudio}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              
              <button
                onClick={resetRecording}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              
              <button
                onClick={analyzeVoice}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5" />
                <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Voice'}</span>
              </button>
            </>
          )}
        </div>

        {/* Analysis Results */}
        {isAnalyzing && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-400">Analyzing voice patterns...</span>
            </div>
          </div>
        )}

        {analysisResults && (
          <div className="bg-slate-700/50 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold text-white mb-4">Analysis Results</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-slate-400 text-sm">Confidence</p>
                <p className="text-white font-semibold">{Math.round(analysisResults.confidence * 100)}%</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Voice ID</p>
                <p className="text-white font-mono text-sm">{analysisResults.voicePrint}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Pitch</p>
                <p className="text-white">{analysisResults.features.pitch}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Tempo</p>
                <p className="text-white">{analysisResults.features.tempo}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-600">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Verification Status</span>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  analysisResults.verification === 'VERIFIED' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {analysisResults.verification}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}