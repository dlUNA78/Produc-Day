import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Timer, 
  Flame, 
  CheckCircle2, 
  Plus, 
  Minus, 
  FastForward, 
  Dumbbell, 
  Sparkles,
  ChevronRight,
  Zap,
  Volume2
} from 'lucide-react';
import { WorkoutRoutine, Exercise } from '../../types';

interface DynamicWorkoutHUDProps {
  routine: WorkoutRoutine;
  allRoutines: WorkoutRoutine[];
  selectedRoutineId: string;
  onSelectRoutine: (routineId: string) => void;
  scheduledRoutineId?: string;
  totalSetsCount: number;
  completedSetsCount: number;
  // Workout Session Timer
  workoutSeconds: number;
  isWorkoutRunning: boolean;
  onStartWorkout: () => void;
  onPauseWorkout: () => void;
  onResumeWorkout: () => void;
  onFinishWorkout: () => void;
  // Rest Timer
  restSecondsLeft: number;
  restTargetSeconds: number;
  isRestRunning: boolean;
  onStartRest: (seconds?: number) => void;
  onAdjustRest: (delta: number) => void;
  onSkipRest: () => void;
  nextUp?: {
    exercise: Exercise;
    setNumber: number;
    reps: string | number;
    weightKg?: number;
  } | null;
  onCompleteNextSet?: () => void;
}

export default function DynamicWorkoutHUD({
  routine,
  allRoutines,
  selectedRoutineId,
  onSelectRoutine,
  scheduledRoutineId,
  totalSetsCount,
  completedSetsCount,
  workoutSeconds,
  isWorkoutRunning,
  onStartWorkout,
  onPauseWorkout,
  onResumeWorkout,
  onFinishWorkout,
  restSecondsLeft,
  restTargetSeconds,
  isRestRunning,
  onStartRest,
  onAdjustRest,
  onSkipRest,
  nextUp,
  onCompleteNextSet,
}: DynamicWorkoutHUDProps) {
  // Format seconds to HH:MM:SS or MM:SS
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const remainingSecs = secs % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const restMinutes = Math.floor(restSecondsLeft / 60);
  const restSecs = restSecondsLeft % 60;
  const restProgress = restTargetSeconds > 0 ? ((restTargetSeconds - restSecondsLeft) / restTargetSeconds) * 100 : 0;
  const overallProgress = totalSetsCount > 0 ? Math.round((completedSetsCount / totalSetsCount) * 100) : 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Routine Selector Carousel / Tabs (Ver todos los entrenamientos del plan) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
            <Dumbbell size={12} className="text-orange-400" />
            Entrenamientos del Plan ({allRoutines.length})
          </span>
          <span className="text-[10px] text-slate-400">
            {allRoutines.find(r => r.id === selectedRoutineId)?.name}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 px-0.5">
          {allRoutines.map(r => {
            const isSelected = r.id === selectedRoutineId;
            const isTodayScheduled = r.id === scheduledRoutineId;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRoutine(r.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow-[0_4px_14px_rgba(249,115,22,0.3)]'
                    : isTodayScheduled
                      ? 'bg-orange-950/30 border border-orange-500/40 text-orange-300 hover:bg-orange-950/50'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span>{r.shortName}</span>
                {isTodayScheduled && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                )}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-500'
                }`}>
                  {r.exercises.length} ex
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Session Live HUD Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/95 via-[#111111] to-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl">
        {/* Ambient Glow */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          isRestRunning 
            ? 'bg-amber-500/10' 
            : isWorkoutRunning 
              ? 'bg-orange-500/15' 
              : 'bg-slate-700/5'
        }`} />

        {/* Top bar: Routine Name & Live Status */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isWorkoutRunning 
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                  : workoutSeconds > 0 
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
              }`}>
                {isWorkoutRunning && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                {isWorkoutRunning ? 'Entrenando' : workoutSeconds > 0 ? 'En Pausa' : 'Listo para Empezar'}
              </span>
              <span className="text-xs text-slate-500">
                • {routine.estimatedMinutes || 60} min est.
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1 leading-tight">{routine.name}</h3>
          </div>

          {/* Quick Start / Finish Actions */}
          <div>
            {!isWorkoutRunning && workoutSeconds === 0 ? (
              <button
                type="button"
                onClick={onStartWorkout}
                className="px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.35)] flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Play size={14} fill="currentColor" />
                <span>Iniciar Sesión</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                {isWorkoutRunning ? (
                  <button
                    type="button"
                    onClick={onPauseWorkout}
                    className="p-2 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 rounded-xl transition-colors"
                    title="Pausar entrenamiento"
                  >
                    <Pause size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onResumeWorkout}
                    className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-400 rounded-xl transition-colors"
                    title="Reanudar entrenamiento"
                  >
                    <Play size={14} fill="currentColor" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onFinishWorkout}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Square size={12} fill="currentColor" className="text-orange-400" />
                  <span>Finalizar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dual Dynamic Timers Section (Tiempo de Entrenamiento & Tiempo de Descanso) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* TIMER 1: TIEMPO TOTAL DE ENTRENAMIENTO */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                isWorkoutRunning 
                  ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}>
                <Flame size={20} className={isWorkoutRunning ? 'animate-pulse' : ''} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Tiempo de Sesión
                </span>
                <span className="text-xl font-black font-mono tracking-tight text-white">
                  {formatTime(workoutSeconds)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 block font-mono">
                {completedSetsCount}/{totalSetsCount} series
              </span>
              <span className="text-xs font-bold text-orange-400">
                {overallProgress}%
              </span>
            </div>
          </div>

          {/* TIMER 2: TIEMPO DE DESCANSO DINÁMICO */}
          <div className={`border rounded-2xl p-3.5 flex flex-col justify-between transition-all ${
            isRestRunning 
              ? 'bg-amber-950/25 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
              : 'bg-slate-950/40 border-slate-800/70'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer size={15} className={isRestRunning ? 'text-amber-400 animate-spin' : 'text-slate-500'} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  isRestRunning ? 'text-amber-400' : 'text-slate-500'
                }`}>
                  {isRestRunning ? 'Descansando...' : 'Descanso'}
                </span>
              </div>

              {isRestRunning ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onAdjustRest(-15)}
                    className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
                  >
                    -15s
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdjustRest(30)}
                    className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800"
                  >
                    +30s
                  </button>
                  <button
                    type="button"
                    onClick={onSkipRest}
                    className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded border border-amber-500/30 flex items-center gap-0.5 ml-1"
                  >
                    <FastForward size={10} />
                    <span>Saltar</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onStartRest(90)}
                  className="text-[11px] font-medium text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <Play size={11} fill="currentColor" />
                  <span>Iniciar 90s</span>
                </button>
              )}
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className={`text-xl font-black font-mono tracking-tight ${
                isRestRunning ? 'text-amber-300' : 'text-slate-400'
              }`}>
                {String(restMinutes).padStart(2, '0')}:{String(restSecs).padStart(2, '0')}
              </span>

              {isRestRunning && (
                <span className="text-[10px] text-amber-400/80 font-medium">
                  {Math.round(restSecondsLeft)}s restantes
                </span>
              )}
            </div>

            {/* Rest Progress mini bar */}
            {isRestRunning && (
              <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1.5">
                <div 
                  className="bg-amber-400 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${restProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Next Up Exercise Guidance Banner */}
        {nextUp && (
          <div className="relative z-10 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Zap size={15} className="text-orange-400" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] font-bold text-orange-400 uppercase tracking-widest block">
                  Siguiente Serie
                </span>
                <p className="text-xs font-semibold text-white truncate">
                  {nextUp.exercise.name} • <span className="text-slate-400 font-mono">Serie #{nextUp.setNumber} ({nextUp.reps} reps {nextUp.weightKg ? `• ${nextUp.weightKg}kg` : ''})</span>
                </p>
              </div>
            </div>

            {onCompleteNextSet && (
              <button
                type="button"
                onClick={onCompleteNextSet}
                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 shrink-0 transition-transform active:scale-95"
              >
                <CheckCircle2 size={13} strokeWidth={2.5} />
                <span>Listo</span>
              </button>
            )}
          </div>
        )}

        {/* Workout Overall Progress Bar */}
        <div className="relative z-10 mt-3 pt-3 border-t border-slate-800/60 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Progreso General</span>
            <span className="font-mono font-semibold text-slate-300">
              {completedSetsCount} de {totalSetsCount} series completadas ({overallProgress}%)
            </span>
          </div>
          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800/80">
            <div 
              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.4)]"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
