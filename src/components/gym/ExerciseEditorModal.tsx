import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Dumbbell, 
  Clock, 
  Layers, 
  Sparkles, 
  Plus, 
  Trash2, 
  Search, 
  Check, 
  HelpCircle,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Exercise, MuscleGroup, ExerciseSet } from '../../types';
import { EXERCISE_LIBRARY, PresetExerciseItem } from '../../data/exerciseLibrary';

interface ExerciseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExercise: (exercise: Exercise) => void;
  initialExercise?: Exercise | null;
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

const REST_PRESETS = [45, 60, 75, 90, 120, 150, 180];

export default function ExerciseEditorModal({
  isOpen,
  onClose,
  onSaveExercise,
  initialExercise,
  routineName,
}: ExerciseEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'custom'>('library');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<MuscleGroup | 'Todos'>('Todos');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  // Exercise fields
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Pecho');
  const [restSeconds, setRestSeconds] = useState(90);
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState<Array<{ id: string; setNumber: number; reps: string; weightKg: number }>>([
    { id: 's1', setNumber: 1, reps: '10', weightKg: 20 },
    { id: 's2', setNumber: 2, reps: '10', weightKg: 20 },
    { id: 's3', setNumber: 3, reps: '10', weightKg: 20 },
  ]);

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      if (initialExercise) {
        setName(initialExercise.name);
        setMuscleGroup(initialExercise.muscleGroup);
        setRestSeconds(initialExercise.restSeconds || 90);
        setNotes(initialExercise.notes || '');
        setSets(
          initialExercise.sets.map((s, idx) => ({
            id: s.id || `set-${Date.now()}-${idx + 1}`,
            setNumber: idx + 1,
            reps: String(s.reps || '10'),
            weightKg: s.weightKg || 0,
          }))
        );
        setActiveTab('custom');
      } else {
        setName('');
        setMuscleGroup('Pecho');
        setRestSeconds(90);
        setNotes('');
        setSets([
          { id: `s-${Date.now()}-1`, setNumber: 1, reps: '10', weightKg: 20 },
          { id: `s-${Date.now()}-2`, setNumber: 2, reps: '10', weightKg: 20 },
          { id: `s-${Date.now()}-3`, setNumber: 3, reps: '10', weightKg: 20 },
        ]);
        setActiveTab('library');
        setSearchQuery('');
        setSelectedMuscleFilter('Todos');
      }
    }
  }, [isOpen, initialExercise]);

  // Select from preset library
  const handleSelectPreset = (preset: PresetExerciseItem) => {
    setName(preset.name);
    setMuscleGroup(preset.muscleGroup);
    setRestSeconds(preset.defaultRestSeconds);
    setNotes(preset.tips);
    
    const newSets = [];
    for (let i = 1; i <= preset.defaultSets; i++) {
      newSets.push({
        id: `s-${Date.now()}-${i}`,
        setNumber: i,
        reps: preset.defaultReps,
        weightKg: preset.defaultWeightKg,
      });
    }
    setSets(newSets);
    setActiveTab('custom');
  };

  // Set management
  const handleAddSet = () => {
    const lastSet = sets[sets.length - 1];
    const newNumber = sets.length + 1;
    setSets(prev => [
      ...prev,
      {
        id: `s-${Date.now()}-${newNumber}`,
        setNumber: newNumber,
        reps: lastSet ? lastSet.reps : '10',
        weightKg: lastSet ? lastSet.weightKg : 20,
      }
    ]);
  };

  const handleRemoveSet = (index: number) => {
    if (sets.length <= 1) return;
    setSets(prev => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((s, idx) => ({ ...s, setNumber: idx + 1 }));
    });
  };

  const handleUpdateSetField = (index: number, field: 'reps' | 'weightKg', value: any) => {
    setSets(prev => prev.map((s, i) => {
      if (i === index) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const exerciseSets: ExerciseSet[] = sets.map((s, idx) => ({
      id: s.id || `set-${Date.now()}-${idx + 1}`,
      setNumber: idx + 1,
      reps: s.reps.trim() || '10',
      weightKg: Number(s.weightKg) || 0,
      isCompleted: initialExercise?.sets[idx]?.isCompleted || false,
    }));

    const resultExercise: Exercise = {
      id: initialExercise ? initialExercise.id : `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      muscleGroup,
      sets: exerciseSets,
      restSeconds,
      notes: notes.trim() || undefined,
    };

    onSaveExercise(resultExercise);
    onClose();
  };

  // Filtered preset library items
  const filteredPresets = EXERCISE_LIBRARY.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMuscle = selectedMuscleFilter === 'Todos' || item.muscleGroup === selectedMuscleFilter;
    return matchesSearch && matchesMuscle;
  });

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
            className="relative bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-[32px] sm:rounded-3xl p-6 pb-8 w-full max-w-lg max-h-[92vh] overflow-y-auto scrollbar-hide flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text)] flex items-center gap-2">
                  <Dumbbell size={18} className="text-[var(--accent)]" />
                  {initialExercise ? 'Editar Ejercicio' : 'Definir Ejercicio'}
                </h2>
                <p className="text-xs text-[var(--text-faint)]">
                  En {routineName}
                </p>
              </div>
              <button 
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            {!initialExercise && (
              <div className="flex bg-[var(--canvas)] p-1 rounded-xl border border-[var(--border)] mb-5">
                <button
                  type="button"
                  onClick={() => setActiveTab('library')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'library'
                      ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-bold shadow-md'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>Biblioteca de Ejercicios</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('custom')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    activeTab === 'custom'
                      ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-bold shadow-md'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                  }`}
                >
                  <Plus size={13} />
                  <span>Crear Personalizado</span>
                </button>
              </div>
            )}

            {/* TAB 1: LIBRARY SEARCH */}
            {activeTab === 'library' && !initialExercise && (
              <div className="flex flex-col gap-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar por ejercicio o músculo..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>

                {/* Muscle Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                  <button
                    type="button"
                    onClick={() => setSelectedMuscleFilter('Todos')}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold shrink-0 transition-colors ${
                      selectedMuscleFilter === 'Todos'
                        ? 'bg-[var(--surface-raised)] text-[var(--accent)] border border-[var(--accent-border)]'
                        : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'
                    }`}
                  >
                    Todos
                  </button>
                  {MUSCLE_GROUPS.map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedMuscleFilter(m)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold shrink-0 transition-colors ${
                        selectedMuscleFilter === m
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-border)]'
                          : 'bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] hover:text-[var(--text)]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* Library Items List */}
                <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto scrollbar-hide pr-1">
                  {filteredPresets.length === 0 ? (
                    <div className="text-center py-8 text-[var(--text-faint)] text-xs">
                      No se encontraron ejercicios en la biblioteca.
                      <button
                        type="button"
                        onClick={() => setActiveTab('custom')}
                        className="block mx-auto mt-2 text-[var(--accent)] font-semibold underline"
                      >
                        Crear como ejercicio personalizado
                      </button>
                    </div>
                  ) : (
                    filteredPresets.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectPreset(preset)}
                        className="p-3 bg-[var(--canvas)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-muted)] rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                      >
                        <div className="flex flex-col gap-1 pr-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-[var(--text)] group-hover:text-[var(--accent-strong)] transition-colors">
                              {preset.name}
                            </span>
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border-strong)] text-[var(--text-muted)]">
                              {preset.muscleGroup}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] font-mono">
                            <span>{preset.defaultSets} series x {preset.defaultReps} reps</span>
                            <span>• {preset.defaultWeightKg} kg</span>
                            <span>• ⏱ {preset.defaultRestSeconds}s</span>
                          </div>
                        </div>

                        <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] group-hover:bg-[var(--accent-strong)] text-[var(--accent)] group-hover:text-[var(--accent-ink)] flex items-center justify-center shrink-0 transition-all">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOM / DETAILED EDITOR */}
            {(activeTab === 'custom' || initialExercise) && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Exercise Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Nombre del Ejercicio *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Press Militar con Barra"
                    className="w-full px-3.5 py-2.5 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>

                {/* Muscle Group */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Grupo Muscular Principal
                  </label>
                  <select
                    value={muscleGroup}
                    onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)}
                    className="w-full px-3.5 py-2.5 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  >
                    {MUSCLE_GROUPS.map((mg) => (
                      <option key={mg} value={mg} className="bg-[var(--canvas)] text-[var(--text)]">
                        {mg}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sets Builder Table */}
                <div className="flex flex-col gap-2 bg-[var(--canvas)] border border-[var(--border)] rounded-2xl p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[var(--text)] uppercase tracking-wider flex items-center gap-1.5">
                      <Layers size={13} className="text-[var(--accent)]" />
                      Series Programadas ({sets.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddSet}
                      className="text-[11px] font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)] flex items-center gap-1 bg-[var(--accent-soft)] px-2.5 py-1 rounded-lg border border-[var(--accent-border)] transition-colors"
                    >
                      <Plus size={12} />
                      <span>Añadir Serie</span>
                    </button>
                  </div>

                  {/* Header labels */}
                  <div className="grid grid-cols-12 gap-2 text-[10px] text-[var(--text-faint)] font-bold uppercase tracking-wider px-1 pt-1">
                    <div className="col-span-2">Serie</div>
                    <div className="col-span-5">Reps Objetivo</div>
                    <div className="col-span-4 flex items-center justify-between">
                      <span>Peso</span>
                      <button
                        type="button"
                        onClick={() => setWeightUnit(prev => prev === 'kg' ? 'lbs' : 'kg')}
                        className="text-[9px] bg-[var(--surface)] border border-[var(--border-strong)] hover:border-[var(--accent)] px-1.5 py-0.5 rounded text-[var(--accent)] transition-colors"
                      >
                        {weightUnit.toUpperCase()}
                      </button>
                    </div>
                    <div className="col-span-1"></div>
                  </div>

                  {/* Sets Rows */}
                  <div className="flex flex-col gap-2">
                    {sets.map((set, idx) => {
                      const displayWeight = weightUnit === 'lbs' 
                        ? (set.weightKg * 2.20462).toFixed(1).replace(/\.0$/, '') 
                        : set.weightKg;

                      return (
                        <div key={set.id || idx} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-2">
                            <span className="w-6 h-6 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] font-mono text-xs flex items-center justify-center">
                              #{idx + 1}
                            </span>
                          </div>

                          <div className="col-span-5">
                            <input
                              type="text"
                              value={set.reps}
                              onChange={(e) => handleUpdateSetField(idx, 'reps', e.target.value)}
                              placeholder="10 o 8-12"
                              className="w-full px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)]"
                            />
                          </div>

                          <div className="col-span-4 relative">
                            <input
                              type="number"
                              step="0.5"
                              value={displayWeight}
                              onChange={(e) => {
                                const raw = parseFloat(e.target.value) || 0;
                                const newKg = weightUnit === 'lbs' ? raw / 2.20462 : raw;
                                handleUpdateSetField(idx, 'weightKg', Number(newKg.toFixed(2)));
                              }}
                              placeholder={weightUnit}
                              className="w-full px-2.5 py-1.5 pr-8 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-xs text-[var(--text)] font-mono focus:outline-none focus:border-[var(--accent)]"
                            />
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-faint)] font-bold uppercase">
                              {weightUnit}
                            </span>
                          </div>

                          <div className="col-span-1 flex justify-end">
                            <button
                              type="button"
                              disabled={sets.length <= 1}
                              onClick={() => handleRemoveSet(idx)}
                              className={`p-1 rounded text-[var(--text-faint)] hover:text-[var(--danger)] transition-colors ${
                                sets.length <= 1 ? 'opacity-30 cursor-not-allowed' : ''
                              }`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Rest Seconds Selector */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={12} className="text-[var(--accent)]" />
                      Descanso Entre Series
                    </label>
                    <span className="text-xs font-mono font-bold text-[var(--accent)]">{restSeconds}s ({Math.floor(restSeconds / 60)}m {restSeconds % 60 ? `${restSeconds % 60}s` : ''})</span>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                    {REST_PRESETS.map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setRestSeconds(sec)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-colors shrink-0 ${
                          restSeconds === sec
                            ? 'bg-[var(--accent)] text-[var(--accent-ink)] font-bold shadow-sm'
                            : 'bg-[var(--canvas)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]'
                        }`}
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes & Technique Tips */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                    Notas y Consejos de Técnica (Opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. RIR 2, tempo excéntrico 3 segundos, retracción escapular..."
                    className="w-full px-3 py-2 bg-[var(--canvas)] border border-[var(--border)] rounded-xl text-xs text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] text-xs font-semibold rounded-xl hover:bg-[var(--surface-muted)] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[linear-gradient(135deg,var(--surface-raised),var(--surface))]   hover: hover: text-[var(--accent-ink)] text-xs font-bold rounded-xl shadow-[0_4px_15px_rgba(249,115,22,0.3)] transition-transform active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Guardar Ejercicio</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
