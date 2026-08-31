import React from 'react';
import Header from '../components/Header';
import WeeklyCalendar, { formatDateKey, parseDateKey } from '../components/WeeklyCalendar';
import Timeline from '../components/Timeline';
import { Activity, Task } from '../types';
import { Check, Plus, CircleDashed, Clock3, ListTodo, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  activities: Activity[];
  tasks: Task[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onToggleItem: (id: string, type: 'activity' | 'task') => void;
  onOpenCreate: () => void;
  onOpenItem: (id: string, type: 'activity' | 'task') => void;
  userName?: string;
  userAvatar?: string;
  onOpenProfile?: () => void;
  onNavigateToGym?: () => void;
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
  onOpenItem,
  userName,
  userAvatar,
  onOpenProfile,
  onNavigateToGym,
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
      label: item.category,
    })),
    ...filteredTasks.filter((item) => !item.isCompleted).map((item) => ({
      id: item.id,
      type: 'task' as const,
      title: item.title,
      time: item.time || '',
      label: 'Tarea',
    })),
  ].sort((a, b) => a.time.localeCompare(b.time));

  const totalItems = filteredActivities.length + filteredTasks.length;
  const completedItems = [...filteredActivities, ...filteredTasks].filter((item) => item.isCompleted).length;
  const progress = totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
  const nextItem = pendingItems[0];

  const hasItemsForDate = (dateKey: string) =>
    activities.some((item) => item.date === dateKey) || tasks.some((item) => item.date === dateKey);

  return (
    <div className="flex-1 flex flex-col pb-6">
      <Header 
        userName={userName}
        userAvatar={userAvatar}
        onOpenProfile={onOpenProfile}
        onNavigateToGym={onNavigateToGym}
        pendingTasksCount={pendingItems.length}
      />

      <main>
        <div className="px-4">
          <WeeklyCalendar
            selectedDate={selectedDate}
            onSelectDate={onSelectDate}
            hasItemsForDate={hasItemsForDate}
          />
        </div>

        <div className="px-4 mt-7 space-y-7">
          {nextItem ? (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[24px] border border-[var(--border)] p-6 bg-gradient-to-br from-[var(--surface-soft)] to-[var(--accent-soft)]"
            >
              <h3 className="text-[11px] font-bold text-[var(--accent)] uppercase tracking-widest mb-3">Lo siguiente</h3>
              
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[22px] font-bold text-[var(--text)] truncate leading-tight tracking-tight">{nextItem.title}</p>
                  
                  <div className="flex items-center gap-3 mt-2.5 text-[13px] font-medium text-[var(--text-muted)]">
                    {nextItem.time && (
                      <span className="flex items-center gap-1.5"><Clock3 size={14} /> {nextItem.time}</span>
                    )}
                    <span className="flex items-center gap-1.5"><ListTodo size={14} /> {nextItem.label}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => onToggleItem(nextItem.id, nextItem.type)}
                  aria-label={`Completar ${nextItem.title}`}
                  className="shrink-0 w-[52px] h-[52px] rounded-full bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text)] flex items-center justify-center hover:bg-[var(--surface-soft)] transition-colors"
                >
                  <ArrowUpRight size={24} strokeWidth={2.5} />
                </button>
              </div>
            </motion.section>
          ) : totalItems === 0 ? (
            <section className="rounded-[24px] bg-[var(--surface)] border border-[var(--border)] p-8 text-center flex flex-col items-center">
              <h3 className="text-[18px] font-bold text-[var(--text)]">Tu día está libre</h3>
              <p className="mt-2 text-[14px] text-[var(--text-muted)] max-w-[240px]">
                No tienes tareas ni actividades todavía.
              </p>
              <button onClick={onOpenCreate} className="mt-6 font-semibold text-[var(--accent)] text-[15px] hover:text-[var(--accent-hover)] transition-colors">
                + Crear primera entrada
              </button>
            </section>
          ) : (
            <section className="rounded-[24px] bg-[var(--surface)] border border-[var(--border)] p-6 flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[18px] bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center">
                  <Check size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-[var(--text)]">Todo listo</h3>
                  <p className="mt-1 text-[14px] text-[var(--text-muted)]">
                    Completaste tu agenda.
                  </p>
                </div>
              </div>
            </section>
          )}

          <Timeline activities={filteredActivities} tasks={filteredTasks} onToggleItem={onToggleItem} onOpenCreate={onOpenCreate} onOpenItem={onOpenItem} />

          {totalItems > 0 && (
            <section aria-label="Resumen del día" className="rounded-[24px] bg-[var(--surface)] border border-[var(--border)] p-6">
              <h3 className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest mb-5">Progreso de hoy</h3>
              
              <div className="flex items-center gap-6">
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--surface-raised)" strokeWidth="12" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke="var(--accent)" strokeWidth="12" strokeDasharray="264" strokeDashoffset={264 - (264 * progress) / 100} className="transition-all duration-700 ease-out" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[20px] font-bold text-[var(--text)] leading-none">{progress}%</span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-2">
                  <div>
                    <div className="flex items-center gap-1.5 text-[var(--text-faint)] mb-1">
                      <Check size={14} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">Completas</span>
                    </div>
                    <span className="text-[18px] font-bold text-[var(--text)]">{completedItems}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[var(--text-faint)] mb-1">
                      <ListTodo size={14} />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">Total</span>
                    </div>
                    <span className="text-[18px] font-bold text-[var(--text)]">{totalItems}</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
