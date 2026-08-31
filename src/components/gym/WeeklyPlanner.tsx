import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Dumbbell, 
  Coffee, 
  Sparkles, 
  Layers, 
  Check, 
  Clock, 
  Flame, 
  RotateCcw,
  Zap,
  Bookmark,
  CheckCircle2,
  Edit2
} from 'lucide-react';
import { WorkoutSplit, WorkoutRoutine, MuscleGroup } from '../../types';
import { formatDateKey, parseDateKey, getWeekDays } from '../WeeklyCalendar';

interface WeeklyPlannerProps {
  currentSplit: WorkoutSplit;
  allSplits: WorkoutSplit[];
  allRoutines: WorkoutRoutine[];
  onUpdateWeekSchedule: (schedule: Record<number, string>, weekKey?: string) => void;
  onSelectRoutineToEdit: (routineId: string) => void;
  onOpenCreateRoutine: () => void;
}

const dayNames = [
  { day: 1, name: 'Lunes', short: 'LUN' },
  { day: 2, name: 'Martes', short: 'MAR' },
  { day: 3, name: 'Miércoles', short: 'MIÉ' },
  { day: 4, name: 'Jueves', short: 'JUE' },
  { day: 5, name: 'Viernes', short: 'VIE' },
  { day: 6, name: 'Sábado', short: 'SÁB' },
  { day: 0, name: 'Domingo', short: 'DOM' },
];

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

export default function WeeklyPlanner({
  currentSplit,
  allSplits,
  allRoutines,
  onUpdateWeekSchedule,
  onSelectRoutineToEdit,
  onOpenCreateRoutine,
}: WeeklyPlannerProps) {
  // Reference date for the viewed week (starts with current date)
  const [referenceDate, setReferenceDate] = useState<Date>(() => new Date());
  
  // Custom week schedules map stored in state & localStorage (weekKey -> schedule)
  const [customWeekSchedules, setCustomWeekSchedules] = useState<Record<string, Record<number, string>>>(() => {
    const saved = localStorage.getItem('gym_custom_week_schedules_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return {}; }
    }
    return {};
  });

  const weekDays = getWeekDays(referenceDate);
  const monday = weekDays[0];
  const sunday = weekDays[6];

  // Unique Week Key e.g. "2026-W34" or "2026-08-24"
  const weekKey = formatDateKey(monday);
  const isCurrentWeek = getWeekDays(new Date())[0].toDateString() === monday.toDateString();

  // Active schedule for this week (either custom for this week, or the current split's default)
  const currentWeekSchedule = customWeekSchedules[weekKey] || currentSplit.schedule;

  // Selected day for bottom picker modal
  const [activeDayPicker, setActiveDayPicker] = useState<number | null>(null);

  // Quick Preset modal
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  // Navigate weeks
  const handlePrevWeek = () => {
    const prev = new Date(referenceDate);
    prev.setDate(prev.getDate() - 7);
    setReferenceDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(referenceDate);
    next.setDate(next.getDate() + 7);
    setReferenceDate(next);
  };

  const handleCurrentWeek = () => {
    setReferenceDate(new Date());
  };

  // Change routine for a specific day
  const handleSetDayRoutine = (dayNum: number, routineId: string) => {
    const updatedSchedule = {
      ...currentWeekSchedule,
      [dayNum]: routineId,
    };

    const newCustom = {
      ...customWeekSchedules,
      [weekKey]: updatedSchedule,
    };

    setCustomWeekSchedules(newCustom);
    localStorage.setItem('gym_custom_week_schedules_v3', JSON.stringify(newCustom));

    onUpdateWeekSchedule(updatedSchedule, weekKey);
    setActiveDayPicker(null);
  };

  // Apply a split template to this week
  const handleApplySplitTemplate = (split: WorkoutSplit) => {
    const newCustom = {
      ...customWeekSchedules,
      [weekKey]: split.schedule,
    };
    setCustomWeekSchedules(newCustom);
    localStorage.setItem('gym_custom_week_schedules_v3', JSON.stringify(newCustom));

    onUpdateWeekSchedule(split.schedule, weekKey);
    setIsPresetModalOpen(false);
  };

  // Format week header date range
  const formatRange = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${monday.getDate()} ${months[monday.getMonth()]} — ${sunday.getDate()} ${months[sunday.getMonth()]} ${sunday.getFullYear()}`;
  };

  // Calculate week stats
  let totalWorkouts = 0;
  let totalSets = 0;
  let totalEstimatedMinutes = 0;
  const musclesMap: Record<MuscleGroup, number> = {} as any;

  dayNames.forEach(({ day }) => {
    const routineId = currentWeekSchedule[day];
    if (routineId && routineId !== 'REST') {
      const routine = allRoutines.find(r => r.id === routineId);
      if (routine) {
        totalWorkouts++;
        totalEstimatedMinutes += routine.estimatedMinutes || 60;
        routine.exercises.forEach(e => {
          totalSets += e.sets.length;
          musclesMap[e.muscleGroup] = (musclesMap[e.muscleGroup] || 0) + e.sets.length;
        });
      }
    }
  });

  return (
    <div className="flex flex-col gap-5 px-6 pb-20">
      {/* 1. Week Selector Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent-border)] px-2 py-0.5 rounded-full uppercase tracking-wider">
                {isCurrentWeek ? 'Semana Actual' : 'Planificación'}
              </span>
              <span className="text-xs text-[var(--text-muted)] font-medium">
                {formatRange()}
              </span>
            </div>
            <h2 className="text-lg font-bold text-[var(--text)] mt-0.5">
              Planificador de la Semana
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-[var(--canvas)] p-1 rounded-xl border border-[var(--border)]">
            <button
              type="button"
              onClick={handlePrevWeek}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors"
              title="Semana anterior"
            >
              <ChevronLeft size={16} />
            </button>
            {!isCurrentWeek && (
              <button
                type="button"
                onClick={handleCurrentWeek}
                className="px-2 py-1 text-[10px] font-bold text-[var(--accent)] hover:bg-[var(--surface-muted)] rounded-xl"
              >
                Hoy
              </button>
            )}
            <button
              type="button"
              onClick={handleNextWeek}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors"
              title="Semana siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Quick action: Apply template & Create routine buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPresetModalOpen(true)}
            className="flex-1 py-2 px-3 bg-[var(--surface)] hover:bg-[var(--surface-muted)] border border-[var(--border)] rounded-xl text-xs font-semibold text-[var(--accent)] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles size={14} />
            <span>Cargar Plantilla de Semana</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateRoutine}
            className="py-2 px-3 bg-[var(--accent-soft)] hover:bg-[var(--accent-soft)] border border-[var(--accent-border)] rounded-xl text-xs font-semibold text-[var(--accent)] flex items-center gap-1.5 transition-colors"
          >
            <Dumbbell size={14} />
            <span>+ Nueva Rutina</span>
          </button>
        </div>
      </div>

      {/* 2. Summary stats for this week */}
      <div className="grid grid-cols-3 gap-2 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl p-3">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-[var(--text-faint)] uppercase tracking-wider">Entrenamientos</span>
          <span className="text-lg font-semibold text-[var(--text)]">{totalWorkouts} / 7 días</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-[var(--text-faint)] uppercase tracking-wider">Series Totales</span>
          <span className="text-lg font-semibold text-[var(--accent)] font-mono">{totalSets} series</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-[var(--text-faint)] uppercase tracking-wider">Tiempo Proyectado</span>
          <span className="text-lg font-semibold text-[var(--text)] font-mono">~{Math.round(totalEstimatedMinutes / 60 * 10) / 10}h</span>
        </div>
      </div>

      {/* 3. 7-Day Interactive Assignment Grid */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-widest px-1">
          Distribución de Lunes a Domingo
        </span>

        {dayNames.map(({ day, name, short }) => {
          // Corresponding date object
          const dateObj = weekDays.find(d => {
            const dNum = d.getDay();
            return dNum === day;
          }) || weekDays[0];

          const routineId = currentWeekSchedule[day];
          const isRest = !routineId || routineId === 'REST';
          const routine = !isRest ? allRoutines.find(r => r.id === routineId) : null;
          const isToday = formatDateKey(new Date()) === formatDateKey(dateObj);

          return (
            <div
              key={day}
              className={`bg-[var(--surface)] border rounded-2xl p-3.5 transition-all flex flex-col gap-2.5 ${
                isToday
                  ? 'border-[var(--accent-border)] bg-[var(--surface-raised)] shadow-md'
                  : isRest
                    ? 'border-[var(--border)] opacity-80'
                    : 'border-[var(--border)] hover:border-[var(--border-strong)]'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-xl font-mono ${
                    isToday ? 'bg-[var(--accent)] text-[var(--accent-ink)]' : 'bg-[var(--surface-raised)] text-[var(--text)]'
                  }`}>
                    {short} {dateObj.getDate()}
                  </span>
                  <span className="text-xs font-semibold text-[var(--text)]">
                    {name}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold text-[var(--accent)] uppercase tracking-wider bg-[var(--accent-soft)] px-1.5 py-0.2 rounded border border-[var(--accent-border)]">
                      Hoy
                    </span>
                  )}
                </div>

                {/* Change Routine Button */}
                <button
                  type="button"
                  onClick={() => setActiveDayPicker(day)}
                  className="px-2.5 py-1 bg-[var(--canvas)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text)] hover:text-[var(--accent-strong)] rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit2 size={12} />
                  <span>{isRest ? 'Asignar' : 'Cambiar'}</span>
                </button>
              </div>

              {/* Routine Content or Rest */}
              {isRest ? (
                <div 
                  onClick={() => setActiveDayPicker(day)}
                  className="flex items-center gap-2.5 p-2 bg-[var(--canvas)] border border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:bg-[var(--surface-muted)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-faint)]">
                    <Coffee size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">Descanso / Recuperación activa</span>
                    <p className="text-[10px] text-[var(--text-muted)]">Toca para programar un entrenamiento</p>
                  </div>
                </div>
              ) : routine ? (
                <div className="flex flex-col gap-2 p-2.5 bg-[var(--canvas)] border border-[var(--border)] rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[var(--accent)] uppercase bg-[var(--accent-soft)] border border-[var(--accent-border)] px-2 py-0.5 rounded-xl font-mono">
                        {routine.shortName}
                      </span>
                      <h4 className="text-xs font-bold text-[var(--text)] truncate max-w-[200px]">
                        {routine.name}
                      </h4>
                    </div>

                    <span className="text-[10px] text-[var(--text-muted)] font-mono">
                      {routine.exercises.length} ejercicios • {routine.estimatedMinutes || 60}m
                    </span>
                  </div>

                  {/* Muscle tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {routine.targetMuscles.map(m => (
                      <span
                        key={m}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                          muscleColors[m] || 'bg-[var(--surface-raised)] text-[var(--text-muted)]'
                        }`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>

                  {/* Quick Edit exercises link */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => onSelectRoutineToEdit(routine.id)}
                      className="text-[10px] font-bold text-[var(--accent)] hover:text-[var(--accent-strong)] flex items-center gap-1 hover:underline"
                    >
                      <Layers size={11} />
                      <span>Ver / Modificar ejercicios</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[var(--danger)] p-2 bg-[var(--danger-soft)] border border-[var(--danger-border)] rounded-xl">
                  Rutina no encontrada. Toca para asignar una.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Day Routine Picker Bottom Sheet Modal */}
      <AnimatePresence>
        {activeDayPicker !== null && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDayPicker(null)}
              className="absolute inset-0 bg-[color:var(--surface-glass)] backdrop-blur-md"
            />

            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.8 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="relative bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-[32px] sm:rounded-3xl w-full max-w-md max-h-[90dvh] h-auto flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              <div className="shrink-0 p-5 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                    <Calendar size={16} className="text-[var(--accent)]" />
                    Asignar para {dayNames.find(d => d.day === activeDayPicker)?.name}
                  </h3>
                  <p className="text-xs text-[var(--text-faint)]">¿Qué entrenamiento harás este día?</p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDayPicker(null)}
                  className="w-8 h-8 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto scroll-y-touch p-5 space-y-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                {/* Option 1: Rest Day */}
                <button
                  type="button"
                  onClick={() => handleSetDayRoutine(activeDayPicker, 'REST')}
                  className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    currentWeekSchedule[activeDayPicker] === 'REST' || !currentWeekSchedule[activeDayPicker]
                      ? 'bg-[var(--surface-raised)] border-[var(--accent-border)] text-[var(--text)] shadow-sm'
                      : 'bg-[var(--canvas)] border-[var(--border)] text-[var(--text)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]">
                      <Coffee size={17} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-[var(--text)]">Día de Descanso</div>
                      <div className="text-[10px] text-[var(--text-faint)]">Recuperación muscular activa</div>
                    </div>
                  </div>

                  {(currentWeekSchedule[activeDayPicker] === 'REST' || !currentWeekSchedule[activeDayPicker]) && (
                    <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>

                {/* Available Routines list */}
                {allRoutines.map((rt) => {
                  const isSelected = currentWeekSchedule[activeDayPicker] === rt.id;

                  return (
                    <button
                      key={rt.id}
                      type="button"
                      onClick={() => handleSetDayRoutine(activeDayPicker, rt.id)}
                      className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-[var(--accent-soft)] border-[var(--accent-border)] text-[var(--text)] shadow-sm'
                          : 'bg-[var(--canvas)] border-[var(--border)] text-[var(--text)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)] shrink-0">
                          <Dumbbell size={17} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-[var(--accent)] bg-[var(--accent-soft)] px-1.5 py-0.2 rounded font-mono shrink-0">
                              {rt.shortName}
                            </span>
                            <span className="text-xs font-bold text-[var(--text)] truncate">
                              {rt.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5 truncate">
                            {rt.exercises.length} ejercicios • {rt.estimatedMinutes || 60}m • {rt.targetMuscles.slice(0, 3).join(', ')}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center shrink-0">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Preset Split Template Modal */}
      <AnimatePresence>
        {isPresetModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPresetModalOpen(false)}
              className="absolute inset-0 bg-[color:var(--surface-glass)] backdrop-blur-md"
            />

            <motion.div
              initial={{ y: '100%', opacity: 0.8 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0.8 }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="relative bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-[32px] sm:rounded-3xl w-full max-w-md max-h-[90dvh] h-auto flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              <div className="shrink-0 p-5 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[var(--text)] flex items-center gap-2">
                    <Sparkles size={16} className="text-[var(--accent)]" />
                    Plantillas de Semana
                  </h3>
                  <p className="text-xs text-[var(--text-faint)]">Aplica una estructura completa a esta semana</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPresetModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto scroll-y-touch p-5 space-y-3 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                {allSplits.map((split) => (
                  <div
                    key={split.id}
                    className="p-3.5 bg-[var(--canvas)] border border-[var(--border)] hover:border-[var(--accent)] rounded-2xl flex flex-col gap-2 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[var(--text)]">{split.name}</h4>
                        <p className="text-[10px] text-[var(--text-muted)] mt-0.5 leading-relaxed">
                          {split.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplySplitTemplate(split)}
                        className="px-3 py-1.5 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] font-bold text-xs rounded-xl transition-colors shrink-0 shadow-sm"
                      >
                        Aplicar
                      </button>
                    </div>

                    {/* Schedule preview tags */}
                    <div className="flex items-center gap-1 pt-1 border-t border-[var(--border)]">
                      {dayNames.map(({ day, short }) => {
                        const rId = split.schedule[day];
                        const isR = !rId || rId === 'REST';
                        const found = split.routines.find(r => r.id === rId);

                        return (
                          <div
                            key={day}
                            className={`flex-1 text-center py-1 rounded text-[9px] font-mono font-semibold ${
                              isR ? 'bg-[var(--surface)] text-[var(--text-faint)]' : 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-border)]'
                            }`}
                          >
                            <div>{short}</div>
                            <div className="text-[8px] truncate">{isR ? 'Off' : (found?.shortName || 'Gym')}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
