import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Dumbbell, Clock, Layers, Flame } from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseSet } from '../../types';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (exercise: Exercise) => void;
  routineName: string;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  'Pecho',
  'Espalda',
  'Hombros',
  'Bíceps',
  'Tríceps',
  'Cuádriceps',
  'Isquios',
  'Glúteos',
  'Gemelos',
  'Core / Abdomen',
  'Cardio / Movilidad',
];

export default function AddExerciseModal({
  isOpen,
  onClose,
  onAddExercise,
  routineName,
}: AddExerciseModalProps) {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Pecho');
  const [setsCount, setSetsCount] = useState(3);
  const [reps, setReps] = useState('10');
  const [weightKg, setWeightKg] = useState('20');
  const [restSeconds, setRestSeconds] = useState(90);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedWeight = parseFloat(weightKg) || 0;
    const sets: ExerciseSet[] = [];
    for (let i = 1; i <= setsCount; i++) {
      sets.push({
        id: `set-${Date.now()}-${i}`,
        setNumber: i,
        reps: reps.trim() || '10',
        weightKg: parsedWeight,
        isCompleted: false,
      });
    }

    const newEx: Exercise = {
      id: `ex-${Date.now()}`,
      name: name.trim(),
      muscleGroup,
      sets,
      restSeconds,
      notes: notes.trim() || undefined,
    };

    onAddExercise(newEx);
    setName('');
    setNotes('');
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
            className="relative bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-[32px] sm:rounded-3xl p-6 pb-8 w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
                  <Dumbbell size={18} className="text-[var(--accent)]" />
                  Añadir Ejercicio
                </h2>
                <p className="text-xs text-[var(--text-faint)]">A {routineName}</p>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Exercise Name */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest mb-1.5">
                  Nombre del Ejercicio
                </label>
                <input 
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Press Militar en Máquina Smith..."
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  required
                />
              </div>

              {/* Muscle Group */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest mb-1.5">
                  Grupo Muscular
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto scrollbar-hide p-1 bg-[var(--canvas)] border border-[var(--border)] rounded-xl">
                  {MUSCLE_GROUPS.map(mg => (
                    <button
                      key={mg}
                      type="button"
                      onClick={() => setMuscleGroup(mg)}
                      className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                        muscleGroup === mg
                          ? 'bg-[var(--accent-soft)] border-[var(--accent-border)] text-[var(--accent)] font-semibold shadow-sm'
                          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      {mg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sets & Reps */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest mb-1.5">
                    Series
                  </label>
                  <div className="relative">
                    <input 
                      type="number"
                      min={1}
                      max={10}
                      value={setsCount}
                      onChange={(e) => setSetsCount(parseInt(e.target.value) || 1)}
                      className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] text-center font-semibold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest mb-1.5">
                    Reps / Serie
                  </label>
                  <input 
                    type="text"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder="8-10"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] text-center font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest mb-1.5">
                    Peso (kg)
                  </label>
                  <input 
                    type="number"
                    step="0.5"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="20"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] text-center font-semibold"
                  />
                </div>
              </div>

              {/* Rest Seconds */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest mb-1.5">
                  Descanso entre series
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[45, 60, 90, 120].map(sec => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => setRestSeconds(sec)}
                      className={`py-1.5 text-xs rounded-xl border font-medium transition-all ${
                        restSeconds === sec
                          ? 'bg-[var(--surface-raised)] border-[var(--accent-border)] text-[var(--accent)] font-semibold'
                          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] font-bold text-[var(--text-faint)] uppercase tracking-widest mb-1.5">
                  Notas / Técnica (Opcional)
                </label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej. Pausa isométrica de 1s, agarre abierto..."
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-2.5 text-xs text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] resize-none h-16"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3.5 bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[var(--accent-ink)] font-bold text-sm rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-all"
              >
                Guardar Ejercicio en Rutina
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
