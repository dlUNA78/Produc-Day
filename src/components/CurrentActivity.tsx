import React from 'react';
import { Activity, Task, Category } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, PlayCircle, Clock } from 'lucide-react';

interface CurrentActivityProps {
  activities: Activity[];
  tasks: Task[];
  onToggleItem?: (id: string, type: 'activity' | 'task') => void;
}

const categoryDotColors: Record<string, string> = {
  Gym: 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]',
  School: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]',
  Work: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]',
  Study: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',
  Personal: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]',
  Task: 'bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
};

const categoryTextColors: Record<string, string> = {
  Gym: 'text-orange-400',
  School: 'text-blue-400',
  Work: 'text-indigo-400',
  Study: 'text-emerald-400',
  Personal: 'text-purple-400',
  Task: 'text-slate-300',
};

export default function CurrentActivity({ activities, tasks, onToggleItem }: CurrentActivityProps) {
  // Combine pending items for today/selected date
  const pendingActivities = activities.filter(a => !a.isCompleted);
  const pendingTasks = tasks.filter(t => !t.isCompleted);

  // Find the primary active item (first pending activity or first pending task)
  let activeItem: {
    id: string;
    type: 'activity' | 'task';
    title: string;
    category: Category;
    timeText: string;
    description?: string;
  } | null = null;

  let nextItemTitle: string | null = null;

  if (pendingActivities.length > 0) {
    const act = pendingActivities[0];
    activeItem = {
      id: act.id,
      type: 'activity',
      title: act.title,
      category: act.category,
      timeText: `${act.startTime} — ${act.endTime}`,
      description: act.description,
    };
    if (pendingActivities.length > 1) {
      nextItemTitle = `${pendingActivities[1].title} (${pendingActivities[1].startTime})`;
    } else if (pendingTasks.length > 0) {
      nextItemTitle = `${pendingTasks[0].title} (Tarea)`;
    }
  } else if (pendingTasks.length > 0) {
    const tsk = pendingTasks[0];
    activeItem = {
      id: tsk.id,
      type: 'task',
      title: tsk.title,
      category: tsk.category || 'Task',
      timeText: tsk.time ? `Programada a las ${tsk.time}` : 'Tarea pendiente del día',
      description: tsk.description,
    };
    if (pendingTasks.length > 1) {
      nextItemTitle = `${pendingTasks[1].title} (Tarea)`;
    }
  }

  if (!activeItem) {
    const totalDone = activities.filter(a => a.isCompleted).length + tasks.filter(t => t.isCompleted).length;
    return (
      <div className="px-6 mb-8">
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 text-center flex flex-col items-center">
          {totalDone > 0 ? (
            <>
              <CheckCircle2 size={24} className="text-emerald-400 mb-1" />
              <p className="text-white text-sm font-medium">¡Todo completado!</p>
              <p className="text-slate-500 text-xs mt-0.5">Has finalizado todas las actividades y tareas del día.</p>
            </>
          ) : (
            <p className="text-slate-400 text-sm">Sin actividades en curso</p>
          )}
        </div>
      </div>
    );
  }

  const dotColorClass = categoryDotColors[activeItem.category] || categoryDotColors.Personal;
  const textColorClass = categoryTextColors[activeItem.category] || categoryTextColors.Personal;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
      className="px-6 mb-8"
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">En curso</h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-500 font-medium">{activeItem.type === 'task' ? 'Tarea activa' : 'Actividad'}</span>
          <span className={`w-2 h-2 rounded-full ${dotColorClass}`}></span>
        </div>
      </div>
      
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className={`${textColorClass} text-xs font-semibold tracking-wide flex items-center gap-1.5`}>
              <Clock size={12} />
              {activeItem.timeText}
            </p>
            
            {onToggleItem && (
              <button
                onClick={() => onToggleItem(activeItem!.id, activeItem!.type)}
                className="text-[11px] px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-medium transition-colors"
              >
                Completar
              </button>
            )}
          </div>

          <h3 className="text-xl font-medium text-white mb-2">
            {activeItem.category !== 'Task' ? `${activeItem.category}: ` : ''}{activeItem.title}
          </h3>
          {activeItem.description && (
            <p className="text-slate-400 text-sm leading-relaxed mb-1">
              {activeItem.description}
            </p>
          )}
        </div>
        
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <PlayCircle size={54} className="text-white" strokeWidth={1.5} />
        </div>
        
        {nextItemTitle && (
          <div className="mt-4 pt-3 border-t border-slate-800/60 relative z-10">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span className="uppercase tracking-widest font-bold text-[10px]">Siguiente</span>
              <span className="text-slate-300 font-medium truncate ml-4 text-xs">{nextItemTitle}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
