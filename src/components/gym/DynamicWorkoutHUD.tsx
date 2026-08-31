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
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest flex items-center gap-1">
            <Dumbbell size={12} className="text-[var(--accent)]" />
            Entrenamientos del Plan ({allRoutines.length})
          </span>
          <span className="text-[10px] text-[var(--text-muted)]">
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
                    ? 'bg-[var(--text)] text-[var(--canvas)] font-bold shadow-md'
                    : isTodayScheduled
                      ? 'bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)] hover:bg-[var(--accent-soft)]'
                      : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)]'
                }`}
              >
                <span>{r.shortName}</span>
                {isTodayScheduled && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] " />
                )}
                <span className={`text-[10px] px-1.5 py-0.2 rounded-xl ${
                  isSelected ? 'bg-[var(--canvas)] text-[var(--accent-ink)]' : 'bg-[var(--surface-raised)] text-[var(--text-faint)]'
                }`}>
                  {r.exercises.length} ex
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Session Live HUD Banner */}
      <div className="relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-xl">
        {/* Ambient Glow */}
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          isRestRunning 
            ? 'bg-[var(--warning-soft)]' 
            : isWorkoutRunning 
              ? 'bg-[var(--accent-soft)]' 
              : 'bg-[var(--surface-soft)]'
        }`} />

        {/* Top bar: Routine Name & Live Status */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                isWorkoutRunning 
                  ? 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-border)]' 
                  : workoutSeconds > 0 
                    ? 'bg-[var(--warning-soft)] text-[var(--warning)] border border-[var(--warning-border)]'
                    : 'bg-[var(--surface-raised)] text-[var(--text-muted)]'
              }`}>
                {isWorkoutRunning && <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-ping" />}
                {isWorkoutRunning ? 'Entrenando' : workoutSeconds > 0 ? 'En Pausa' : 'Listo para Empezar'}
              </span>
              <span className="text-xs text-[var(--text-faint)]">
                • {routine.estimatedMinutes || 60} min est.
              </span>
            </div>
            <h3 className="text-lg font-bold text-[var(--text)] mt-1 leading-tight">{routine.name}</h3>
          </div>

          {/* Quick Start / Finish Actions */}
          <div>
            {!isWorkoutRunning && workoutSeconds === 0 ? (
              <button
                type="button"
                onClick={onStartWorkout}
                className="px-4 py-2.5 bg-[var(--text)] text-[var(--canvas)] hover:opacity-90 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
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
                    className="p-2 bg-[var(--surface-raised)] hover:bg-[var(--surface-muted)] border border-[var(--border-strong)] text-[var(--text)] rounded-xl transition-colors"
                    title="Pausar entrenamiento"
                  >
                    <Pause size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onResumeWorkout}
                    className="p-2 bg-[var(--success-soft)] hover:bg-[var(--success-soft)] border border-[var(--success-border)] text-[var(--success)] rounded-xl transition-colors"
                    title="Reanudar entrenamiento"
                  >
                    <Play size={14} fill="currentColor" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onFinishWorkout}
                  className="px-3 py-2 bg-[var(--surface-raised)] hover:bg-[var(--surface-muted)] text-[var(--text)] border border-[var(--border-strong)] hover:border-[var(--border-strong)] rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Square size={12} fill="currentColor" className="text-[var(--accent)]" />
                  <span>Finalizar</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dual Dynamic Timers Section (Tiempo de Entrenamiento & Tiempo de Descanso) */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* TIMER 1: TIEMPO TOTAL DE ENTRENAMIENTO */}
          <div className="bg-[var(--canvas)] border border-[var(--border)] rounded-2xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                isWorkoutRunning 
                  ? 'bg-[var(--accent-soft)] border-[var(--accent-border)] text-[var(--accent)]' 
                  : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-faint)]'
              }`}>
                <Flame size={20} className={isWorkoutRunning ? '' : ''} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest block">
                  Tiempo de Sesión
                </span>
                <span className="text-xl font-semibold font-mono tracking-tight text-[var(--text)]">
                  {formatTime(workoutSeconds)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-[var(--text-muted)] block font-mono">
                {completedSetsCount}/{totalSetsCount} series
              </span>
              <span className="text-xs font-bold text-[var(--accent)]">
                {overallProgress}%
              </span>
            </div>
          </div>

          {/* TIMER 2: TIEMPO DE DESCANSO DINÁMICO */}
          <div className={`border rounded-2xl p-3.5 flex flex-col justify-between transition-all ${
            isRestRunning 
              ? 'bg-[var(--warning-soft)] border-[var(--warning-border)] shadow-[var(--shadow-soft)]' 
              : 'bg-[var(--canvas)] border-[var(--border)]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer size={15} className={isRestRunning ? 'text-[var(--warning)] animate-spin' : 'text-[var(--text-faint)]'} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  isRestRunning ? 'text-[var(--warning)]' : 'text-[var(--text-faint)]'
                }`}>
                  {isRestRunning ? 'Descansando...' : 'Descanso'}
                </span>
              </div>

              {isRestRunning ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onAdjustRest(-15)}
                    className="px-1.5 py-0.5 text-[10px] font-mono bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--text)] rounded border border-[var(--border)]"
                  >
                    -15s
                  </button>
                  <button
                    type="button"
                    onClick={() => onAdjustRest(30)}
                    className="px-1.5 py-0.5 text-[10px] font-mono bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--text)] rounded border border-[var(--border)]"
                  >
                    +30s
                  </button>
                  <button
                    type="button"
                    onClick={onSkipRest}
                    className="px-2 py-0.5 text-[10px] font-bold bg-[var(--warning-soft)] hover:bg-[var(--warning-soft)] text-[var(--warning)] rounded border border-[var(--warning-border)] flex items-center gap-0.5 ml-1"
                  >
                    <FastForward size={10} />
                    <span>Saltar</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onStartRest(90)}
                  className="text-[11px] font-medium text-[var(--accent)] hover:text-[var(--accent-strong)] flex items-center gap-1"
                >
                  <Play size={11} fill="currentColor" />
                  <span>Iniciar 90s</span>
                </button>
              )}
            </div>

            <div className="flex items-baseline justify-between mt-1">
              <span className={`text-xl font-semibold font-mono tracking-tight ${
                isRestRunning ? 'text-[var(--warning)]' : 'text-[var(--text-muted)]'
              }`}>
                {String(restMinutes).padStart(2, '0')}:{String(restSecs).padStart(2, '0')}
              </span>

              {isRestRunning && (
                <span className="text-[10px] text-[var(--warning)] font-medium">
                  {Math.round(restSecondsLeft)}s restantes
                </span>
              )}
            </div>

            {/* Rest Progress mini bar */}
            {isRestRunning && (
              <div className="w-full bg-[var(--surface)] h-1 rounded-full overflow-hidden mt-1.5">
                <div 
                  className="bg-[var(--warning)] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${restProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Next Up Exercise Guidance Banner */}
        {nextUp && (
          <div className="relative z-10 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-border)] flex items-center justify-center shrink-0">
                <Zap size={15} className="text-[var(--accent)]" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-widest block">
                  Siguiente Serie
                </span>
                <p className="text-xs font-semibold text-[var(--text)] truncate">
                  {nextUp.exercise.name} • <span className="text-[var(--text-muted)] font-mono">Serie #{nextUp.setNumber} ({nextUp.reps} reps {nextUp.weightKg ? `• ${nextUp.weightKg}kg` : ''})</span>
                </p>
              </div>
            </div>

            {onCompleteNextSet && (
              <button
                type="button"
                onClick={onCompleteNextSet}
                className="px-3 py-1.5 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[var(--accent-ink)] font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 shrink-0 transition-transform active:scale-95"
              >
                <CheckCircle2 size={13} strokeWidth={2.5} />
                <span>Listo</span>
              </button>
            )}
          </div>
        )}

        {/* Workout Overall Progress Bar */}
        <div className="relative z-10 mt-3 pt-3 border-t border-[var(--border)] flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
            <span>Progreso General</span>
            <span className="font-mono font-semibold text-[var(--text)]">
              {completedSetsCount} de {totalSetsCount} series completadas ({overallProgress}%)
            </span>
          </div>
          <div className="w-full bg-[var(--canvas)] h-1.5 rounded-full overflow-hidden border border-[var(--border)]">
            <div 
              className="bg-[var(--text)] h-full transition-all duration-300 rounded-full shadow-[var(--shadow-soft)]"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
