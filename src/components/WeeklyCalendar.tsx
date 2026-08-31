import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';

interface WeeklyCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
  hasItemsForDate?: (dateKey: string) => boolean;
}

export function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDateKey(dateKey: string): Date {
  const [y, m, d] = dateKey.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getWeekDays(referenceDate: Date) {
  const date = new Date(referenceDate);
  const day = date.getDay(); // 0 is Sunday, 1 is Monday
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date.getFullYear(), date.getMonth(), diff);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    week.push(nextDay);
  }
  return week;
}

export function getMonthDays(year: number, month: number) {
  // month is 0-indexed (0 = Jan, 11 = Dec)
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Find Monday of the first week
  const startDay = firstDayOfMonth.getDay(); // 0 is Sun, 1 is Mon
  const startOffset = (startDay === 0 ? -6 : 1) - startDay;
  const startDate = new Date(year, month, 1 + startOffset);

  // Find Sunday of the last week
  const endDay = lastDayOfMonth.getDay();
  const endOffset = (endDay === 0 ? 0 : 7 - endDay);
  const endDate = new Date(year, month + 1, endOffset);

  const days: { date: Date; isCurrentMonth: boolean }[] = [];
  const current = new Date(startDate);

  while (current <= endDate || days.length % 7 !== 0 || days.length < 35) {
    days.push({
      date: new Date(current),
      isCurrentMonth: current.getMonth() === month
    });
    current.setDate(current.getDate() + 1);
    if (current > endDate && days.length % 7 === 0) break;
  }

  return days;
}

const dayNames = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function WeeklyCalendar({ selectedDate, onSelectDate, hasItemsForDate }: WeeklyCalendarProps) {
  const [isMonthView, setIsMonthView] = useState(false);

  // Selected date parsed
  const selectedParsed = parseDateKey(selectedDate);
  const today = new Date();
  const todayKey = formatDateKey(today);

  // View date state
  const [currentViewDate, setCurrentViewDate] = useState<Date>(() => selectedParsed);

  // Sync currentViewDate when selectedDate changes from outside
  React.useEffect(() => {
    setCurrentViewDate(parseDateKey(selectedDate));
  }, [selectedDate]);

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

  const handlePrevWeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    const prev = new Date(currentViewDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentViewDate(prev);
  };

  const handleNextWeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = new Date(currentViewDate);
    next.setDate(next.getDate() + 7);
    setCurrentViewDate(next);
  };

  const handleTodayJump = (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = new Date();
    setCurrentViewDate(now);
    onSelectDate(formatDateKey(now));
  };

  // Week days centered on current view date
  const weekDays = getWeekDays(currentViewDate);
  const monthDays = getMonthDays(viewYear, viewMonth);

  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="px-5 mb-5"
    >
      {/* Calendar Header & View Switcher */}
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
            <span className="text-sm font-semibold text-[var(--text)] transition-colors">
              {monthNames[viewMonth]} {viewYear}
            </span>
            {isMonthView ? (
              <ChevronUp size={14} className="text-[var(--accent)] transition-transform" />
            ) : (
              <ChevronDown size={14} className="text-[var(--text-faint)] group-hover:text-[var(--text)] transition-transform" />
            )}
          </div>
          <span className="text-[10px] text-[var(--text-muted)] font-medium px-2 py-0.5 bg-[var(--surface)] border border-[var(--border)] rounded-full">
            {isMonthView ? 'Mes completo' : 'Semana'}
          </span>
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={isMonthView ? handlePrevMonth : handlePrevWeek}
            className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
            title={isMonthView ? "Mes anterior" : "Semana anterior"}
            aria-label={isMonthView ? "Mes anterior" : "Semana anterior"}
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
            onClick={isMonthView ? handleNextMonth : handleNextWeek}
            className="w-7 h-7 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
            title={isMonthView ? "Mes siguiente" : "Semana siguiente"}
            aria-label={isMonthView ? "Mes siguiente" : "Semana siguiente"}
          >
            <ChevronRight size={14} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isMonthView) {
                setCurrentViewDate(parseDateKey(selectedDate));
              }
              setIsMonthView(!isMonthView);
            }}
            className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-2 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl ml-1"
          >
            <CalendarDays size={13} className="text-[var(--accent)]" />
            <span>{isMonthView ? 'Semana' : 'Mes'}</span>
          </button>
        </div>
      </div>

      {/* Calendar Views with Animation */}
      <AnimatePresence mode="wait">
        {!isMonthView ? (
          /* WEEK VIEW - Scrollable & Touch Friendly */
          <motion.div
            key="week-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full overflow-x-auto scroll-x-touch scrollbar-hide py-1"
          >
            <div className="flex items-stretch justify-between gap-1.5 min-w-full">
              {weekDays.map((date, index) => {
                const dateKey = formatDateKey(date);
                const isSelected = dateKey === selectedDate;
                const isToday = dateKey === todayKey;
                const hasItems = hasItemsForDate ? hasItemsForDate(dateKey) : false;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => onSelectDate(dateKey)}
                    aria-label={`Seleccionar ${date.getDate()} de ${monthNames[date.getMonth()]}`}
                    aria-pressed={isSelected}
                    className={`shrink-0 flex-1 min-w-[44px] sm:min-w-[48px] relative flex flex-col items-center justify-center h-[62px] rounded-[16px] transition-all ${
                      isSelected
                        ? 'bg-[var(--accent)] text-[var(--accent-ink)] shadow-md shadow-[var(--accent-soft)] ring-1 ring-[var(--accent-border)]'
                        : isToday
                          ? 'bg-[var(--surface-raised)] border border-[var(--border-strong)] text-[var(--text)]'
                          : 'bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-raised)] text-[var(--text)]'
                    }`}
                  >
                    <span className={`text-[10px] font-bold tracking-wider mb-1 ${
                      isSelected ? 'text-[var(--accent-ink)] opacity-85' : 'text-[var(--text-faint)]'
                    }`}>
                      {dayNames[index]}
                    </span>
                    <span className={`text-base font-bold ${
                      isSelected ? 'text-[var(--accent-ink)]' : isToday ? 'text-[var(--accent)]' : 'text-[var(--text)]'
                    }`}>
                      {date.getDate()}
                    </span>

                    {/* Indicator dots */}
                    <div className="absolute bottom-1.5 flex items-center gap-1">
                      {hasItems && (
                        <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[var(--accent-ink)]' : 'bg-[var(--accent)]'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* FULL MONTH VIEW */
          <motion.div
            key="month-view"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="bg-[var(--canvas)] border border-[var(--border)]/80 rounded-md p-3.5 shadow-xl backdrop-blur-sm overflow-hidden"
          >
            {/* Day name headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-2 pb-2 border-b border-[var(--border)]/60">
              {dayNames.map(day => (
                <span key={day} className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-wider">
                  {day}
                </span>
              ))}
            </div>

            {/* Month Day Cells */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map(({ date, isCurrentMonth }) => {
                const dateKey = formatDateKey(date);
                const isSelected = dateKey === selectedDate;
                const isToday = dateKey === todayKey;
                const hasItems = hasItemsForDate ? hasItemsForDate(dateKey) : false;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => {
                      onSelectDate(dateKey);
                    }}
                    className={`relative flex flex-col items-center justify-center h-11 rounded-[12px] transition-all ${
                      isSelected
                        ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-bold shadow-md shadow-[var(--accent-soft)]'
                        : isToday
                          ? 'bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--accent)] font-semibold'
                          : isCurrentMonth
                            ? 'text-[var(--text)] hover:bg-[var(--surface-raised)] font-medium'
                            : 'text-[var(--text-faint)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    <span className="text-[13px]">{date.getDate()}</span>

                    {/* Event Dot */}
                    <div className="absolute bottom-1.5 flex items-center gap-1">
                      {hasItems && (
                        <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[var(--accent-ink)] opacity-90' : 'bg-[var(--text-muted)]'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] text-[var(--text-faint)] px-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-faint)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[white] inline-block" /> Con actividades
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMonthView(false)}
                className="text-[white] hover:text-[white]/80 font-medium transition-colors"
              >
                Volver a vista semanal
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
