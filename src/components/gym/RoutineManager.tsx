import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Edit3, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Layers, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Search,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { WorkoutRoutine, Exercise, MuscleGroup } from '../../types';
import ExerciseEditorModal from './ExerciseEditorModal';

interface RoutineManagerProps {
  routines: WorkoutRoutine[];
  onSaveRoutine: (routine: WorkoutRoutine) => void;
  onDeleteRoutine: (routineId: string) => void;
  onDuplicateRoutine: (routineId: string) => void;
  onSelectRoutineToTrain?: (routineId: string) => void;
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

const muscleColors: Record<MuscleGroup, string> = {
  Pecho: 'bg-red-950/40 text-red-400 border-red-800/40',
  Espalda: 'bg-indigo-950/40 text-indigo-400 border-indigo-800/40',
  Hombros: 'bg-amber-950/40 text-amber-400 border-amber-800/40',
  Bíceps: 'bg-purple-950/40 text-purple-400 border-purple-800/40',
  Tríceps: 'bg-rose-950/40 text-rose-400 border-rose-800/40',
  Cuádriceps: 'bg-orange-950/40 text-orange-400 border-orange-800/40',
  Isquios: 'bg-yellow-950/40 text-yellow-400 border-yellow-800/40',
  Glúteos: 'bg-pink-950/40 text-pink-400 border-pink-800/40',
  Gemelos: 'bg-teal-950/40 text-teal-400 border-teal-800/40',
  'Core / Abdomen': 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40',
  'Cardio / Movilidad': 'bg-cyan-950/40 text-cyan-400 border-cyan-800/40',
};

export default function RoutineManager({
  routines,
  onSaveRoutine,
  onDeleteRoutine,
  onDuplicateRoutine,
  onSelectRoutineToTrain,
}: RoutineManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(routines[0]?.id || null);

  // Routine Meta Edit Modal
  const [isMetaModalOpen, setIsMetaModalOpen] = useState(false);
  const [editingRoutineMeta, setEditingRoutineMeta] = useState<WorkoutRoutine | null>(null);

  // Routine Meta Form state
  const [formName, setFormName] = useState('');
  const [formShortName, setFormShortName] = useState('');
  const [formMinutes, setFormMinutes] = useState(60);
  const [formMuscles, setFormMuscles] = useState<MuscleGroup[]>(['Pecho', 'Tríceps']);

  // Exercise Editor Modal state
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [targetRoutineId, setTargetRoutineId] = useState<string>('');
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

  // Open create routine meta
  const handleOpenCreateRoutine = () => {
    setEditingRoutineMeta(null);
    setFormName('');
    setFormShortName('');
    setFormMinutes(60);
    setFormMuscles(['Pecho', 'Hombros']);
    setIsMetaModalOpen(true);
  };

  // Open edit routine meta
  const handleOpenEditRoutine = (routine: WorkoutRoutine) => {
    setEditingRoutineMeta(routine);
    setFormName(routine.name);
    setFormShortName(routine.shortName);
    setFormMinutes(routine.estimatedMinutes || 60);
    setFormMuscles(routine.targetMuscles || []);
    setIsMetaModalOpen(true);
  };

  // Toggle muscle in form
  const handleToggleMuscle = (m: MuscleGroup) => {
    setFormMuscles(prev => 
      prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]
    );
  };

  // Save routine metadata
  const handleSaveRoutineMeta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingRoutineMeta) {
      // Update existing
      const updated: WorkoutRoutine = {
        ...editingRoutineMeta,
        name: formName.trim(),
        shortName: formShortName.trim() || formName.trim().substring(0, 10),
        estimatedMinutes: formMinutes,
        targetMuscles: formMuscles.length > 0 ? formMuscles : ['Pecho'],
      };
      onSaveRoutine(updated);
    } else {
      // Create new empty routine
      const newRoutine: WorkoutRoutine = {
        id: `routine-${Date.now()}`,
        name: formName.trim(),
        shortName: formShortName.trim() || formName.trim().substring(0, 10),
        estimatedMinutes: formMinutes,
        targetMuscles: formMuscles.length > 0 ? formMuscles : ['Pecho'],
        exercises: [],
      };
      onSaveRoutine(newRoutine);
      setExpandedRoutineId(newRoutine.id);
    }

    setIsMetaModalOpen(false);
  };

  // Exercise handlers inside routine
  const handleOpenAddExercise = (routineId: string) => {
    setTargetRoutineId(routineId);
    setEditingExercise(null);
    setIsExerciseModalOpen(true);
  };

  const handleOpenEditExercise = (routineId: string, ex: Exercise) => {
    setTargetRoutineId(routineId);
    setEditingExercise(ex);
    setIsExerciseModalOpen(true);
  };

  const handleSaveExerciseToRoutine = (exercise: Exercise) => {
    const routine = routines.find(r => r.id === targetRoutineId);
    if (!routine) return;

    const existingIndex = routine.exercises.findIndex(e => e.id === exercise.id);
    let updatedExercises: Exercise[];

    if (existingIndex >= 0) {
      updatedExercises = routine.exercises.map((e, idx) => 
        idx === existingIndex ? exercise : e
      );
    } else {
      updatedExercises = [...routine.exercises, exercise];
    }

    // Auto-update target muscles if new exercise brings in a new group
    const muscles = Array.from(new Set([...routine.targetMuscles, exercise.muscleGroup]));

    onSaveRoutine({
      ...routine,
      exercises: updatedExercises,
      targetMuscles: muscles,
    });
  };

  const handleDeleteExercise = (routineId: string, exerciseId: string) => {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;

    const updatedExercises = routine.exercises.filter(e => e.id !== exerciseId);
    onSaveRoutine({
      ...routine,
      exercises: updatedExercises,
    });
  };

  const handleMoveExercise = (routineId: string, index: number, direction: 'up' | 'down') => {
    const routine = routines.find(r => r.id === routineId);
    if (!routine) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= routine.exercises.length) return;

    const newExercises = [...routine.exercises];
    const temp = newExercises[index];
    newExercises[index] = newExercises[targetIndex];
    newExercises[targetIndex] = temp;

    onSaveRoutine({
      ...routine,
      exercises: newExercises,
    });
  };

  // Filter routines by search
  const filteredRoutines = routines.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.targetMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentRoutineForModal = routines.find(r => r.id === targetRoutineId);

  return (
    <div className="flex flex-col gap-5 px-6 pb-20">
      {/* Header Info & Add Routine Button */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Dumbbell size={18} className="text-orange-400" />
              Gestor de Rutinas & Ejercicios
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Crea, modifica o personaliza las rutinas y ejercicios de tu arsenal.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateRoutine}
            className="px-3 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-[0_4px_12px_rgba(249,115,22,0.3)] flex items-center gap-1.5 transition-transform active:scale-95 shrink-0"
          >
            <Plus size={14} />
            <span>Nueva Rutina</span>
          </button>
        </div>

        {/* Search filter */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar rutina o grupo muscular..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
      </div>

      {/* Routines List */}
      <div className="flex flex-col gap-3.5">
        {filteredRoutines.length === 0 ? (
          <div className="text-center py-10 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6">
            <Dumbbell size={32} className="mx-auto text-slate-600 mb-2" />
            <h4 className="text-sm font-semibold text-slate-300">No hay rutinas que coincidan</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4">Crea una nueva rutina para comenzar.</p>
            <button
              type="button"
              onClick={handleOpenCreateRoutine}
              className="px-4 py-2 bg-orange-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Crear Rutina
            </button>
          </div>
        ) : (
          filteredRoutines.map((routine) => {
            const isExpanded = expandedRoutineId === routine.id;
            const totalSets = routine.exercises.reduce((acc, e) => acc + e.sets.length, 0);

            return (
              <div
                key={routine.id}
                className={`bg-slate-900/40 border rounded-2xl transition-all overflow-hidden ${
                  isExpanded ? 'border-orange-500/40 shadow-lg' : 'border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Routine Card Header */}
                <div 
                  onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                  className="p-4 cursor-pointer flex flex-col gap-2 hover:bg-slate-850/30"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-md uppercase font-mono">
                          {routine.shortName}
                        </span>
                        <span className="text-xs text-slate-400">
                          {routine.exercises.length} ejercicios • {totalSets} series • ~{routine.estimatedMinutes || 60}m
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white">
                        {routine.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditRoutine(routine)}
                        className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                        title="Editar nombre y músculos"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateRoutine(routine.id)}
                        className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                        title="Duplicar rutina"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteRoutine(routine.id)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Eliminar rutina"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                        className="p-1.5 text-slate-400"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Muscle Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                    {routine.targetMuscles.map(m => (
                      <span
                        key={m}
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                          muscleColors[m] || 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expanded Exercises Section */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/40 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers size={13} className="text-orange-400" />
                        Ejercicios de la Rutina ({routine.exercises.length})
                      </span>

                      <button
                        type="button"
                        onClick={() => handleOpenAddExercise(routine.id)}
                        className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-xl transition-colors"
                      >
                        <Plus size={13} />
                        <span>Añadir Ejercicio</span>
                      </button>
                    </div>

                    {/* Exercise items list */}
                    {routine.exercises.length === 0 ? (
                      <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
                        <p className="text-xs text-slate-400">Esta rutina no tiene ejercicios todavía.</p>
                        <button
                          type="button"
                          onClick={() => handleOpenAddExercise(routine.id)}
                          className="mt-2 text-xs font-bold text-orange-400 hover:underline inline-flex items-center gap-1"
                        >
                          <Plus size={12} /> Añadir primer ejercicio
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {routine.exercises.map((ex, idx) => (
                          <div
                            key={ex.id}
                            className="bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-3 flex items-center justify-between gap-3 group"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-400 font-mono text-[10px] flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-semibold text-white truncate">
                                    {ex.name}
                                  </h5>
                                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${
                                    muscleColors[ex.muscleGroup] || 'bg-slate-800 text-slate-400'
                                  }`}>
                                    {ex.muscleGroup}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                                  <span>{ex.sets.length} series x {ex.sets[0]?.reps || 10} reps</span>
                                  {ex.sets[0]?.weightKg ? <span>• {ex.sets[0].weightKg}kg</span> : null}
                                  <span>• ⏱ {ex.restSeconds || 90}s</span>
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveExercise(routine.id, idx, 'up')}
                                className={`p-1 text-slate-500 hover:text-slate-200 transition-colors ${
                                  idx === 0 ? 'opacity-20 cursor-not-allowed' : ''
                                }`}
                                title="Subir orden"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                type="button"
                                disabled={idx === routine.exercises.length - 1}
                                onClick={() => handleMoveExercise(routine.id, idx, 'down')}
                                className={`p-1 text-slate-500 hover:text-slate-200 transition-colors ${
                                  idx === routine.exercises.length - 1 ? 'opacity-20 cursor-not-allowed' : ''
                                }`}
                                title="Bajar orden"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEditExercise(routine.id, ex)}
                                className="p-1.5 text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                                title="Editar series y peso"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExercise(routine.id, ex.id)}
                                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Eliminar ejercicio"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Routine Metadata Editor Modal */}
      <AnimatePresence>
        {isMetaModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMetaModalOpen(false)}
              className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md"
            />

            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-[#0E0E0E] border-t sm:border border-slate-800/80 rounded-t-[32px] sm:rounded-3xl p-6 pb-8 w-full max-w-md flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Dumbbell size={16} className="text-orange-400" />
                  {editingRoutineMeta ? 'Editar Rutina' : 'Crear Nueva Rutina'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMetaModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800"
                >
                  <X size={14} />
                </button>
              </div>

              <form onSubmit={handleSaveRoutineMeta} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ej. Push A — Pecho Pesado & Hombro"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Nombre Corto (Etiqueta)
                    </label>
                    <input
                      type="text"
                      value={formShortName}
                      onChange={(e) => setFormShortName(e.target.value)}
                      placeholder="Ej. Push A"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Minutos Estimados
                    </label>
                    <input
                      type="number"
                      value={formMinutes}
                      onChange={(e) => setFormMinutes(parseInt(e.target.value) || 60)}
                      placeholder="60"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Músculos Trabajados
                  </label>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto scrollbar-hide p-1 bg-slate-950 rounded-xl border border-slate-800">
                    {MUSCLE_GROUPS.map(m => {
                      const isSelected = formMuscles.includes(m);
                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => handleToggleMuscle(m)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-colors ${
                            isSelected
                              ? 'bg-orange-500 text-slate-950 border-orange-400 shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsMetaModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-[0_4px_12px_rgba(249,115,22,0.3)]"
                  >
                    Guardar Rutina
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Exercise Editor Modal */}
      <ExerciseEditorModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onSaveExercise={handleSaveExerciseToRoutine}
        initialExercise={editingExercise}
        routineName={currentRoutineForModal?.name || 'Rutina'}
      />
    </div>
  );
}
