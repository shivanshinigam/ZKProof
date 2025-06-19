import React, { useEffect, useRef, useState } from 'react';

interface Props {
  onCapture: (blob: Blob) => void;
}

const KeystrokeCapture: React.FC<Props> = ({ onCapture }) => {
  const [events, setEvents] = useState<string[]>([]);
  const [keystrokeCount, setKeystrokeCount] = useState<number>(0);
  const startTime = useRef<number | null>(null);

  // Capture key down and key up with timestamps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (startTime.current === null) {
        startTime.current = performance.now();
      }
      const elapsed = performance.now() - startTime.current;
      setEvents((prev) => [...prev, `${e.key},down,${elapsed.toFixed(2)}`]);
      setKeystrokeCount((count) => count + 1); // count key downs only
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (startTime.current === null) return;
      const elapsed = performance.now() - startTime.current;
      setEvents((prev) => [...prev, `${e.key},up,${elapsed.toFixed(2)}`]);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Automatically create CSV when 10 keystrokes are done
  useEffect(() => {
    if (keystrokeCount === 10) {
      const csv = `key,event,time\n${events.join('\n')}`;
      const blob = new Blob([csv], { type: 'text/csv' });
      onCapture(blob);
    }
  }, [keystrokeCount, events, onCapture]);

  return (
    <div className="space-y-2">
      <label className="font-semibold text-base">⌨️ Type something below...</label>

      <div className="p-3 border rounded bg-gray-50 h-32 overflow-y-auto text-sm">
        {events.map((e, i) => (
          <div key={i}>{e}</div>
        ))}
      </div>

      <div className="text-sm text-gray-700 font-medium">
        🧮 Keystrokes: <span className={keystrokeCount === 10 ? 'text-green-600' : 'text-red-500'}>
          {keystrokeCount} / 10
        </span>
      </div>

      {keystrokeCount > 10 && (
        <div className="text-sm text-red-500">⚠️ Please type only 10 characters. Refresh to try again.</div>
      )}
    </div>
  );
};

export default KeystrokeCapture;
