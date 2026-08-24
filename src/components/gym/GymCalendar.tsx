import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CalendarDays, ChevronDown, ChevronUp, Dumbbell, Sparkles, Coffee } from 'lucide-react';
import { WorkoutSplit, WorkoutRoutine, GymDayLog } from '../../types';
import { formatDateKey, parseDateKey, getWeekDays, getMonthDays } from '../WeeklyCalendar';

interface GymCalendarProps {
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  activeSplit: WorkoutSplit;
  gymLogs: Record<string, GymDayLog>;
  onOpenSplitSelector: () => void;
  customWeekSchedules?: Record<string, Record<number, string>>;
}

const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function GymCalendar({
  selectedDate,
  onSelectDate,
  activeSplit,
  gymLogs,
  onOpenSplitSelector,
  customWeekSchedules = {},
}: GymCalendarProps) {
  const [isMonthView, setIsMonthView] = useState(false);
  const selectedParsed = parseDateKey(selectedDate);
  const today = new Date();
  const todayKey = formatDateKey(today);

  const [currentViewDate, setCurrentViewDate] = useState<Date>(() => selectedParsed);
  const viewYear = currentViewDate.getFullYear();
  const viewMonth = currentViewDate.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleTodayJump = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = new Date();
    setCurrentViewDate(now);
    onSelectDate(formatDateKey(now));
  };

  // Helper to get assigned routine for a specific Date
  const getRoutineForDate = (date: Date): { routine: WorkoutRoutine | null; isRest: boolean; label: string } => {
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday
    const mondayOfDateWeek = getWeekDays(date)[0];
    const weekKey = formatDateKey(mondayOfDateWeek);
    const schedule = customWeekSchedules[weekKey] || activeSplit.schedule;
    const routineId = schedule[dayOfWeek];

    if (!routineId || routineId === 'REST') {
      return { routine: null, isRest: true, label: 'Descanso' };
    }

    const found = activeSplit.routines.find(r => r.id === routineId);
    return {
      routine: found || null,
      isRest: false,
      label: found ? found.shortName : 'Rutina'
    };
  };

  const weekDays = getWeekDays(selectedParsed);
  const monthDays = getMonthDays(viewYear, viewMonth);

  return (
    <div className="px-6 mb-6">
      {/* Active Split Ribbon */}
      <div className="flex items-center justify-between bg-gradient-to-r from-orange-950/40 via-amber-950/20 to-slate-900/40 border border-orange-900/30 rounded-2xl p-3 mb-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
            <Dumbbell size={16} className="text-orange-400" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">
              Plan Activo
            </span>
            <p className="text-xs font-semibold text-white truncate">
              {activeSplit.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSplitSelector}
          className="text-[11px] font-medium text-orange-300 hover:text-white px-3 py-1.5 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-xl transition-all flex items-center gap-1.5 shrink-0"
        >
          <Sparkles size={12} className="text-orange-400" />
          <span>Cambiar Plan</span>
        </button>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => {
            if (!isMonthView) {
              setCurrentViewDate(parseDateKey(selectedDate));
            }
            setIsMonthView(!isMonthView);
          }}
          className="flex items-center gap-2 group text-left transition-all"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-white group-hover:text-orange-400 transition-colors">
              {monthNames[viewMonth]} {viewYear}
            </span>
            {isMonthView ? (
              <ChevronUp size={14} className="text-orange-400 transition-transform" />
            ) : (
              <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-transform" />
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-medium px-2 py-0.5 bg-slate-900 border border-slate-800 rounded-full">
            {isMonthView ? 'Mes completo' : 'Semana'}
          </span>
        </button>

        <div className="flex items-center gap-1">
          {isMonthView ? (
            <>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                title="Mes anterior"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleTodayJump}
                className="px-2 py-1 text-[10px] font-semibold text-orange-400 bg-orange-950/40 border border-orange-800/50 rounded-lg hover:bg-orange-900/50 transition-colors"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                title="Mes siguiente"
              >
                <ChevronRight size={14} />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCurrentViewDate(parseDateKey(selectedDate));
                setIsMonthView(true);
              }}
              className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-orange-400 transition-colors px-2.5 py-1 bg-slate-900/60 border border-slate-800/80 rounded-xl"
            >
              <CalendarDays size={13} className="text-orange-400" />
              <span>Ver mes</span>
            </button>
          )}
        </div>
      </div>

      {/* Calendar Views */}
      <AnimatePresence mode="wait">
        {!isMonthView ? (
          /* WEEK VIEW WITH ROUTINE LABELS */
          <motion.div
            key="gym-week-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex items-stretch justify-between gap-1.5"
          >
            {weekDays.map((date, index) => {
              const dateKey = formatDateKey(date);
              const isSelected = dateKey === selectedDate;
              const isToday = dateKey === todayKey;
              const { routine, isRest, label } = getRoutineForDate(date);
              const log = gymLogs[dateKey];
              const isWorkoutDone = log?.isCompleted;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => onSelectDate(dateKey)}
                  className={`flex-1 relative flex flex-col items-center justify-between py-2 px-1 rounded-2xl transition-all text-center min-h-[74px] ${
                    isSelected
                      ? 'bg-gradient-to-b from-slate-800 to-slate-850 border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.15)] ring-1 ring-orange-500/40'
                      : 'bg-slate-900/30 border border-slate-800/60 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Day Header */}
                  <span className={`text-[10px] font-bold ${
                    isSelected ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {dayNames[index]}
                  </span>

                  {/* Day Number */}
                  <span className={`text-sm font-semibold my-0.5 ${
                    isSelected ? 'text-white font-bold' : isToday ? 'text-orange-400' : 'text-slate-300'
                  }`}>
                    {date.getDate()}
                  </span>

                  {/* Routine pill badge */}
                  <div className="w-full mt-0.5 flex flex-col items-center">
                    <span className={`text-[8px] font-bold px-1 py-0.5 rounded leading-tight w-full truncate block ${
                      isWorkoutDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isRest
                          ? 'bg-slate-800/50 text-slate-500'
                          : isSelected
                            ? 'bg-orange-500 text-slate-950 font-black'
                            : 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                    }`}>
                      {isWorkoutDone ? '✓ Hecho' : label}
                    </span>
                  </div>
                </button>
              );
            })}
          </motion.div>
        ) : (
          /* FULL MONTH VIEW */
          <motion.div
            key="gym-month-view"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-3.5 shadow-xl backdrop-blur-sm overflow-hidden"
          >
            {/* Headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2 pb-2 border-b border-slate-800/60">
              {dayNames.map(day => (
                <span key={day} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {day}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map(({ date, isCurrentMonth }) => {
                const dateKey = formatDateKey(date);
                const isSelected = dateKey === selectedDate;
                const isToday = dateKey === todayKey;
                const { isRest, label } = getRoutineForDate(date);
                const log = gymLogs[dateKey];
                const isWorkoutDone = log?.isCompleted;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => onSelectDate(dateKey)}
                    className={`relative flex flex-col items-center justify-between p-1 h-12 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-slate-800 border border-orange-500/50 text-white font-semibold ring-1 ring-orange-500/40'
                        : isToday
                          ? 'bg-orange-950/20 border border-orange-800/40 text-orange-400'
                          : isCurrentMonth
                            ? 'text-slate-300 hover:bg-slate-800/50'
                            : 'text-slate-600 opacity-40 hover:bg-slate-900/30'
                    }`}
                  >
                    <span className="text-xs">{date.getDate()}</span>

                    {/* Tag badge or indicator */}
                    <div className="w-full text-center">
                      {isWorkoutDone ? (
                        <span className="text-[7px] font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-1 py-0.2 rounded block truncate">
                          ✓ Hecho
                        </span>
                      ) : !isRest && isCurrentMonth ? (
                        <span className={`text-[7px] font-semibold px-0.5 py-0.2 rounded block truncate ${
                          isSelected ? 'bg-orange-500/20 text-orange-300' : 'text-orange-400/80'
                        }`}>
                          {label}
                        </span>
                      ) : (
                        <div className="h-1" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 px-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] text-orange-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" /> Rutina
                </span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Completado
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMonthView(false)}
                className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
              >
                Volver a semana
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
