import React from 'react';
import Header from '../components/Header';
import WeeklyCalendar, { formatDateKey, parseDateKey } from '../components/WeeklyCalendar';
import Timeline from '../components/Timeline';
import { Activity, Task } from '../types';
import { ArrowUpRight, Check, Clock3, ListTodo, Plus } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  activities: Activity[];
  tasks: Task[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onToggleItem: (id: string, type: 'activity' | 'task') => void;
  onOpenCreate: () => void;
  onOpenItem: (id: string, type: 'activity' | 'task') => void;
}

const longDate = new Intl.DateTimeFormat('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export default function HomeView({
  activities,
  tasks,
  selectedDate,
  onSelectDate,
  onToggleItem,
  onOpenCreate,
}: HomeViewProps) {
  const filteredActivities = activities.filter((activity) => activity.date === selectedDate);
  const filteredTasks = tasks.filter((task) => task.date === selectedDate);
  const todayKey = formatDateKey(new Date());
  const isToday = selectedDate === todayKey;

  const pendingItems = [
    ...filteredActivities.filter((item) => !item.isCompleted).map((item) => ({
      id: item.id,
      type: 'activity' as const,
      title: item.title,
      time: item.startTime,
      label: `${item.startTime} · ${item.category}`,
    })),
    ...filteredTasks.filter((item) => !item.isCompleted).map((item) => ({
      id: item.id,
      type: 'task' as const,
      title: item.title,
      time: item.time || '23:59',
      label: item.time ? `${item.time} · Tarea` : 'Sin hora · Tarea',
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  const totalItems = filteredActivities.length + filteredTasks.length;
  const completedItems = [...filteredActivities, ...filteredTasks].filter((item) => item.isCompleted).length;
  const progress = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
  const nextItem = pendingItems[0];

  const hasItemsForDate = (dateKey: string) =>
    activities.some((item) => item.date === dateKey) || tasks.some((item) => item.date === dateKey);

  return (
    <div className="flex-1 flex flex-col pb-24">
      <Header />

      <main>
        <div className="px-5 mb-4">
          <p className="text-[13px] capitalize text-[var(--text-muted)]">
            {isToday ? 'Hoy' : longDate.format(parseDateKey(selectedDate))}
          </p>
          <h2 className="mt-1 text-[28px] leading-tight font-semibold tracking-[-0.03em] text-[var(--text)]">
            {isToday ? 'Haz que hoy cuente.' : 'Planifica con intención.'}
          </h2>
        </div>

        <WeeklyCalendar
          selectedDate={selectedDate}
          onSelectDate={onSelectDate}
          hasItemsForDate={hasItemsForDate}
        />

        <div className="px-5 space-y-5">
          {nextItem ? (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[20px] bg-[var(--surface-raised)] border border-[var(--border)] p-5"
            >
              <div className="absolute left-0 top-5 bottom-5 w-1 rounded-r-full bg-[var(--accent)]" />
              <div className="flex items-start justify-between gap-4 pl-1">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[var(--accent)]">
                    <Clock3 size={15} />
                    <span className="text-xs font-semibold uppercase tracking-[0.12em]">Lo siguiente</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-[var(--text)] truncate">{nextItem.title}</h3>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">{nextItem.label}</p>
                </div>
                <button
                  onClick={() => onToggleItem(nextItem.id, nextItem.type)}
                  aria-label={`Completar ${nextItem.title}`}
                  className="shrink-0 w-11 h-11 rounded-2xl bg-[var(--accent)] text-[#17120e] flex items-center justify-center hover:bg-[var(--accent-strong)] transition-colors"
                >
                  <Check size={20} strokeWidth={2.5} />
                </button>
              </div>
            </motion.section>
          ) : totalItems === 0 ? (
            <section className="rounded-[20px] bg-[var(--surface)] border border-[var(--border)] p-5">
              <div className="w-10 h-10 rounded-2xl bg-[var(--surface-raised)] text-[var(--accent)] flex items-center justify-center mb-4">
                <Plus size={19} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--text)]">Un día con espacio.</h3>
              <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)]">Añade una prioridad o reserva tiempo para lo que importa.</p>
              <button onClick={onOpenCreate} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
                Crear primera entrada <ArrowUpRight size={16} />
              </button>
            </section>
          ) : (
            <section className="rounded-[20px] bg-[var(--surface)] border border-[var(--border)] p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[var(--sage)]/15 text-[var(--sage)] flex items-center justify-center"><Check size={21} /></div>
              <div><h3 className="font-semibold text-[var(--text)]">Todo listo por hoy</h3><p className="text-sm text-[var(--text-muted)]">Completaste tu agenda.</p></div>
            </section>
          )}

          <section aria-label="Resumen del día" className="grid grid-cols-[1fr_auto] gap-4 items-center rounded-[20px] bg-[var(--surface)] border border-[var(--border)] p-5">
            <div>
              <div className="flex items-center gap-2 text-[var(--text-muted)]"><ListTodo size={16} /><span className="text-sm font-medium">Ritmo del día</span></div>
              <p className="mt-3 text-2xl font-semibold text-[var(--text)]">{completedItems}<span className="text-base text-[var(--text-faint)]">/{totalItems}</span></p>
              <div className="mt-3 h-1.5 bg-[var(--surface-muted)] rounded-full overflow-hidden"><div className="h-full bg-[var(--sage)] rounded-full transition-all" style={{ width: `${progress}%` }} /></div>
            </div>
            <span className="text-sm font-semibold text-[var(--sage)]">{progress}%</span>
          </section>

          <Timeline activities={filteredActivities} tasks={filteredTasks} onToggleItem={onToggleItem} onOpenCreate={onOpenCreate} />
        </div>
      </main>
    </div>
  );
}
