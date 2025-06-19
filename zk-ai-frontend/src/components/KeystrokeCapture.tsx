import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onCapture: (blob: Blob) => void;
}

const KeystrokeCapture: React.FC<Props> = ({ onCapture }) => {
  const [events, setEvents] = useState<string[]>([]);
  const [keystrokeCount, setKeystrokeCount] = useState<number>(0);
  const startTime = useRef<number | null>(null);
  const MAX_KEYS = 10;

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (startTime.current === null) {
      startTime.current = performance.now();
    }

    if (keystrokeCount >= 10) return; // Stop capturing after 10

    const elapsed = performance.now() - startTime.current;
    setEvents((prev) => [...prev, `${e.key},down,${elapsed.toFixed(2)}`]);
    setKeystrokeCount((count) => count + 1);
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (startTime.current === null || keystrokeCount > 10) return;

    const elapsed = performance.now() - startTime.current;
    setEvents((prev) => [...prev, `${e.key},up,${elapsed.toFixed(2)}`]);
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
  };
}, [keystrokeCount]);

  useEffect(() => {
    if (keystrokeCount === MAX_KEYS) {
      const csv = `key,event,time\n${events.join('\n')}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      onCapture(blob);
    }
  }, [keystrokeCount, events, onCapture]);

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-white/60 backdrop-blur shadow-xl border border-gray-200">
      <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
        ⌨️ Keystroke Capture
      </h2>

      <p className="text-sm text-gray-600">
        Start typing anywhere on the page. We’ll automatically stop after <strong>{MAX_KEYS}</strong> keystrokes.
      </p>

      <div className="h-36 overflow-y-auto p-3 rounded-md bg-gray-100 border text-xs font-mono shadow-inner">
        {events.length === 0 ? (
          <p className="text-gray-400 italic">Waiting for your keystrokes...</p>
        ) : (
          events.map((e, i) => <div key={i}>{e}</div>)
        )}
      </div>

      <div className="text-sm font-medium text-gray-700">
        🧮 Keystrokes Captured:{' '}
        <span className={keystrokeCount === MAX_KEYS ? 'text-green-600' : 'text-indigo-600'}>
          {keystrokeCount} / {MAX_KEYS}
        </span>
      </div>

      <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
        <div
          className="bg-indigo-500 h-full transition-all duration-500"
          style={{ width: `${(keystrokeCount / MAX_KEYS) * 100}%` }}
        />
      </div>

      {keystrokeCount > MAX_KEYS && (
        <p className="text-sm text-red-600 mt-2">
          ⚠️ You’ve typed too many keystrokes. Please refresh the page to try again.
        </p>
      )}
    </div>
  );
};

export default KeystrokeCapture;
