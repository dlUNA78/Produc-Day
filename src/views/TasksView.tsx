import React, { useState } from 'react';
import { Task } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Trash2, Edit2, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { formatDateKey } from '../components/WeeklyCalendar';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, updates: Partial<Task>) => void;
}

export default function TasksView({ tasks, onAddTask, onToggleTask, onDeleteTask, onEditTask }: TasksViewProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    onAddTask({
      title: newTaskTitle,
      date: formatDateKey(new Date()), // Default to today
    });
    setNewTaskTitle('');
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (id: string) => {
    if (editTitle.trim()) {
      onEditTask(id, { title: editTitle });
    }
    setEditingTaskId(null);
  };

  // Sort tasks: pending first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="pt-12 pb-6 px-6 border-b border-[var(--border)]">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] mb-2">Mis Tareas</h1>
        <p className="text-[var(--text-faint)] text-xs font-medium uppercase tracking-widest">Gestión general</p>
      </header>

      <div className="px-6 py-6 border-b border-[var(--border)] bg-[var(--surface)]">
        <form onSubmit={handleAdd} className="relative">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Añadir nueva tarea rápida..."
            className="w-full bg-[var(--canvas)] border border-[var(--border)] rounded-md pl-4 pr-12 py-3.5 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--border-strong)] transition-colors shadow-inner"
          />
          <button 
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-[var(--success-soft)] text-[var(--success)] rounded-xl flex items-center justify-center hover:bg-[var(--success-soft)] disabled:opacity-50 disabled:hover:bg-[var(--success-soft)] transition-colors"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
        {sortedTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 opacity-60">
            <Check size={48} className="text-[var(--text-faint)] mb-4" strokeWidth={1} />
            <p className="text-[var(--text-faint)] text-sm">No tienes tareas pendientes.</p>
            <p className="text-[var(--text-faint)] text-xs mt-2">Usa el campo de arriba para añadir una.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {sortedTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group bg-[var(--surface)] border ${task.isCompleted ? 'border-transparent opacity-60' : 'border-[var(--border)]'} rounded-md p-4 flex items-center gap-4 transition-all`}
                >
                  <button 
                    onClick={() => onToggleTask(task.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-[var(--surface-soft)] border-[var(--border-strong)]' : 'border-[var(--border-strong)] hover:border-[var(--success)]'}`}
                  >
                    {task.isCompleted && <Check size={14} className="text-[var(--text)]" strokeWidth={3} />}
                  </button>

                  {editingTaskId === task.id ? (
                    <div className="flex-1 flex gap-2">
                      <input 
                        type="text" 
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => saveEdit(task.id)}
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                        className="flex-1 bg-[var(--canvas)] border border-[var(--border-strong)] rounded-lg px-3 py-1.5 text-sm text-[var(--text)] focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 overflow-hidden flex flex-col">
                      <div className="flex items-center gap-2">
                        {task.category && (
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${
                            task.category === 'Gym' ? 'border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]' :
                            task.category === 'Work' ? 'border-[var(--plum-border)] bg-[var(--plum-soft)] text-[var(--plum)]' :
                            task.category === 'Study' ? 'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]' :
                            task.category === 'School' ? 'border-[var(--steel-border)] bg-[var(--steel-soft)] text-[var(--steel)]' :
                            task.category === 'Personal' ? 'border-[var(--plum-border)] bg-[var(--plum-soft)] text-[var(--plum)]' :
                            'border-[var(--border)] bg-[var(--canvas)] text-[var(--text-faint)]'
                          }`}>
                            {task.category}
                          </span>
                        )}
                        <span className={`text-sm font-medium truncate ${task.isCompleted ? 'text-[var(--text-faint)] line-through' : 'text-[var(--text)]'}`}>
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[var(--text-faint)] mt-1 font-mono">
                        <div className="flex items-center">
                          <CalendarIcon size={10} className="mr-1 text-[var(--text-faint)]" />
                          {task.date}
                        </div>
                        {task.time && (
                          <span className="text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-border)] px-1.5 rounded">
                            {task.time}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => startEditing(task)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => onDeleteTask(task.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--danger)] hover:text-[var(--danger)] hover:bg-[var(--danger-soft)] transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
