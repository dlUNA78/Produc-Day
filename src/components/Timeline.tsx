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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1, ease: 'easeOut' }}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-[24px] p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest">
          Agenda de hoy
        </h2>
        {totalCount > 0 && (
          <button className="text-[13px] font-medium text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors">
            Ver todo
          </button>
        )}
      </div>
      
      {agendaItems.length === 0 ? (
        <div className="py-6 text-center">
          <CalendarCheck size={28} className="text-[var(--text-faint)] mb-3 mx-auto" strokeWidth={1.5} />
          <p className="text-[var(--text)] text-[15px] font-medium">Tu agenda está despejada</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Vertical Line */}
          <div className="absolute left-[64px] top-4 bottom-4 w-[1px] bg-[var(--border-strong)]" />
          
          <div className="space-y-1">
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
        </div>
      )}
    </motion.section>
  );
}
