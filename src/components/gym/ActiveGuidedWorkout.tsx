import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Square, 
  X, 
  Check, 
  Plus, 
  Minus, 
  FastForward, 
  Dumbbell, 
  Flame, 
  Timer, 
  ChevronLeft, 
  ChevronRight, 
  ListOrdered, 
  Sparkles, 
  Zap, 
  RotateCcw,
  Minimize2,
  Maximize2,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { WorkoutRoutine, Exercise, ExerciseSet, GymDayLog, MuscleGroup } from '../../types';

interface ActiveGuidedWorkoutProps {
  isOpen: boolean;
  onClose: () => void; // minimize
  routine: WorkoutRoutine;
  dayLog?: GymDayLog;
  onToggleSet: (exerciseId: string, setNumber: number) => void;
  onUpdateSet: (exerciseId: string, setNumber: number, reps: string, weightKg: number) => void;
  onFinishWorkout: () => void;
  // Session timer
  workoutSeconds: number;
  isWorkoutRunning: boolean;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  onResumeWorkout: () => void;
  // Rest timer
  restSecondsLeft: number;
  restTargetSeconds: number;
  isRestRunning: boolean;
  onStartRest: (seconds?: number) => void;
  onAdjustRest: (delta: number) => void;
  onSkipRest: () => void;
}

const muscleColors: Record<MuscleGroup, string> = {
  Pecho: 'bg-red-950/40 text-red-400 border-red-800/40',
  Espalda: 'bg-indigo-950/40 text-indigo-400 border-indigo-800/40',
  Hombros: 'bg-amber-950/40 text-amber-400 border-amber-800/40',
  Bíceps: 'bg-purple-950/40 text-purple-400 border-purple-800/40',
  Tríceps: 'bg-rose-950/40 text-rose-400 border-rose-800/40',
  Cuádriceps: 'bg-orange-950/40 text-orange-400 border-orange-800/40',
  Isquios: 'bg-yellow-950/40 text-yellow-400 border-yellow-800/40',
  Glúteos: 'bg-pink-950/40 text-pink-400 border-pink-800/40',
  Gemelos: 'bg-teal-950/40 text-teal-400 border-teal-800/40',
  'Core / Abdomen': 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40',
  'Cardio / Movilidad': 'bg-cyan-950/40 text-cyan-400 border-cyan-800/40',
};

export default function ActiveGuidedWorkout({
  isOpen,
  onClose,
  routine,
  dayLog,
  onToggleSet,
  onUpdateSet,
  onFinishWorkout,
  workoutSeconds,
  isWorkoutRunning,
  onStartWorkout,
  onPauseWorkout,
  onResumeWorkout,
  restSecondsLeft,
  restTargetSeconds,
  isRestRunning,
  onStartRest,
  onAdjustRest,
  onSkipRest,
}: ActiveGuidedWorkoutProps) {
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [showOverviewDrawer, setShowOverviewDrawer] = useState(false);

  // Keep index within bounds
  const safeExIndex = Math.min(Math.max(0, currentExIndex), Math.max(0, routine.exercises.length - 1));
  const currentExercise = routine.exercises[safeExIndex];

  // Auto focus to the first uncompleted exercise on mount or routine change
  useEffect(() => {
    if (isOpen && routine) {
      for (let i = 0; i < routine.exercises.length; i++) {
        const ex = routine.exercises[i];
        const hasUncompletedSet = ex.sets.some(
          s => !(dayLog?.completedSets?.[`${ex.id}_${s.setNumber}`] || s.isCompleted)
        );
        if (hasUncompletedSet) {
          setCurrentExIndex(i);
          break;
        }
      }
    }
  }, [isOpen, routine.id]);

  if (!isOpen || !currentExercise) return null;

  // Format Session Time
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // Find first uncompleted set in current exercise
  const currentSet = currentExercise.sets.find(
    s => !(dayLog?.completedSets?.[`${currentExercise.id}_${s.setNumber}`] || s.isCompleted)
  ) || currentExercise.sets[currentExercise.sets.length - 1];

  // Total and completed calculations across entire routine
  let totalSetsCount = 0;
  let completedSetsCount = 0;
  routine.exercises.forEach(ex => {
    ex.sets.forEach(s => {
      totalSetsCount++;
      if (dayLog?.completedSets?.[`${ex.id}_${s.setNumber}`] || s.isCompleted) {
        completedSetsCount++;
      }
    });
  });

  const isAllRoutineCompleted = totalSetsCount > 0 && completedSetsCount >= totalSetsCount;
  const progressPercent = totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

  // Next up set calculation
  let nextUpText = '';
  if (currentSet) {
    if (currentSet.setNumber < currentExercise.sets.length) {
      nextUpText = `Serie #${currentSet.setNumber + 1} de ${currentExercise.sets.length} (${currentExercise.name})`;
    } else if (safeExIndex < routine.exercises.length - 1) {
      const nextEx = routine.exercises[safeExIndex + 1];
      nextUpText = `Siguiente: ${nextEx.name} (Serie #1)`;
    } else {
      nextUpText = '¡Última serie de la rutina!';
    }
  }

  // Weight & Reps quick adjustments
  const handleWeightAdjust = (delta: number) => {
    if (!currentSet) return;
    const currentWeight = currentSet.weightKg || 0;
    const nextWeight = Math.max(0, Math.round((currentWeight + delta) * 10) / 10);
    onUpdateSet(currentExercise.id, currentSet.setNumber, String(currentSet.reps), nextWeight);
  };

  const handleRepsAdjust = (delta: number) => {
    if (!currentSet) return;
    const currentRepsNum = parseInt(String(currentSet.reps)) || 10;
    const nextReps = Math.max(1, currentRepsNum + delta);
    onUpdateSet(currentExercise.id, currentSet.setNumber, String(nextReps), currentSet.weightKg || 0);
  };

  // Action: Complete current set
  const handleCompleteCurrentSet = () => {
    if (!currentSet) return;
    onToggleSet(currentExercise.id, currentSet.setNumber);

    // If there is a next set in this exercise or next exercise, prep next index
    if (currentSet.setNumber >= currentExercise.sets.length && safeExIndex < routine.exercises.length - 1) {
      // Advance to next exercise when rest finishes or right now
      setTimeout(() => {
        setCurrentExIndex(prev => Math.min(routine.exercises.length - 1, prev + 1));
      }, 300);
    }
  };

  const restMinutes = Math.floor(restSecondsLeft / 60);
  const restSecs = restSecondsLeft % 60;
  const restProgress = restTargetSeconds > 0 ? ((restTargetSeconds - restSecondsLeft) / restTargetSeconds) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#070707] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header Bar */}
      <header className="pt-10 pb-3 px-5 border-b border-slate-800/80 bg-[#0B0B0B]/90 backdrop-blur-md flex items-center justify-between z-20">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl transition-colors"
          title="Minimizar a barra flotante"
        >
          <Minimize2 size={14} />
          <span className="font-semibold">Minimizar</span>
        </button>

        {/* Center Live Stopwatch */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold ${
            isWorkoutRunning 
              ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' 
              : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <Flame size={14} className={isWorkoutRunning ? 'animate-pulse text-orange-400' : 'text-slate-500'} />
            <span>{formatTime(workoutSeconds)}</span>
          </div>

          <button
            type="button"
            onClick={isWorkoutRunning ? onPauseWorkout : onResumeWorkout}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            {isWorkoutRunning ? <Pause size={13} /> : <Play size={13} fill="currentColor" />}
          </button>
        </div>

        {/* Finish / Overview buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowOverviewDrawer(!showOverviewDrawer)}
            className={`p-2 rounded-xl border transition-colors ${
              showOverviewDrawer
                ? 'bg-orange-500 text-slate-950 border-orange-500'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Ver lista de ejercicios"
          >
            <ListOrdered size={16} />
          </button>
          
          <button
            type="button"
            onClick={onFinishWorkout}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
          >
            <Square size={11} fill="currentColor" className="text-orange-400" />
            <span>Terminar</span>
          </button>
        </div>
      </header>

      {/* Routine Overall Progress Bar */}
      <div className="w-full bg-slate-950 h-1">
        <div 
          className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300 shadow-[0_0_8px_rgba(249,115,22,0.8)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Focus Area (Step by Step) */}
      <main className="flex-1 flex flex-col justify-between p-5 max-w-md w-full mx-auto overflow-y-auto scrollbar-hide relative">
        {/* REST COUNTDOWN OVERLAY / BANNER IF RESTING */}
        <AnimatePresence>
          {isRestRunning && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/50 rounded-3xl p-5 mb-4 shadow-[0_0_40px_rgba(245,158,11,0.2)] text-center flex flex-col items-center justify-between"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Timer size={14} className="animate-spin text-amber-400" />
                  Descanso Entre Series
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {Math.round(restSecondsLeft)}s restantes
                </span>
              </div>

              {/* Huge Rest Counter */}
              <div className="my-2">
                <span className="text-5xl font-black font-mono text-amber-300 tracking-tight drop-shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                  {String(restMinutes).padStart(2, '0')}:{String(restSecs).padStart(2, '0')}
                </span>
              </div>

              {/* Rest Progress Bar */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-amber-500/30 my-2">
                <div 
                  className="bg-amber-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${restProgress}%` }}
                />
              </div>

              {/* Quick Rest Adjust Buttons */}
              <div className="flex items-center justify-between w-full mt-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onAdjustRest(-15)}
                    className="px-2.5 py-1.5 text-xs font-semibold font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700"
                  >
                    -15s
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdjustRest(30)}
                    className="px-2.5 py-1.5 text-xs font-semibold font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700"
                  >
                    +30s
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onSkipRest}
                  className="px-4 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-[0_2px_10px_rgba(245,158,11,0.3)] flex items-center gap-1 transition-transform active:scale-95"
                >
                  <FastForward size={13} />
                  <span>Saltar Descanso</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Exercise Details Card */}
        <div className="flex flex-col gap-4">
          {/* Exercise Index & Muscle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 rounded-lg">
                Ejercicio {safeExIndex + 1} de {routine.exercises.length}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                muscleColors[currentExercise.muscleGroup] || 'bg-slate-800 text-slate-400'
              }`}>
                {currentExercise.muscleGroup}
              </span>
            </div>

            {/* Exercise Nav Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safeExIndex === 0}
                onClick={() => setCurrentExIndex(prev => Math.max(0, prev - 1))}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-30 flex items-center justify-center text-slate-300 hover:text-white"
                title="Ejercicio anterior"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                disabled={safeExIndex === routine.exercises.length - 1}
                onClick={() => setCurrentExIndex(prev => Math.min(routine.exercises.length - 1, prev + 1))}
                className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-30 flex items-center justify-center text-slate-300 hover:text-white"
                title="Siguiente ejercicio"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Exercise Big Name */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {currentExercise.name}
            </h2>
            {currentExercise.notes && (
              <p className="text-xs text-slate-400 bg-slate-900/60 border border-slate-800/80 rounded-xl px-3 py-2 mt-2 leading-relaxed">
                💡 {currentExercise.notes}
              </p>
            )}
          </div>

          {/* Series Pills Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide">
            {currentExercise.sets.map(s => {
              const isSetDone = dayLog?.completedSets?.[`${currentExercise.id}_${s.setNumber}`] || s.isCompleted;
              const isCurrent = currentSet?.setNumber === s.setNumber;

              return (
                <button
                  key={s.id || s.setNumber}
                  type="button"
                  onClick={() => onToggleSet(currentExercise.id, s.setNumber)}
                  className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold font-mono transition-all flex flex-col items-center gap-0.5 border ${
                    isSetDone
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                      : isCurrent
                        ? 'bg-orange-500 border-orange-400 text-slate-950 shadow-[0_0_12px_rgba(249,115,22,0.4)] ring-2 ring-orange-400/40'
                        : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Serie #{s.setNumber}</span>
                  <span className="text-[10px] opacity-80">
                    {isSetDone ? '✓ Hecho' : `${s.reps} reps`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Large Target Control Box for Active Set */}
          {currentSet && (
            <div className="bg-gradient-to-br from-slate-900/90 via-[#131313] to-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Objetivo Serie #{currentSet.setNumber}
                </span>
                <span className="text-xs text-orange-400 font-medium">
                  Descanso: {currentExercise.restSeconds || 90}s
                </span>
              </div>

              {/* Controls Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* PESO CONTROL */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col items-center text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Peso
                  </span>
                  
                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-3xl font-black font-mono text-white tracking-tight">
                      {currentSet.weightKg || 0}
                    </span>
                    <span className="text-sm font-bold text-slate-400">kg</span>
                  </div>

                  {/* One-Tap Adjust Buttons */}
                  <div className="flex items-center gap-1.5 mt-2 w-full justify-center">
                    <button
                      type="button"
                      onClick={() => handleWeightAdjust(-2.5)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-slate-300 font-mono text-xs font-bold rounded-lg border border-slate-800 transition-transform active:scale-95"
                    >
                      -2.5
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWeightAdjust(2.5)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-orange-400 font-mono text-xs font-bold rounded-lg border border-slate-800 transition-transform active:scale-95"
                    >
                      +2.5
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWeightAdjust(5)}
                      className="px-2 py-1 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-orange-400 font-mono text-xs font-bold rounded-lg border border-slate-800 transition-transform active:scale-95"
                    >
                      +5
                    </button>
                  </div>
                </div>

                {/* REPETICIONES CONTROL */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 flex flex-col items-center text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                    Repeticiones
                  </span>

                  <div className="flex items-baseline gap-1 my-1">
                    <span className="text-3xl font-black font-mono text-white tracking-tight">
                      {currentSet.reps}
                    </span>
                    <span className="text-sm font-bold text-slate-400">reps</span>
                  </div>

                  {/* One-Tap Adjust Buttons */}
                  <div className="flex items-center gap-2 mt-2 w-full justify-center">
                    <button
                      type="button"
                      onClick={() => handleRepsAdjust(-1)}
                      className="w-8 h-7 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-slate-300 font-mono text-xs font-bold rounded-lg border border-slate-800 flex items-center justify-center transition-transform active:scale-95"
                    >
                      <Minus size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRepsAdjust(1)}
                      className="w-8 h-7 bg-slate-900 hover:bg-slate-800 active:bg-slate-700 text-orange-400 font-mono text-xs font-bold rounded-lg border border-slate-800 flex items-center justify-center transition-transform active:scale-95"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Giant Action Button & Next Up Preview */}
        <div className="flex flex-col gap-3 mt-5 pt-3 border-t border-slate-900">
          {/* Next up info */}
          <div className="flex items-center justify-between text-xs px-1 text-slate-400">
            <span className="flex items-center gap-1 truncate max-w-[260px]">
              <Zap size={12} className="text-orange-400 shrink-0" />
              <span className="truncate">{nextUpText}</span>
            </span>
            <span className="font-mono text-slate-300 font-bold">
              {completedSetsCount}/{totalSetsCount} listos
            </span>
          </div>

          {/* GIANT TOUCH-FRIENDLY COMPLETE BUTTON */}
          <button
            type="button"
            onClick={handleCompleteCurrentSet}
            className="w-full py-5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 font-black text-base uppercase tracking-wider rounded-2xl shadow-[0_6px_25px_rgba(249,115,22,0.4)] flex items-center justify-center gap-2.5 transition-transform active:scale-[0.98]"
          >
            <Check size={22} strokeWidth={3} />
            <span>
              {isAllRoutineCompleted ? 'Completar y Guardar' : `Completar Serie #${currentSet?.setNumber || 1}`}
            </span>
          </button>
        </div>
      </main>

      {/* Routine Quick Overview Drawer (Slide Over) */}
      <AnimatePresence>
        {showOverviewDrawer && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOverviewDrawer(false)}
              className="absolute inset-0 bg-[#050505]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative bg-[#0E0E0E] border-t sm:border border-slate-800 rounded-t-[32px] sm:rounded-3xl p-6 w-full max-w-md max-h-[85vh] overflow-y-auto scrollbar-hide flex flex-col shadow-2xl z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white">Todos los Ejercicios</h3>
                  <p className="text-xs text-slate-500">{routine.name}</p>
                </div>
                <button 
                  onClick={() => setShowOverviewDrawer(false)}
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {routine.exercises.map((ex, idx) => {
                  const isCurrent = idx === safeExIndex;
                  const isDone = ex.sets.every(
                    s => dayLog?.completedSets?.[`${ex.id}_${s.setNumber}`] || s.isCompleted
                  );

                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => {
                        setCurrentExIndex(idx);
                        setShowOverviewDrawer(false);
                      }}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-orange-500/15 border-orange-500/50 text-white ring-1 ring-orange-500/30'
                          : isDone
                            ? 'bg-emerald-950/20 border-emerald-900/40 text-slate-300'
                            : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 text-[11px] font-bold flex items-center justify-center font-mono text-slate-300">
                          {isDone ? '✓' : idx + 1}
                        </span>
                        <div>
                          <p className="text-xs font-semibold text-white">{ex.name}</p>
                          <span className="text-[10px] text-slate-500">{ex.sets.length} series • {ex.muscleGroup}</span>
                        </div>
                      </div>

                      <ChevronRight size={14} className="text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
