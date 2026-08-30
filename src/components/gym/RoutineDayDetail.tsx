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
  Pecho: 'bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger-border)]',
  Espalda: 'bg-[var(--plum-soft)] text-[var(--plum)] border-[var(--plum-border)]',
  Hombros: 'bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning-border)]',
  Bíceps: 'bg-[var(--plum-soft)] text-[var(--plum)] border-[var(--plum-border)]',
  Tríceps: 'bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger-border)]',
  Cuádriceps: 'bg-[var(--accent-soft)] text-[var(--accent)] border-[var(--accent-border)]',
  Isquios: 'bg-[var(--warning-soft)] text-[var(--warning)] border-[var(--warning-border)]',
  Glúteos: 'bg-[var(--danger-soft)] text-[var(--danger)] border-[var(--danger-border)]',
  Gemelos: 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success-border)]',
  'Core / Abdomen': 'bg-[var(--success-soft)] text-[var(--success)] border-[var(--success-border)]',
  'Cardio / Movilidad': 'bg-[var(--steel-soft)] text-[var(--steel)] border-[var(--steel-border)]',
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
      <div className="px-6 flex flex-col items-center text-center py-10 bg-[var(--surface)] border border-[var(--border)] rounded-3xl mb-8">
        <div className="w-16 h-16 rounded-3xl bg-[var(--surface-raised)] border border-[var(--border-strong)] flex items-center justify-center mb-4 text-[var(--text-muted)]">
          <Coffee size={28} />
        </div>
        <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest mb-1">
          Día de Recuperación
        </span>
        <h3 className="text-xl font-semibold text-[var(--text)] mb-2">Descanso Programado</h3>
        <p className="text-[var(--text-muted)] text-xs max-w-[280px] leading-relaxed mb-6">
          El descanso y la recuperación muscular son clave para el crecimiento y adaptación.
        </p>

        <button
          type="button"
          onClick={onSelectAlternativeRoutine}
          className="px-4 py-2.5 bg-[var(--accent-soft)] hover:bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-border)] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
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
          <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest">
            Rutinas del Plan
          </span>
          <span className="text-[10px] text-[var(--accent)] font-mono">
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
                    ? 'bg-[linear-gradient(135deg,var(--surface-raised),var(--surface))]   text-[var(--accent-ink)] font-bold shadow-[0_4px_14px_rgba(249,115,22,0.3)]'
                    : isToday
                      ? 'bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)]'
                      : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                <span>{r.shortName}</span>
                {isToday && !isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] " />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Hero Card: Focus & "Empezar Modo Guiado" Big Button */}
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,var(--surface-raised),var(--surface))]  via-[#111111]  border border-[var(--border)] rounded-3xl p-5 shadow-xl">
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--accent-soft)] border border-[var(--accent-border)] px-2 py-0.5 rounded-full">
                  {routine.shortName}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {routine.estimatedMinutes || 50} min • {routine.exercises.length} ejercicios
                </span>
              </div>
              <h2 className="text-xl font-bold text-[var(--text)] leading-tight">
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
                  muscleColors[m] || 'bg-[var(--surface-raised)] text-[var(--text-muted)]'
                }`}
              >
                {m}
              </span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-1.5">
            <div className="w-full bg-[var(--canvas)] h-2 rounded-full overflow-hidden border border-[var(--border)]">
              <div 
                className="bg-[linear-gradient(135deg,var(--surface-raised),var(--surface))]   h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* GIANT CALL TO ACTION: START / CONTINUE GUIDED WORKOUT */}
          <button
            type="button"
            onClick={onOpenGuidedWorkout}
            className="w-full py-4 bg-[linear-gradient(135deg,var(--surface-raised),var(--surface))]    hover: hover: text-[var(--accent-ink)] font-semibold text-sm uppercase tracking-wider rounded-2xl shadow-[0_4px_20px_rgba(249,115,22,0.35)] flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
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
          <h3 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1.5">
            <Dumbbell size={14} className="text-[var(--accent)]" />
            Lista de Ejercicios ({routine.exercises.length})
          </h3>
          <button
            type="button"
            onClick={onAddExerciseClick}
            className="text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)] flex items-center gap-1 bg-[var(--accent-soft)] border border-[var(--accent-border)] px-2.5 py-1 rounded-xl transition-colors"
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
                className={`bg-[var(--surface)] border rounded-2xl transition-all overflow-hidden ${
                  isAllDone
                    ? 'border-[var(--success-border)] bg-[var(--success-soft)]'
                    : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                }`}
              >
                {/* Exercise Summary Row */}
                <div 
                  onClick={() => setExpandedExerciseId(isExpanded ? null : exercise.id)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[var(--surface-muted)]"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-lg text-xs font-bold font-mono flex items-center justify-center border ${
                      isAllDone
                        ? 'bg-[var(--success-soft)] border-[var(--success-border)] text-[var(--success)]'
                        : 'bg-[var(--surface-raised)] border-[var(--border-strong)] text-[var(--text-muted)]'
                    }`}>
                      {isAllDone ? '✓' : idx + 1}
                    </span>

                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text)] leading-snug">
                        {exercise.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {exercise.sets.length} series • {exercise.sets[0]?.reps} reps {exercise.sets[0]?.weightKg ? `(${exercise.sets[0].weightKg}kg)` : ''}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${
                          muscleColors[exercise.muscleGroup] || 'bg-[var(--surface-raised)] text-[var(--text-muted)]'
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
                      className="text-[var(--text-faint)] hover:text-[var(--danger)] p-1.5 rounded-lg hover:bg-[var(--danger-soft)] transition-colors"
                      title="Eliminar ejercicio"
                    >
                      <Trash2 size={13} />
                    </button>
                    {isExpanded ? <ChevronUp size={16} className="text-[var(--text-muted)]" /> : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
                  </div>
                </div>

                {/* Expanded Sets Details & Quick Adjusters */}
                {isExpanded && (
                  <div className="px-3.5 pb-3.5 pt-1 border-t border-[var(--border)] bg-[var(--canvas)] flex flex-col gap-2">
                    {exercise.notes && (
                      <p className="text-[11px] text-[var(--text-muted)] italic">
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
                                ? 'bg-[var(--success-soft)] border-[var(--success-border)] text-[var(--success)]' 
                                : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text)]'
                            }`}
                          >
                            <span className="font-mono font-bold text-[var(--text-muted)]">
                              Serie #{set.setNumber}
                            </span>

                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[var(--text)]">
                                {set.reps} reps
                              </span>
                              <span className="font-mono text-[var(--text-muted)]">
                                • {set.weightKg || 0} kg
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => onToggleSet(exercise.id, set.setNumber)}
                              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
                                isSetChecked
                                  ? 'bg-[var(--success)] text-[var(--accent-ink)] font-bold'
                                  : 'bg-[var(--surface-raised)] border border-[var(--border-strong)] hover:border-[var(--accent)] text-[var(--text-faint)]'
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
