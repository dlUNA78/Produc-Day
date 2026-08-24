import React from 'react';
import { Task } from '../types';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
}

export default function TaskList({ tasks, onToggleTask }: TaskListProps) {
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  
  if (pendingTasks.length === 0) return null;

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
      className="px-6 pb-12 mt-auto pt-6 border-t border-slate-900"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tareas pendientes</h2>
        <span className="text-[10px] text-slate-400 px-2 py-0.5 bg-slate-900 rounded-full">
          {pendingTasks.length} {pendingTasks.length === 1 ? 'restante' : 'restantes'}
        </span>
      </div>
      
      <div className="space-y-3">
        {pendingTasks.map(task => (
          <button 
            key={task.id}
            onClick={() => onToggleTask(task.id)}
            className="w-full text-left bg-slate-900/20 border border-slate-800/50 hover:border-slate-700 p-3 rounded-xl flex items-center gap-3 transition-colors group"
          >
            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-slate-700 border-slate-700' : 'border-slate-700 group-hover:border-slate-500'}`}>
              {task.isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <span className={`text-xs ${task.isCompleted ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
              {task.title}
            </span>
          </button>
        ))}
      </div>
    </motion.section>
  );
}
