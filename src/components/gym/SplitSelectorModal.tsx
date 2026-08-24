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
            className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md"
          />

          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative bg-[#0E0E0E] border-t sm:border border-slate-800/80 rounded-t-[32px] sm:rounded-3xl p-6 pb-8 w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Dumbbell size={18} className="text-orange-400" />
                  Estructura de Entrenamiento
                </h2>
                <p className="text-xs text-slate-500">Selecciona o personaliza tu división de rutina</p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Splits Options */}
            <div className="flex flex-col gap-3 mb-6">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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
                          ? 'bg-orange-500/10 border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)] ring-1 ring-orange-500/30'
                          : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${isChosen ? 'text-white' : 'text-slate-200'}`}>
                            {split.name}
                          </span>
                          {isActive && (
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full">
                              EN USO
                            </span>
                          )}
                        </div>
                        {isChosen && (
                          <div className="w-5 h-5 rounded-full bg-orange-500 text-slate-950 flex items-center justify-center">
                            <Check size={12} strokeWidth={3} />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {split.description}
                      </p>

                      {/* Mini pills of routines in this split */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {split.routines.map(r => (
                          <span
                            key={r.id}
                            className="text-[9px] px-2 py-0.5 bg-slate-800/80 text-slate-300 rounded-md border border-slate-700/50"
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
              <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-orange-400" />
                    <span className="text-xs font-semibold text-white">Distribución semanal</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingSchedule(!isEditingSchedule)}
                    className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-medium"
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
                        className="flex items-center justify-between py-1.5 px-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase w-8 font-mono">
                            {short}
                          </span>
                          <span className="text-slate-300 font-medium">{name}</span>
                        </div>

                        {isEditingSchedule ? (
                          <select
                            value={routineId || 'REST'}
                            onChange={(e) => handleDayRoutineChange(day, e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-white text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-orange-500"
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
                              ? 'bg-slate-800/60 text-slate-500'
                              : 'bg-orange-500/15 text-orange-300 border border-orange-500/20'
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

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-800 text-slate-400 hover:text-white font-medium text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-semibold text-xs shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-all"
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
