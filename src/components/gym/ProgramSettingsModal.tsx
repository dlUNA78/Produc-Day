import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Calendar, Weight, Activity, X, Dumbbell, Plus, Trash2 } from 'lucide-react';
import { GymProgramSettings } from '../../types';

interface ProgramSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSettings: GymProgramSettings | null;
  onSave: (settings: GymProgramSettings) => void;
  onClear: () => void;
}

export default function ProgramSettingsModal({ isOpen, onClose, currentSettings, onSave, onClear }: ProgramSettingsModalProps) {
  const [startDate, setStartDate] = useState(currentSettings?.startDate || new Date().toISOString().split('T')[0]);
  const [durationWeeks, setDurationWeeks] = useState(currentSettings?.durationWeeks?.toString() || '12');
  const [startWeight, setStartWeight] = useState(currentSettings?.startWeight?.toString() || '');
  const [targetWeight, setTargetWeight] = useState(currentSettings?.targetWeight?.toString() || '');
  const [keyLifts, setKeyLifts] = useState<{ id: string; name: string; initialWeight: string; targetWeight: string }[]>(
    currentSettings?.keyLifts?.map(k => ({ 
      ...k, 
      initialWeight: k.initialWeight.toString(),
      targetWeight: k.targetWeight?.toString() || ''
    })) || []
  );

  const handleAddLift = () => {
    setKeyLifts([...keyLifts, { id: Date.now().toString(), name: '', initialWeight: '', targetWeight: '' }]);
  };

  const handleUpdateLift = (id: string, field: 'name' | 'initialWeight' | 'targetWeight', value: string) => {
    setKeyLifts(keyLifts.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleRemoveLift = (id: string) => {
    setKeyLifts(keyLifts.filter(l => l.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      startDate,
      durationWeeks: parseInt(durationWeeks) || 12,
      startWeight: parseFloat(startWeight) || 0,
      targetWeight: parseFloat(targetWeight) || 0,
      keyLifts: keyLifts.filter(l => l.name.trim() !== '').map(l => ({
        id: l.id,
        name: l.name.trim(),
        initialWeight: parseFloat(l.initialWeight) || 0,
        currentWeight: currentSettings?.keyLifts?.find(k => k.id === l.id)?.currentWeight || parseFloat(l.initialWeight) || 0,
        targetWeight: parseFloat(l.targetWeight) || 0
      }))
    });
    onClose();
  };

  const handleClear = () => {
    onClear();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[color:var(--surface-glass)] backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-[var(--surface)] border border-[var(--border)] rounded-3xl w-full max-w-sm flex flex-col shadow-2xl z-10 max-h-[90dvh] h-auto overflow-hidden"
          >
            <div className="shrink-0 flex items-center justify-between p-6 pb-4 border-b border-[var(--border)] bg-[var(--surface)]">
              <div>
                <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
                  <Target size={18} className="text-[var(--accent)]" />
                  Meta del Programa
                </h3>
                <p className="text-xs text-[var(--text-faint)] mt-1">Configura la duración y tu peso objetivo</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="flex-1 min-h-0 overflow-y-auto scroll-y-touch p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Fecha de Inicio
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Duración (Semanas)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="52"
                      required
                      value={durationWeeks}
                      onChange={(e) => setDurationWeeks(e.target.value)}
                      placeholder="Ej. 12"
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 pr-8 text-sm font-bold font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-faint)] font-bold">
                      sem
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Peso Inicial
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={startWeight}
                      onChange={(e) => setStartWeight(e.target.value)}
                      placeholder="Ej. 80.5"
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 pr-8 text-sm font-bold font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-faint)] font-bold">
                      kg
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    Peso Objetivo
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      placeholder="Ej. 75.0"
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 pr-8 text-sm font-bold font-mono text-[var(--accent)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-faint)] font-bold">
                      kg
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--border)] pt-5 mt-2 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                    <Dumbbell size={12} />
                    Ejercicios Base & Pesos Iniciales
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLift}
                    className="text-[10px] bg-[var(--surface)] hover:bg-[var(--surface-muted)] text-[var(--text-muted)] hover:text-[var(--text)] px-2 py-1 rounded-lg transition-colors flex items-center gap-1 font-bold"
                  >
                    <Plus size={12} /> Add
                  </button>
                </div>
                
                {keyLifts.length === 0 && (
                  <p className="text-xs text-[var(--text-faint)] italic">No hay ejercicios registrados. Añade tus levantamientos clave (ej. Press Banca) para medir su progreso inicial.</p>
                )}

                {keyLifts.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {keyLifts.map((lift) => (
                      <div key={lift.id} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={lift.name}
                          onChange={(e) => handleUpdateLift(lift.id, 'name', e.target.value)}
                          placeholder="Nombre"
                          className="flex-[2] bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2 py-2 text-xs font-semibold text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                        />
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            step="0.5"
                            value={lift.initialWeight}
                            onChange={(e) => handleUpdateLift(lift.id, 'initialWeight', e.target.value)}
                            placeholder="Inicio"
                            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2 py-2 pr-5 text-xs font-bold font-mono text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                          />
                        </div>
                        <div className="flex-1 relative">
                          <input
                            type="number"
                            step="0.5"
                            value={lift.targetWeight}
                            onChange={(e) => handleUpdateLift(lift.id, 'targetWeight', e.target.value)}
                            placeholder="Meta"
                            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-2 py-2 pr-5 text-xs font-bold font-mono text-[var(--accent)] focus:outline-none focus:border-[var(--accent)]"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLift(lift.id)}
                          className="p-1.5 text-[var(--text-faint)] hover:text-[var(--danger)] transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </div>

              <div className="shrink-0 p-4 border-t border-[var(--border)] bg-[var(--surface)] flex gap-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
                {currentSettings && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 py-3 bg-[var(--danger-soft)] hover:bg-[var(--danger-soft)] text-[var(--danger)] border border-[var(--danger-border)] rounded-xl font-bold text-xs transition-colors"
                  >
                    Borrar
                  </button>
                )}
                
                <button
                  type="submit"
                  className={`${currentSettings ? 'flex-[2]' : 'w-full'} py-3 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[var(--accent-ink)] rounded-xl font-bold text-sm transition-colors shadow-lg`}
                >
                  Guardar Programa
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
