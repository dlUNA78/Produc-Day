import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Dumbbell, Sparkles, Plus, Calendar, Clock, Edit2 } from 'lucide-react';
import { WorkoutSplit, WorkoutRoutine } from '../../types';

interface SplitSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  splits: WorkoutSplit[];
  activeSplitId: string;
  onSelectSplit: (splitId: string) => void;
  onUpdateSplitSchedule: (splitId: string, schedule: Record<number, string>) => void;
  onCreateCustomSplit: (split: WorkoutSplit) => void;
}

const dayNames = [
  { day: 1, name: 'Lunes', short: 'LUN' },
  { day: 2, name: 'Martes', short: 'MAR' },
  { day: 3, name: 'Miércoles', short: 'MIÉ' },
  { day: 4, name: 'Jueves', short: 'JUE' },
  { day: 5, name: 'Viernes', short: 'VIE' },
  { day: 6, name: 'Sábado', short: 'SÁB' },
  { day: 0, name: 'Domingo', short: 'DOM' },
];

export default function SplitSelectorModal({
  isOpen,
  onClose,
  splits,
  activeSplitId,
  onSelectSplit,
  onUpdateSplitSchedule,
  onCreateCustomSplit,
}: SplitSelectorModalProps) {
  const [selectedSplitId, setSelectedSplitId] = useState(activeSplitId);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editableSchedule, setEditableSchedule] = useState<Record<number, string>>({});

  const currentSplit = splits.find(s => s.id === selectedSplitId) || splits[0];

  React.useEffect(() => {
    if (isOpen) {
      setSelectedSplitId(activeSplitId);
      const split = splits.find(s => s.id === activeSplitId) || splits[0];
      setEditableSchedule({ ...split.schedule });
      setIsEditingSchedule(false);
    }
  }, [isOpen, activeSplitId, splits]);

  const handleSelectSplit = (id: string) => {
    setSelectedSplitId(id);
    const split = splits.find(s => s.id === id);
    if (split) {
      setEditableSchedule({ ...split.schedule });
    }
  };

  const handleDayRoutineChange = (dayNum: number, routineId: string) => {
    setEditableSchedule(prev => ({
      ...prev,
      [dayNum]: routineId,
    }));
  };

  const handleApply = () => {
    if (isEditingSchedule) {
      onUpdateSplitSchedule(selectedSplitId, editableSchedule);
    }
    onSelectSplit(selectedSplitId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[color:var(--surface-glass)] backdrop-blur-md"
          />

          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-[32px] sm:rounded-3xl w-full max-w-lg max-h-[90dvh] h-auto flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* 1. Header */}
            <div className="shrink-0 flex items-center justify-between px-6 pt-5 pb-4 border-b border-[var(--border)] bg-[var(--surface)]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
                  <Dumbbell size={18} className="text-[var(--accent)]" />
                  Estructura de Entrenamiento
                </h2>
                <p className="text-xs text-[var(--text-faint)]">Selecciona o personaliza tu división de rutina</p>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* 2. Scrollable Content Body */}
            <div className="flex-1 min-h-0 overflow-y-auto scroll-y-touch p-6 space-y-6">
              {/* Splits Options */}
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest">
                  Planes Disponibles
                </label>

                <div className="grid grid-cols-1 gap-2.5">
                  {splits.map(split => {
                    const isChosen = split.id === selectedSplitId;
                    const isActive = split.id === activeSplitId;

                    return (
                      <div
                        key={split.id}
                        onClick={() => handleSelectSplit(split.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-left flex flex-col gap-1.5 ${
                          isChosen
                            ? 'bg-[var(--accent-soft)] border-[var(--accent-border)] shadow-[var(--shadow-soft)] ring-1 ring-[var(--accent-border)]'
                            : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-muted)] hover:border-[var(--border-strong)]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold ${isChosen ? 'text-[var(--text)]' : 'text-[var(--text)]'}`}>
                              {split.name}
                            </span>
                            {isActive && (
                              <span className="text-[9px] font-bold px-2 py-0.5 bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-border)] rounded-full">
                                EN USO
                              </span>
                            )}
                          </div>
                          {isChosen && (
                            <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                          {split.description}
                        </p>

                        {/* Mini pills of routines in this split */}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {split.routines.map(r => (
                            <span
                              key={r.id}
                              className="text-[9px] px-2 py-0.5 bg-[var(--surface-raised)] text-[var(--text)] rounded-xl border border-[var(--border-strong)]"
                            >
                              {r.shortName} ({r.exercises.length} ejercicios)
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Weekly Schedule Breakdown for current selected split */}
              {currentSplit && (
                <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-[var(--accent)]" />
                      <span className="text-xs font-semibold text-[var(--text)]">Distribución semanal</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditingSchedule(!isEditingSchedule)}
                      className="text-[11px] text-[var(--accent)] hover:text-[var(--accent-strong)] flex items-center gap-1 font-medium"
                    >
                      <Edit2 size={11} />
                      {isEditingSchedule ? 'Bloquear cambios' : 'Ajustar días'}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {dayNames.map(({ day, name, short }) => {
                      const routineId = editableSchedule[day] || currentSplit.schedule[day];
                      const isRest = !routineId || routineId === 'REST';
                      const assignedRoutine = currentSplit.routines.find(r => r.id === routineId);

                      return (
                        <div
                          key={day}
                          className="flex items-center justify-between py-1.5 px-2.5 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase w-8 font-mono">
                              {short}
                            </span>
                            <span className="text-[var(--text)] font-medium">{name}</span>
                          </div>

                          {isEditingSchedule ? (
                            <select
                              value={routineId || 'REST'}
                              onChange={(e) => handleDayRoutineChange(day, e.target.value)}
                              className="bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text)] text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[var(--accent)]"
                            >
                              <option value="REST">Descanso (Rest)</option>
                              {currentSplit.routines.map(r => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-lg ${
                              isRest
                                ? 'bg-[var(--surface-raised)] text-[var(--text-faint)]'
                                : 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-border)]'
                            }`}>
                              {isRest ? 'Descanso' : assignedRoutine?.shortName || 'Rutina'}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Sticky Action Footer */}
            <div className="shrink-0 p-4 border-t border-[var(--border)] bg-[var(--surface)] flex gap-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] font-medium text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-3 px-4 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[var(--accent-ink)] font-semibold text-xs shadow-md transition-all"
              >
                Activar este Plan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
