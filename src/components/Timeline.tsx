import React from 'react';
import { Activity, Task } from '../types';
import TimelineItem, { UnifiedAgendaItem } from './TimelineItem';
import { motion } from 'motion/react';
import { CalendarCheck, PlusCircle } from 'lucide-react';

interface TimelineProps {
  activities: Activity[];
  tasks: Task[];
  currentActivityId?: string;
  onToggleItem: (id: string, type: 'activity' | 'task') => void;
  onOpenCreate?: () => void;
  onOpenItem?: (id: string, type: 'activity' | 'task') => void;
}

export default function Timeline({ activities, tasks, currentActivityId, onToggleItem, onOpenCreate, onOpenItem }: TimelineProps) {
  // Convert activities and tasks into unified agenda items
  const agendaItems: UnifiedAgendaItem[] = [
    ...activities.map(a => ({
      id: a.id,
      type: 'activity' as const,
      title: a.title,
      category: a.category,
      date: a.date,
      timeDisplay: `${a.startTime} - ${a.endTime}`,
      rawTime: a.startTime,
      isCompleted: a.isCompleted,
      description: a.description,
    })),
    ...tasks.map(t => ({
      id: t.id,
      type: 'task' as const,
      title: t.title,
      category: t.category || ('Task' as const),
      date: t.date,
      timeDisplay: t.time ? t.time : 'Tarea del día',
      rawTime: t.time || '23:59',
      isCompleted: t.isCompleted,
      description: t.description,
    }))
  ];

  // Sort chronologically: items with times first, then all-day tasks, non-completed before completed
  agendaItems.sort((a, b) => {
    // If one is completed and one isn't
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    // Compare times
    const timeA = a.rawTime || '99:99';
    const timeB = b.rawTime || '99:99';
    return timeA.localeCompare(timeB);
  });

  const completedCount = agendaItems.filter(i => i.isCompleted).length;
  const totalCount = agendaItems.length;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
      className="flex-1 overflow-hidden mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-[var(--text)]">
          Tu agenda
        </h2>
        {totalCount > 0 && (
          <span className="text-xs text-[var(--text-muted)] px-2.5 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-full">
            {completedCount}/{totalCount} listas
          </span>
        )}
      </div>
      
      {agendaItems.length === 0 ? (
        <div className="border border-dashed border-[var(--border)] rounded-[20px] p-6 text-center mt-2 flex flex-col items-center">
          <CalendarCheck size={30} className="text-[var(--text-faint)] mb-3" strokeWidth={1.5} />
          <p className="text-[var(--text)] text-sm font-medium">Tu agenda está despejada</p>
          <p className="text-[var(--text-muted)] text-xs leading-5 mt-1 max-w-[240px]">
            Agrega una tarea o actividad con el botón <span className="text-[var(--text)] font-semibold">(+)</span> para verla en tu agenda.
          </p>
          {onOpenCreate && (
            <button
              onClick={onOpenCreate}
              className="mt-4 flex items-center gap-1.5 px-3 py-2 bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text)] rounded-xl text-xs font-medium hover:border-[var(--accent)] transition-colors"
            >
              <PlusCircle size={14} />
              <span>Añadir entrada</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-0 relative pt-1">
          <div className="absolute left-[7px] top-3 bottom-4 w-px bg-[var(--border)]"></div>
          {agendaItems.map((item, index) => (
            <TimelineItem 
              key={`${item.type}-${item.id}`} 
              item={item} 
              isLast={index === agendaItems.length - 1}
              isActive={item.id === currentActivityId && !item.isCompleted}
              onToggle={onToggleItem}
              onOpen={onOpenItem}
            />
          ))}
        </div>
      )}
    </motion.section>
  );
}
