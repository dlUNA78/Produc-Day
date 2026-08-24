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
              <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                {isCurrentWeek ? 'Semana Actual' : 'Planificación'}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {formatRange()}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              Planificador de la Semana
            </h2>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={handlePrevWeek}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Semana anterior"
            >
              <ChevronLeft size={16} />
            </button>
            {!isCurrentWeek && (
              <button
                type="button"
                onClick={handleCurrentWeek}
                className="px-2 py-1 text-[10px] font-bold text-orange-400 hover:bg-slate-900 rounded-md"
              >
                Hoy
              </button>
            )}
            <button
              type="button"
              onClick={handleNextWeek}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
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
            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-semibold text-orange-400 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles size={14} />
            <span>Cargar Plantilla de Semana</span>
          </button>

          <button
            type="button"
            onClick={onOpenCreateRoutine}
            className="py-2 px-3 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl text-xs font-semibold text-orange-300 flex items-center gap-1.5 transition-colors"
          >
            <Dumbbell size={14} />
            <span>+ Nueva Rutina</span>
          </button>
        </div>
      </div>

      {/* 2. Summary stats for this week */}
      <div className="grid grid-cols-3 gap-2 bg-gradient-to-br from-slate-900/60 to-[#121212] border border-slate-800/80 rounded-2xl p-3">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Entrenamientos</span>
          <span className="text-lg font-black text-white">{totalWorkouts} / 7 días</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Series Totales</span>
          <span className="text-lg font-black text-orange-400 font-mono">{totalSets} series</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Tiempo Proyectado</span>
          <span className="text-lg font-black text-white font-mono">~{Math.round(totalEstimatedMinutes / 60 * 10) / 10}h</span>
        </div>
      </div>

      {/* 3. 7-Day Interactive Assignment Grid */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest px-1">
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
              className={`bg-slate-900/40 border rounded-2xl p-3.5 transition-all flex flex-col gap-2.5 ${
                isToday
                  ? 'border-orange-500/50 bg-gradient-to-r from-orange-950/20 to-slate-900/60 shadow-[0_0_15px_rgba(249,115,22,0.08)]'
                  : isRest
                    ? 'border-slate-800/60 opacity-80'
                    : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md font-mono ${
                    isToday ? 'bg-orange-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {short} {dateObj.getDate()}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {name}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider bg-orange-500/10 px-1.5 py-0.2 rounded border border-orange-500/20">
                      Hoy
                    </span>
                  )}
                </div>

                {/* Change Routine Button */}
                <button
                  type="button"
                  onClick={() => setActiveDayPicker(day)}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-800 hover:border-orange-500/50 text-slate-300 hover:text-orange-400 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit2 size={12} />
                  <span>{isRest ? 'Asignar' : 'Cambiar'}</span>
                </button>
              </div>

              {/* Routine Content or Rest */}
              {isRest ? (
                <div 
                  onClick={() => setActiveDayPicker(day)}
                  className="flex items-center gap-2.5 p-2 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl cursor-pointer hover:bg-slate-900/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                    <Coffee size={15} />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-400">Descanso / Recuperación activa</span>
                    <p className="text-[10px] text-slate-400">Toca para programar un entrenamiento</p>
                  </div>
                </div>
              ) : routine ? (
                <div className="flex flex-col gap-2 p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-orange-400 uppercase bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md font-mono">
                        {routine.shortName}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                        {routine.name}
                      </h4>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {routine.exercises.length} ejercicios • {routine.estimatedMinutes || 60}m
                    </span>
                  </div>

                  {/* Muscle tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {routine.targetMuscles.map(m => (
                      <span
                        key={m}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                          muscleColors[m] || 'bg-slate-800 text-slate-400'
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
                      className="text-[10px] font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 hover:underline"
                    >
                      <Layers size={11} />
                      <span>Ver / Modificar ejercicios</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-red-400 p-2 bg-red-950/20 border border-red-900/30 rounded-xl">
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
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveDayPicker(null)}
              className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-[#0E0E0E] border-t sm:border border-slate-800/80 rounded-t-[32px] sm:rounded-3xl p-6 pb-8 w-full max-w-md max-h-[85vh] overflow-y-auto scrollbar-hide flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Calendar size={16} className="text-orange-400" />
                    Asignar para {dayNames.find(d => d.day === activeDayPicker)?.name}
                  </h3>
                  <p className="text-xs text-slate-500">¿Qué entrenamiento harás este día?</p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDayPicker(null)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
                >
                  Cerrar
                </button>
              </div>

              <div className="flex flex-col gap-2">
                {/* Option 1: Rest Day */}
                <button
                  type="button"
                  onClick={() => handleSetDayRoutine(activeDayPicker, 'REST')}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    currentWeekSchedule[activeDayPicker] === 'REST' || !currentWeekSchedule[activeDayPicker]
                      ? 'bg-slate-800/70 border-orange-500/50 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                      <Coffee size={16} />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Día de Descanso</div>
                      <div className="text-[10px] text-slate-500">Recuperación muscular activa</div>
                    </div>
                  </div>

                  {(currentWeekSchedule[activeDayPicker] === 'REST' || !currentWeekSchedule[activeDayPicker]) && (
                    <div className="w-5 h-5 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center">
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
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-orange-950/20 border-orange-500/60 text-white shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                          <Dumbbell size={16} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.2 rounded font-mono">
                              {rt.shortName}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {rt.name}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {rt.exercises.length} ejercicios • {rt.estimatedMinutes || 60}m • {rt.targetMuscles.slice(0, 3).join(', ')}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center">
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
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPresetModalOpen(false)}
              className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-[#0E0E0E] border-t sm:border border-slate-800/80 rounded-t-[32px] sm:rounded-3xl p-6 pb-8 w-full max-w-md max-h-[85vh] overflow-y-auto scrollbar-hide flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-orange-400" />
                    Plantillas de Semana
                  </h3>
                  <p className="text-xs text-slate-500">Aplica una estructura completa a esta semana</p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsPresetModalOpen(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg"
                >
                  Cerrar
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {allSplits.map((split) => (
                  <div
                    key={split.id}
                    className="p-3.5 bg-slate-950 border border-slate-800 hover:border-orange-500/40 rounded-2xl flex flex-col gap-2 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white">{split.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                          {split.description}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleApplySplitTemplate(split)}
                        className="px-3 py-1.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0 shadow-sm"
                      >
                        Aplicar
                      </button>
                    </div>

                    {/* Schedule preview tags */}
                    <div className="flex items-center gap-1 pt-1 border-t border-slate-800/60">
                      {dayNames.map(({ day, short }) => {
                        const rId = split.schedule[day];
                        const isR = !rId || rId === 'REST';
                        const found = split.routines.find(r => r.id === rId);

                        return (
                          <div
                            key={day}
                            className={`flex-1 text-center py-1 rounded text-[9px] font-mono font-semibold ${
                              isR ? 'bg-slate-900 text-slate-500' : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
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
