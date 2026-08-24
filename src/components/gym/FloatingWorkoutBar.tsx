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
    <div className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto">
      <div 
        onClick={onExpand}
        className="bg-[#111111]/95 backdrop-blur-md border border-orange-500/40 rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.8)] flex items-center justify-between gap-3 cursor-pointer hover:border-orange-500 transition-all transform active:scale-[0.99]"
      >
        {/* Left: Flame / Rest timer */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
            isRestRunning 
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' 
              : 'bg-orange-500/20 border-orange-500/40 text-orange-400'
          }`}>
            {isRestRunning ? (
              <Timer size={18} className="animate-spin text-amber-400" />
            ) : (
              <Flame size={18} className={isWorkoutRunning ? 'animate-pulse text-orange-400' : ''} />
            )}
          </div>

          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                {isRestRunning ? `Descanso: ${Math.round(restSecondsLeft)}s` : 'En Vivo'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                • {formatTime(workoutSeconds)}
              </span>
            </div>
            <p className="text-xs font-semibold text-white truncate">
              {currentInfo.exerciseName} <span className="text-slate-400 font-mono font-normal">#{currentInfo.setNumber}</span>
            </p>
          </div>
        </div>

        {/* Right: Expand Button */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm">
            <span>Guiado</span>
            <ChevronUp size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
