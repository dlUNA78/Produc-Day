import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calendar, Check, Clock3, FileText, ListTodo, Timer, X } from 'lucide-react';
import { Activity, Category, Task } from '../types';

interface CreateEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddActivity: (activity: Omit<Activity, 'id' | 'isCompleted'>) => void;
  onAddTask: (task: Omit<Task, 'id' | 'isCompleted'>) => void;
  onCreated?: (type: 'activity' | 'task') => void;
  editingEntry?: { type: 'activity'; item: Activity } | { type: 'task'; item: Task } | null;
  onUpdateActivity?: (id: string, updates: Partial<Activity>) => void;
  onUpdateTask?: (id: string, updates: Partial<Task>) => void;
  onDelete?: (id: string, type: 'activity' | 'task') => void;
  defaultDate: string;
}

const CATEGORIES: Array<{ value: Category; label: string }> = [
  { value: 'Personal', label: 'Personal' },
  { value: 'Work', label: 'Trabajo' },
  { value: 'Study', label: 'Estudio' },
  { value: 'Gym', label: 'Entrenamiento' },
];

export default function CreateEntryModal({
  isOpen,
  onClose,
  onAddActivity,
  onAddTask,
  onCreated,
  editingEntry,
  onUpdateActivity,
  onUpdateTask,
  onDelete,
  defaultDate,
}: CreateEntryModalProps) {
  const [type, setType] = useState<'activity' | 'task'>('task');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Personal');
  const [date, setDate] = useState(defaultDate);
  const [hasTime, setHasTime] = useState(false);
  const [time, setTime] = useState('12:00');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const entry = editingEntry?.item;
    setType(editingEntry?.type || 'task');
    setTitle(entry?.title || '');
    setCategory(entry?.category || 'Personal');
    setDate(entry?.date || defaultDate);
    setHasTime(editingEntry?.type === 'task' ? Boolean(editingEntry.item.time) : false);
    setTime(editingEntry?.type === 'task' ? editingEntry.item.time || '12:00' : '12:00');
    setStartTime(editingEntry?.type === 'activity' ? editingEntry.item.startTime : '09:00');
    setEndTime(editingEntry?.type === 'activity' ? editingEntry.item.endTime : '10:00');
    setDescription(entry?.description || '');
    setError('');
  }, [isOpen, defaultDate, editingEntry]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Escribe un título para continuar.');
      return;
    }

    if (type === 'activity' && endTime <= startTime) {
      setError('La hora de finalización debe ser posterior a la hora de inicio.');
      return;
    }

    if (editingEntry?.type === 'activity') {
      onUpdateActivity?.(editingEntry.item.id, { title: title.trim(), category, date, startTime, endTime, description: description.trim() || undefined });
    } else if (editingEntry?.type === 'task') {
      onUpdateTask?.(editingEntry.item.id, { title: title.trim(), category, date, time: hasTime ? time : undefined, description: description.trim() || undefined });
    } else if (type === 'activity') {
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
        category,
        description: description.trim() || undefined,
      });
    }

    if (!editingEntry) onCreated?.(type);
    onClose();
  };

  const fieldClass = 'w-full min-h-12 bg-[var(--canvas)] border border-[var(--border)] rounded-2xl px-4 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:border-[var(--accent)] focus:outline-none transition-colors';
  const labelClass = 'block text-xs font-semibold text-[var(--text-muted)] mb-2';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center font-sans" role="dialog" aria-modal="true" aria-labelledby="create-entry-title">
          <motion.button
            type="button"
            aria-label="Cerrar formulario"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 w-full bg-[color:var(--surface-glass)] backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md max-h-[94dvh] overflow-y-auto scrollbar-hide rounded-t-[28px] border border-b-0 border-[var(--border)] bg-[var(--surface)] shadow-[0_-24px_64px_rgba(0,0,0,0.45)]"
          >
            <div className="sticky top-0 z-10 bg-[var(--surface)]/95 backdrop-blur-md px-5 pt-3 pb-4 border-b border-[var(--border)]">
              <div className="w-10 h-1 rounded-full bg-[var(--border)] mx-auto mb-4" />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">{editingEntry ? 'Ajusta tu plan' : 'Planifica tu día'}</p>
                  <h2 id="create-entry-title" className="mt-1 text-xl font-semibold text-[var(--text)]">{editingEntry ? 'Editar entrada' : 'Nueva entrada'}</h2>
                </div>
                <button type="button" onClick={onClose} aria-label="Cerrar" className="w-11 h-11 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
                  <X size={19} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-5 pb-[max(2rem,env(safe-area-inset-bottom))] space-y-5">
              <fieldset disabled={Boolean(editingEntry)} className={editingEntry ? 'opacity-70' : ''}>
                <legend className={labelClass}>¿Qué quieres añadir?</legend>
                <div className="grid grid-cols-2 gap-2 p-1.5 rounded-[18px] bg-[var(--canvas)] border border-[var(--border)]">
                  {[
                    { value: 'task' as const, label: 'Tarea', detail: 'Algo por completar', icon: ListTodo },
                    { value: 'activity' as const, label: 'Bloque de tiempo', detail: 'Reserva un horario', icon: Timer },
                  ].map(({ value, label, detail, icon: Icon }) => {
                    const selected = type === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => { setType(value); setError(''); }}
                        className={`min-h-[76px] p-3 rounded-[14px] text-left transition-colors ${selected ? 'bg-[var(--surface-raised)] border border-[var(--accent)]' : 'border border-transparent text-[var(--text-muted)]'}`}
                      >
                        <Icon size={18} className={selected ? 'text-[var(--accent)]' : 'text-[var(--text-faint)]'} />
                        <span className="block mt-2 text-sm font-semibold text-[var(--text)]">{label}</span>
                        <span className="block mt-0.5 text-[11px] text-[var(--text-faint)]">{detail}</span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor="entry-title" className={labelClass}>Título</label>
                <input id="entry-title" type="text" autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder={type === 'task' ? 'Ej. Preparar la presentación' : 'Ej. Entrenamiento de fuerza'} className={fieldClass} aria-invalid={Boolean(error && !title.trim())} />
              </div>

              <div>
                <label htmlFor="entry-date" className={labelClass}>Fecha</label>
                <div className="relative">
                  <Calendar size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)] pointer-events-none" />
                  <input id="entry-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} className={`${fieldClass} pl-11 [color-scheme:dark]`} required />
                </div>
              </div>

              {type === 'task' ? (
                <div>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <label htmlFor="task-time" className="text-xs font-semibold text-[var(--text-muted)]">Hora específica</label>
                    <button type="button" role="switch" aria-checked={hasTime} onClick={() => setHasTime((value) => !value)} className={`relative w-11 h-6 rounded-full transition-colors ${hasTime ? 'bg-[var(--accent)]' : 'bg-[var(--surface-muted)]'}`}>
                      <span className={`absolute top-1 w-4 h-4 rounded-full transition-all ${hasTime ? 'left-6 bg-[var(--accent-ink)]' : 'left-1 bg-[var(--text-muted)]'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-faint)] mb-3">{hasTime ? 'La tarea aparecerá a esta hora.' : 'Puedes completarla en cualquier momento del día.'}</p>
                  {hasTime && <div className="relative"><Clock3 size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-faint)] pointer-events-none" /><input id="task-time" type="time" value={time} onChange={(event) => setTime(event.target.value)} className={`${fieldClass} pl-11 [color-scheme:dark]`} /></div>}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div><label htmlFor="start-time" className={labelClass}>Inicio</label><input id="start-time" type="time" value={startTime} onChange={(event) => { setStartTime(event.target.value); setError(''); }} className={`${fieldClass} [color-scheme:dark]`} required /></div>
                  <div><label htmlFor="end-time" className={labelClass}>Finalización</label><input id="end-time" type="time" value={endTime} onChange={(event) => { setEndTime(event.target.value); setError(''); }} className={`${fieldClass} [color-scheme:dark]`} required /></div>
                </div>
              )}

              <fieldset>
                <legend className={labelClass}>Categoría</legend>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map(({ value, label }) => {
                    const selected = category === value;
                    return <button key={value} type="button" aria-pressed={selected} onClick={() => setCategory(value)} className={`min-h-11 px-3 rounded-xl border text-sm font-medium flex items-center justify-between transition-colors ${selected ? 'bg-[var(--accent)]/12 border-[var(--accent)] text-[var(--text)]' : 'bg-[var(--canvas)] border-[var(--border)] text-[var(--text-muted)]'}`}><span>{label}</span>{selected && <Check size={16} className="text-[var(--accent)]" />}</button>;
                  })}
                </div>
              </fieldset>

              <div>
                <label htmlFor="entry-notes" className={labelClass}>Notas <span className="font-normal text-[var(--text-faint)]">(opcional)</span></label>
                <div className="relative"><FileText size={17} className="absolute left-4 top-4 text-[var(--text-faint)] pointer-events-none" /><textarea id="entry-notes" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Añade contexto o detalles..." className={`${fieldClass} min-h-24 py-3 pl-11 resize-none`} /></div>
              </div>

              {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} role="alert" className="text-sm leading-5 text-[var(--clay)] bg-[var(--clay)]/10 border border-[var(--clay)]/30 rounded-xl px-3 py-2.5">{error}</motion.p>}

              <div className="flex gap-3">
                {editingEntry && onDelete && (
                  <button type="button" onClick={() => { onDelete(editingEntry.item.id, editingEntry.type); onClose(); }} className="min-h-13 px-4 rounded-2xl border border-[var(--clay)]/40 text-[var(--clay)] font-semibold text-sm hover:bg-[var(--clay)]/10 transition-colors">Eliminar</button>
                )}
                <button type="submit" className="flex-1 min-h-13 rounded-2xl bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[var(--accent-ink)] font-semibold text-sm transition-colors flex items-center justify-center gap-2">
                  <Check size={18} /> {editingEntry ? 'Guardar cambios' : `Guardar ${type === 'task' ? 'tarea' : 'bloque'}`}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
