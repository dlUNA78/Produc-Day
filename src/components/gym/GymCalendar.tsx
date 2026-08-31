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
      <div className="flex items-center justify-between bg-[var(--surface-raised)] border border-[var(--accent-border)] rounded-2xl p-3 mb-4">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-border)] flex items-center justify-center shrink-0">
            <Dumbbell size={16} className="text-[var(--accent)]" />
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest block">
              Plan Activo
            </span>
            <p className="text-xs font-semibold text-[var(--text)] truncate">
              {activeSplit.name}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSplitSelector}
          className="text-[11px] font-medium text-[var(--accent)] hover:text-[var(--text)] px-3 py-1.5 bg-[var(--accent-soft)] hover:bg-[var(--accent-soft)] border border-[var(--accent-border)] rounded-xl transition-all flex items-center gap-1.5 shrink-0"
        >
          <Sparkles size={12} className="text-[var(--accent)]" />
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
            <span className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-strong)] transition-colors">
              {monthNames[viewMonth]} {viewYear}
            </span>
            {isMonthView ? (
              <ChevronUp size={14} className="text-[var(--accent)] transition-transform" />
            ) : (
              <ChevronDown size={14} className="text-[var(--text-muted)] group-hover:text-[var(--text)] transition-transform" />
            )}
          </div>
          <span className="text-[10px] text-[var(--text-faint)] font-medium px-2 py-0.5 bg-[var(--surface)] border border-[var(--border)] rounded-full">
            {isMonthView ? 'Mes completo' : 'Semana'}
          </span>
        </button>

        <div className="flex items-center gap-1">
          {isMonthView ? (
            <>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
                title="Mes anterior"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleTodayJump}
                className="px-2 py-1 text-[10px] font-semibold text-[var(--accent)] bg-[var(--accent-soft)] border border-[var(--accent-border)] rounded-lg hover:bg-[var(--accent-soft)] transition-colors"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
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
              className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--accent-strong)] transition-colors px-2.5 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl"
            >
              <CalendarDays size={13} className="text-[var(--accent)]" />
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
                      ? 'bg-[var(--surface-raised)] border border-[var(--accent-border)] shadow-md ring-1 ring-[var(--accent-border)]'
                      : 'bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-muted)]'
                  }`}
                >
                  {/* Day Header */}
                  <span className={`text-[10px] font-bold ${
                    isSelected ? 'text-[var(--text)]' : 'text-[var(--text-faint)]'
                  }`}>
                    {dayNames[index]}
                  </span>

                  {/* Day Number */}
                  <span className={`text-sm font-semibold my-0.5 ${
                    isSelected ? 'text-[var(--text)] font-bold' : isToday ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                  }`}>
                    {date.getDate()}
                  </span>

                  {/* Routine pill badge */}
                  <div className="w-full mt-0.5 flex flex-col items-center">
                    <span className={`text-[8px] font-bold px-1 py-0.5 rounded leading-tight w-full truncate block ${
                      isWorkoutDone
                        ? 'bg-[var(--success-soft)] text-[var(--success)] border border-[var(--success-border)]'
                        : isRest
                          ? 'bg-[var(--surface-raised)] text-[var(--text-faint)]'
                          : isSelected
                            ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-semibold'
                            : 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-border)]'
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
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-3.5 shadow-xl backdrop-blur-sm overflow-hidden"
          >
            {/* Headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2 pb-2 border-b border-[var(--border)]">
              {dayNames.map(day => (
                <span key={day} className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider">
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
                        ? 'bg-[var(--surface-raised)] border border-[var(--accent-border)] text-[var(--text)] font-semibold ring-1 ring-[var(--accent-border)]'
                        : isToday
                          ? 'bg-[var(--accent-soft)] border border-[var(--accent-border)] text-[var(--accent)]'
                          : isCurrentMonth
                            ? 'text-[var(--text)] hover:bg-[var(--surface-muted)]'
                            : 'text-[var(--text-faint)] opacity-40 hover:bg-[var(--surface-muted)]'
                    }`}
                  >
                    <span className="text-xs">{date.getDate()}</span>

                    {/* Tag badge or indicator */}
                    <div className="w-full text-center">
                      {isWorkoutDone ? (
                        <span className="text-[7px] font-bold text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-border)] px-1 py-0.2 rounded block truncate">
                          ✓ Hecho
                        </span>
                      ) : !isRest && isCurrentMonth ? (
                        <span className={`text-[7px] font-semibold px-0.5 py-0.2 rounded block truncate ${
                          isSelected ? 'bg-[var(--accent-soft)] text-[var(--accent)]' : 'text-[var(--accent)]'
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

            <div className="mt-3 pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)] px-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-[10px] text-[var(--accent)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" /> Rutina
                </span>
                <span className="flex items-center gap-1 text-[10px] text-[var(--success)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] inline-block" /> Completado
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMonthView(false)}
                className="text-[var(--accent)] hover:text-[var(--accent-strong)] font-medium transition-colors"
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
