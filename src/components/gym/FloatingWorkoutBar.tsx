import React from 'react';
import { Play, Pause, Flame, Timer, ChevronUp, Check, Zap } from 'lucide-react';
import { WorkoutRoutine, Exercise, GymDayLog } from '../../types';

interface FloatingWorkoutBarProps {
  routine: WorkoutRoutine;
  workoutSeconds: number;
  isWorkoutRunning: boolean;
  onToggleWorkoutTimer: () => void;
  restSecondsLeft: number;
  isRestRunning: boolean;
  onExpand: () => void;
  dayLog?: GymDayLog;
}

export default function FloatingWorkoutBar({
  routine,
  workoutSeconds,
  isWorkoutRunning,
  onToggleWorkoutTimer,
  restSecondsLeft,
  isRestRunning,
  onExpand,
  dayLog,
}: FloatingWorkoutBarProps) {
  // Format MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // Find next active exercise and set
  let currentInfo = {
    exerciseName: routine.exercises[0]?.name || 'Entrenamiento',
    setNumber: 1,
    totalSets: routine.exercises[0]?.sets.length || 3,
  };

  for (const ex of routine.exercises) {
    const uncompletedSet = ex.sets.find(
      s => !(dayLog?.completedSets?.[`${ex.id}_${s.setNumber}`] || s.isCompleted)
    );
    if (uncompletedSet) {
      currentInfo = {
        exerciseName: ex.name,
        setNumber: uncompletedSet.setNumber,
        totalSets: ex.sets.length,
      };
      break;
    }
  }

  return (
    <div className="fixed bottom-24 left-4 right-4 z-40 mx-auto max-w-md">
      <button type="button" onClick={onExpand} className="flex w-full items-center justify-between gap-3 rounded-[22px] border border-[var(--accent-border)] bg-[color:var(--surface-glass)] p-3 text-left shadow-[var(--shadow-raised)] backdrop-blur-2xl transition-transform active:scale-[0.99]">
        <span className="flex min-w-0 items-center gap-3">
          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${isRestRunning ? 'border-[var(--warning-border)] bg-[var(--warning-soft)] text-[var(--warning)]' : 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]'}`}>
            {isRestRunning ? <Timer size={18} /> : <Flame size={18} />}
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--accent)]">
              {isRestRunning ? `Descanso · ${Math.round(restSecondsLeft)}s` : 'Sesión en curso'}
              <span className="font-mono font-medium text-[var(--text-faint)]">{formatTime(workoutSeconds)}</span>
            </span>
            <span className="mt-1 block truncate text-sm font-medium text-[var(--text)]">{currentInfo.exerciseName} <span className="text-[var(--text-faint)]">· Serie {currentInfo.setNumber}</span></span>
          </span>
        </span>
        <span className="flex h-10 shrink-0 items-center gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 text-xs font-semibold text-[var(--text)]">Abrir<ChevronUp size={14} /></span>
      </button>
    </div>
  );
}
