import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, Tag } from 'lucide-react';
import { Category, Activity, Task } from '../types';

interface CreateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (activity: Omit<Activity, 'id' | 'isCompleted'>) => void;
  onAddTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  defaultDate: string;
}

const CATEGORIES: Category[] = ['Gym', 'School', 'Work', 'Study', 'Personal', 'Task'];

export default function CreateEntryModal({ isOpen, onClose, onAddActivity, onAddTask, defaultDate }: CreateEntryModalProps) {
  const [type, setType] = useState<'activity' | 'task'>('task');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [date, setDate] = useState(defaultDate);
  const [hasTime, setHasTime] = useState(false);
  const [time, setTime] = useState('12:00');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setCategory('Personal');
      setDate(defaultDate);
      setHasTime(false);
      setTime('12:00');
      setStartTime('09:00');
      setEndTime('10:00');
      setDescription('');
    }
  }, [isOpen, defaultDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    if (type === 'activity') {
      onAddActivity({
        title: title.trim(),
        category,
        date,
        startTime,
        endTime,
        description: description.trim() || undefined,
      });
    } else {
      onAddTask({
        title: title.trim(),
        date,
        time: hasTime ? time : undefined,
        category: category,
        description: description.trim() || undefined,
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-[100] flex flex-col justify-end font-sans">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative bg-[#0E0E0E] border-t border-white/10/80 rounded-t-[32px] p-6 pb-8 w-full max-h-[92vh] overflow-y-auto scrollbar-hide flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-white">Nueva entrada en Agenda</h2>
              <p className="text-xs text-zinc-500">Se sincronizará automáticamente con tu calendario y tareas</p>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Type Toggle */}
            <div className="flex p-1 bg-black/60 border border-white/10 rounded-xl">
              <button
                type="button"
                onClick={() => setType('task')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  type === 'task' 
                    ? 'bg-white text-black shadow-sm font-semibold' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                Tarea (Agenda & Tareas)
              </button>
              <button
                type="button"
                onClick={() => setType('activity')}
                className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                  type === 'activity' 
                    ? 'bg-white text-black shadow-sm font-semibold' 
                    : 'text-zinc-500 hover:text-white'
                }`}
              >
                Actividad (Con horario)
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                Título de la entrada
              </label>
              <input 
                type="text" 
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === 'task' ? 'Ej. Enviar reporte mensual...' : 'Ej. Sesión de Pierna en el Gym...'}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Fecha programada</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                  required
                />
              </div>
            </div>

            {/* If Task: optional time toggle */}
            {type === 'task' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Hora específica (Opcional)
                  </label>
                  <button
                    type="button"
                    onClick={() => setHasTime(!hasTime)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                      hasTime 
                        ? 'bg-white/10 border-white/20 text-white font-medium' 
                        : 'bg-black border-white/10 text-zinc-500'
                    }`}
                  >
                    {hasTime ? 'Con hora fija' : 'Todo el día'}
                  </button>
                </div>

                {hasTime && (
                  <div className="relative mt-2">
                    <Clock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                      type="time" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* If Activity: start and end times */}
            {type === 'activity' && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Inicio</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                      type="time" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                      required
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Fin</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input 
                      type="time" 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm text-white focus:outline-none focus:border-white/30 transition-colors appearance-none [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Category Selector */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Categoría</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-2 text-xs font-medium rounded-xl border transition-all text-center ${
                      category === cat 
                        ? 'bg-white border-white text-white font-semibold shadow-sm' 
                        : 'bg-black/30 border-white/10/80 text-zinc-500 hover:border-white/30'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Descripción (Opcional)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Notas o detalles adicionales..."
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 transition-colors resize-none h-18"
              />
            </div>

            <button 
              type="submit"
              className="mt-2 w-full bg-white hover:bg-zinc-200 text-black font-semibold text-sm rounded-xl py-3.5 shadow-lg transition-all"
            >
              Agregar a la Agenda
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
