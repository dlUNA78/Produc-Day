import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Timer, Play, Pause, RotateCcw, Plus, Minus, X, Volume2 } from 'lucide-react';

interface RestTimerProps {
  initialSeconds?: number;
  onClose?: () => void;
  isOpen: boolean;
}

export default function RestTimer({ initialSeconds = 90, onClose, isOpen }: RestTimerProps) {
  const [targetSeconds, setTargetSeconds] = useState(initialSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTargetSeconds(initialSeconds);
    setRemainingSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds(prev => prev - 1);
      }, 1000);
    } else if (remainingSeconds === 0 && isRunning) {
      setIsRunning(false);
      // Play web audio chime if supported
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.5);
      } catch (e) {
        // audio context suppressed or unsupported in sandboxed env
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const progressPercent = targetSeconds > 0 ? ((targetSeconds - remainingSeconds) / targetSeconds) * 100 : 0;

  const handleAdjust = (delta: number) => {
    setRemainingSeconds(prev => Math.max(0, prev + delta));
    setTargetSeconds(prev => Math.max(0, prev + delta));
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(targetSeconds);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="fixed bottom-24 right-4 sm:right-6 z-40 bg-[#0E0E0E]/95 border border-orange-500/40 rounded-2xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] backdrop-blur-md flex flex-col gap-2.5 w-72"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400">
            <Timer size={14} />
            <span>Descanso entre series</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-orange-500 h-full transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Display and Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleAdjust(-15)}
              className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <Minus size={12} />
            </button>
            <div className="text-xl font-bold font-mono text-white px-2">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <button
              type="button"
              onClick={() => handleAdjust(15)}
              className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleReset}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
              title="Reiniciar"
            >
              <RotateCcw size={13} />
            </button>
            <button
              type="button"
              onClick={() => setIsRunning(!isRunning)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold transition-all ${
                isRunning
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-orange-500 text-slate-950 hover:bg-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.4)]'
              }`}
            >
              {isRunning ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-1 pt-1 border-t border-slate-800/60">
          {[45, 60, 90, 120].map(s => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setTargetSeconds(s);
                setRemainingSeconds(s);
                setIsRunning(true);
              }}
              className="py-1 text-[10px] font-semibold bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-orange-300 rounded-lg transition-colors text-center"
            >
              {s}s
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
