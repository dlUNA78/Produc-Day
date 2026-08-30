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

  // Month navigation state
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

  // Week days centered on selected date
  const weekDays = getWeekDays(selectedParsed);
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
          {isMonthView ? (
            <>
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
                title="Mes anterior"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={handleTodayJump}
                className="px-2 py-1 text-[10px] font-semibold text-[var(--text)] bg-[var(--accent-soft)] border border-[white]/20 rounded-lg hover:bg-[var(--accent)]/20 transition-colors"
              >
                Hoy
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg bg-[var(--canvas)] border border-[var(--border)] flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text)] hover:border-[var(--border-strong)] transition-colors"
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
                className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] hover:text-[var(--text)] transition-colors px-2 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-xl"
            >
              <CalendarDays size={13} className="text-[var(--accent)]" />
              <span>Ver mes</span>
            </button>
          )}
        </div>
      </div>

      {/* Calendar Views with Animation */}
      <AnimatePresence mode="wait">
        {!isMonthView ? (
          /* WEEK VIEW */
          <motion.div
            key="week-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between"
          >
            {weekDays.map((date, index) => {
              const dateKey = formatDateKey(date);
              const isSelected = dateKey === selectedDate;
              const isToday = dateKey === todayKey;
              const hasItems = hasItemsForDate ? hasItemsForDate(dateKey) : false;

              return (
                <button
                  key={dateKey}
                  onClick={() => onSelectDate(dateKey)}
                  aria-label={`Seleccionar ${date.getDate()} de ${monthNames[date.getMonth()]}`}
                  aria-pressed={isSelected}
                  className={`relative flex flex-col items-center justify-center w-11 h-14 rounded-[16px] border transition-all ${
                    isSelected
                      ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-ink)]'
                      : 'bg-transparent border-transparent hover:bg-[var(--surface)]'
                  }`}
                >
                  <span className={`text-[10px] font-bold mb-1 ${
                    isSelected ? 'text-[var(--accent-ink)] opacity-70' : 'text-[var(--text-faint)]'
                  }`}>
                    {dayNames[index]}
                  </span>
                  <span className={`text-sm font-semibold ${
                    isSelected ? 'text-[var(--accent-ink)]' : isToday ? 'text-[var(--text)]' : 'text-[var(--text-muted)]'
                  }`}>
                    {date.getDate()}
                  </span>

                  {/* Indicator dots */}
                  <div className="flex items-center gap-1 mt-0.5 h-1">
                    {hasItems && (
                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-[var(--accent-ink)]' : 'bg-[var(--accent)]'}`} />
                    )}
                    {isToday && !hasItems && (
                      <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[var(--canvas)]' : 'bg-[var(--surface-soft)]'}`} />
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        ) : (
          /* FULL MONTH VIEW */
          <motion.div
            key="month-view"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-[18px] p-3.5 shadow-[var(--shadow-soft)] overflow-hidden"
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
                    className={`relative flex flex-col items-center justify-center h-10 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-semibold shadow-sm shadow-[var(--shadow-soft)]'
                        : isToday
                          ? 'bg-[var(--accent-soft)] text-[var(--text)]'
                          : isCurrentMonth
                            ? 'text-[var(--text)] hover:bg-[var(--surface)]'
                            : 'text-[var(--text-faint)] hover:bg-[var(--surface)]'
                    }`}
                  >
                    <span className="text-xs">{date.getDate()}</span>

                    {/* Event Dot */}
                    <div className="h-1 flex items-center justify-center mt-0.5">
                      {hasItems && (
                        <div className={`w-1 h-1 rounded-full ${isSelected ? 'bg-[var(--canvas)]' : 'bg-[var(--accent)]'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-[var(--border)]/60 flex items-center justify-between text-[11px] text-[var(--text-faint)] px-1">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-[10px] text-[var(--text-faint)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" /> Con actividades
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMonthView(false)}
                className="text-[var(--text)] hover:text-[var(--text)]/80 font-medium transition-colors"
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
