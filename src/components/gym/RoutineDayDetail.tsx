import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Flame, 
  Check,
  Coffee,
  Sparkles,
  Zap,
  Tag,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
  Maximize2
} from 'lucide-react';
import { WorkoutRoutine, Exercise, MuscleGroup, ExerciseSet, GymDayLog } from '../../types';

interface RoutineDayDetailProps {
  dateKey: string;
  routine: WorkoutRoutine | null;
  allRoutines: WorkoutRoutine[];
  selectedRoutineId: string;
  onSelectRoutine: (routineId: string) => void;
  scheduledRoutineId?: string;
  isRestDay: boolean;
  dayLog?: GymDayLog;
  onToggleSet: (exerciseId: string, setNumber: number) => void;
  onUpdateSet: (exerciseId: string, setNumber: number, reps: string, weightKg: number) => void;
  onAddExerciseClick: () => void;
  onDeleteExercise: (exerciseId: string) => void;
  onOpenGuidedWorkout: () => void;
  // Session info
  workoutSeconds: number;
  isWorkoutRunning: boolean;
  onSelectAlternativeRoutine: () => void;
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

export default function RoutineDayDetail({
  dateKey,
  routine,
  allRoutines,
  selectedRoutineId,
  onSelectRoutine,
  scheduledRoutineId,
  isRestDay,
  dayLog,
  onToggleSet,
  onUpdateSet,
  onAddExerciseClick,
  onDeleteExercise,
  onOpenGuidedWorkout,
  workoutSeconds,
  isWorkoutRunning,
  onSelectAlternativeRoutine,
}: RoutineDayDetailProps) {
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // If rest day & no routine selected
  if ((isRestDay && !routine) || (!routine && allRoutines.length === 0)) {
    return (
      <div className="px-6 flex flex-col items-center text-center py-10 bg-slate-900/30 border border-slate-800/80 rounded-3xl mb-8">
        <div className="w-16 h-16 rounded-3xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center mb-4 text-slate-400">
          <Coffee size={28} />
        </div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">
          Día de Recuperación
        </span>
        <h3 className="text-xl font-semibold text-white mb-2">Descanso Programado</h3>
        <p className="text-slate-400 text-xs max-w-[280px] leading-relaxed mb-6">
          El descanso y la recuperación muscular son clave para el crecimiento y adaptación.
        </p>

        <button
          type="button"
          onClick={onSelectAlternativeRoutine}
          className="px-4 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <Dumbbell size={14} />
          <span>Elegir un Entrenamiento del Plan</span>
        </button>
      </div>
    );
  }

  if (!routine) return null;

  // Calculate totals
  let totalSets = 0;
  let completedSetsCount = 0;
  routine.exercises.forEach(ex => {
    ex.sets.forEach(s => {
      totalSets++;
      if (dayLog?.completedSets?.[`${ex.id}_${s.setNumber}`] || s.isCompleted) {
        completedSetsCount++;
      }
    });
  });

  const progressPercent = totalSets > 0 ? Math.round((completedSetsCount / totalSets) * 100) : 0;
  const isCompleted = dayLog?.isCompleted;

  return (
    <div className="px-6 mb-12 flex flex-col gap-5">
      {/* 1. Quick Routine Selector Tabs (Clear & Intuitive) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Rutinas del Plan
          </span>
          <span className="text-[10px] text-orange-400 font-mono">
            {completedSetsCount}/{totalSets} series ({progressPercent}%)
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-0.5">
          {allRoutines.map(r => {
            const isSelected = r.id === selectedRoutineId;
            const isToday = r.id === scheduledRoutineId;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => onSelectRoutine(r.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow-[0_4px_14px_rgba(249,115,22,0.3)]'
                    : isToday
                      ? 'bg-orange-950/30 border border-orange-500/40 text-orange-300'
                      : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{r.shortName}</span>
                {isToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Hero Card: Focus & "Empezar Modo Guiado" Big Button */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900/95 via-[#111111] to-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                  {routine.shortName}
                </span>
                <span className="text-xs text-slate-400">
                  {routine.estimatedMinutes || 50} min • {routine.exercises.length} ejercicios
                </span>
              </div>
              <h2 className="text-xl font-bold text-white leading-tight">
                {routine.name}
              </h2>
            </div>
          </div>

          {/* Muscle tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {routine.targetMuscles.map(m => (
              <span 
                key={m} 
                className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${
                  muscleColors[m] || 'bg-slate-800 text-slate-400'
                }`}
              >
                {m}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-1.5">
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-gradient-to-r from-orange-500 to-amber-400 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* GIANT CALL TO ACTION: START / CONTINUE GUIDED WORKOUT */}
          <button
            type="button"
            onClick={onOpenGuidedWorkout}
            className="w-full py-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 hover:from-orange-400 hover:to-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_20px_rgba(249,115,22,0.35)] flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
          >
            {workoutSeconds > 0 ? (
              <>
                <Zap size={18} fill="currentColor" />
                <span>Continuar Modo Guiado ({formatTime(workoutSeconds)})</span>
              </>
            ) : (
              <>
                <Play size={18} fill="currentColor" />
                <span>Iniciar Entrenamiento Guiado</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Exercise Checklist (Clear, Scannable & Expandable) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Dumbbell size={14} className="text-orange-400" />
            Lista de Ejercicios ({routine.exercises.length})
          </h3>
          <button
            type="button"
            onClick={onAddExerciseClick}
            className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-xl transition-colors"
          >
            <Plus size={13} />
            <span>Añadir</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {routine.exercises.map((exercise, idx) => {
            const isAllDone = exercise.sets.every(
              s => dayLog?.completedSets?.[`${exercise.id}_${s.setNumber}`] || s.isCompleted
            );
            const isExpanded = expandedExerciseId === exercise.id;

            return (
              <div
                key={exercise.id}
                className={`bg-slate-900/40 border rounded-2xl transition-all overflow-hidden ${
                  isAllDone
                    ? 'border-emerald-500/40 bg-emerald-950/10'
                    : 'border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                {/* Exercise Summary Row */}
                <div 
                  onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/20"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center border ${
                      isAllDone
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      {isAllDone ? '✓' : idx + 1}
                    </span>

                    <div>
                      <h4 className="text-sm font-semibold text-white leading-snug">
                        {exercise.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-mono">
                          {exercise.sets.length} series • {exercise.sets[0]?.reps} reps {exercise.sets[0]?.weightKg ? `(${exercise.sets[0].weightKg}kg)` : ''}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          muscleColors[exercise.muscleGroup] || 'bg-slate-800 text-slate-400'
                        }`}>
                          {exercise.muscleGroup}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteExercise(exercise.id);
                      }}
                      className="text-slate-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Eliminar ejercicio"
                    >
                      <Trash2 size={13} />
                    </button>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Sets Details & Quick Adjusters */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-800/60 bg-slate-950/30 flex flex-col gap-2">
                    {exercise.notes && (
                      <p className="text-[11px] text-slate-400 italic">
                        💡 {exercise.notes}
                      </p>
                    )}

                    <div className="flex flex-col gap-1.5 mt-1">
                      {exercise.sets.map(set => {
                        const setKey = `${exercise.id}_${set.setNumber}`;
                        const isSetChecked = dayLog?.completedSets?.[setKey] ?? set.isCompleted ?? false;

                        return (
                          <div
                            key={set.id || set.setNumber}
                            className={`flex items-center justify-between p-2 rounded-xl border text-xs ${
                              isSetChecked 
                                ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                                : 'bg-slate-900/50 border-slate-800/70 text-slate-300'
                            }`}
                          >
                            <span className="font-mono font-bold text-slate-400">
                              Serie #{set.setNumber}
                            </span>

                            <div className="flex items-center gap-2">
                              <span className="font-mono text-white">
                                {set.reps} reps
                              </span>
                              <span className="font-mono text-slate-400">
                                • {set.weightKg || 0} kg
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onToggleSet(exercise.id, set.setNumber)}
                              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                                isSetChecked
                                  ? 'bg-emerald-500 text-slate-950 font-bold'
                                  : 'bg-slate-800 border border-slate-700 hover:border-orange-500 text-slate-500'
                              }`}
                            >
                              <Check size={14} strokeWidth={isSetChecked ? 3 : 2} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
