import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Trophy, 
  Flame, 
  Calendar, 
  Sparkles, 
  Plus, 
  Layers, 
  CheckCircle2, 
  Timer,
  BarChart2,
  Award,
  X,
  Play,
  CalendarDays,
  ListOrdered
} from 'lucide-react';
import { Target } from 'lucide-react';
import { WorkoutSplit, WorkoutRoutine, Exercise, GymDayLog, Activity, GymProgramSettings } from '../types';
import { DEFAULT_SPLITS, UPPER_LOWER_SPLIT } from '../data/gymPresets';
import { formatDateKey, parseDateKey, getWeekDays } from '../components/WeeklyCalendar';
import GymCalendar from '../components/gym/GymCalendar';
import RoutineDayDetail from '../components/gym/RoutineDayDetail';
import SplitSelectorModal from '../components/gym/SplitSelectorModal';
import AddExerciseModal from '../components/gym/AddExerciseModal';
import ActiveGuidedWorkout from '../components/gym/ActiveGuidedWorkout';
import FloatingWorkoutBar from '../components/gym/FloatingWorkoutBar';
import WeeklyPlanner from '../components/gym/WeeklyPlanner';
import RoutineManager from '../components/gym/RoutineManager';
import ProgressTracker from '../components/gym/ProgressTracker';
import ProgramSettingsModal from '../components/gym/ProgramSettingsModal';

interface GymViewProps {
  onAddActivity?: (activity: Omit<Activity, 'id' | 'isCompleted'>) => void;
}

export type GymSubTab = 'today' | 'planner' | 'routines' | 'progress';

export default function GymView({ onAddActivity }: GymViewProps) {
  // Active sub-tab in Gym
  const [gymSubTab, setGymSubTab] = useState<GymSubTab>('today');

  // Saved splits in state
  const [splits, setSplits] = useState<WorkoutSplit[]>(() => {
    const saved = localStorage.getItem('gym_splits_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_SPLITS;
      }
    }
    return DEFAULT_SPLITS;
  });

  const [activeSplitId, setActiveSplitId] = useState<string>(() => {
    return localStorage.getItem('gym_active_split_id_v3') || UPPER_LOWER_SPLIT.id;
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateKey(new Date()));

  // Custom week schedules map (weekKey -> Record<dayNum, routineId>)
  const [customWeekSchedules, setCustomWeekSchedules] = useState<Record<string, Record<number, string>>>(() => {
    const saved = localStorage.getItem('gym_custom_week_schedules_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return {}; }
    }
    return {};
  });

  // Gym day logs (completed sets & workouts)
  const [gymLogs, setGymLogs] = useState<Record<string, GymDayLog>>(() => {
    const saved = localStorage.getItem('gym_logs_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Program Settings state
  const [programSettings, setProgramSettings] = useState<GymProgramSettings | null>(() => {
    const saved = localStorage.getItem('gym_program_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return null;
  });
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);

  // Modal states
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isAddExModalOpen, setIsAddExModalOpen] = useState(false);
  const [isGuidedWorkoutOpen, setIsGuidedWorkoutOpen] = useState(false);
  const [workoutFinishedSummary, setWorkoutFinishedSummary] = useState<{
    routineName: string;
    durationMinutes: number;
    setsCompleted: number;
  } | null>(null);

  // Dynamic Workout Session Stopwatch State
  const [workoutSeconds, setWorkoutSeconds] = useState<number>(0);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState<boolean>(false);

  // Dynamic Rest Countdown Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState<number>(90);
  const [restTargetSeconds, setRestTargetSeconds] = useState<number>(90);
  const [isRestRunning, setIsRestRunning] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gym_splits_v3', JSON.stringify(splits));
  }, [splits]);

  useEffect(() => {
    localStorage.setItem('gym_active_split_id_v3', activeSplitId);
  }, [activeSplitId]);

  useEffect(() => {
    localStorage.setItem('gym_logs_v3', JSON.stringify(gymLogs));
  }, [gymLogs]);

  useEffect(() => {
    localStorage.setItem('gym_custom_week_schedules_v3', JSON.stringify(customWeekSchedules));
  }, [customWeekSchedules]);

  useEffect(() => {
    if (programSettings) {
      localStorage.setItem('gym_program_settings', JSON.stringify(programSettings));
    } else {
      localStorage.removeItem('gym_program_settings');
    }
  }, [programSettings]);

  // Calculate current program week
  const getProgramProgress = () => {
    if (!programSettings) return null;
    const start = new Date(programSettings.startDate);
    start.setHours(0, 0, 0, 0);
    const now = new Date();
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
    
    if (diffDays < 0) return { currentWeek: 0, isFinished: false };
    
    const currentWeek = Math.floor(diffDays / 7) + 1;
    const isFinished = currentWeek > programSettings.durationWeeks;
    return { currentWeek, isFinished };
  };

  const progStats = getProgramProgress();

  // Find active split object
  const activeSplit = splits.find(s => s.id === activeSplitId) || splits[0] || UPPER_LOWER_SPLIT;

  // Selected date parsed & week schedule calculation
  const selectedParsed = parseDateKey(selectedDate);
  const selectedDayOfWeek = selectedParsed.getDay(); // 0 is Sunday, 1 is Monday
  const selectedWeekMonday = getWeekDays(selectedParsed)[0];
  const selectedWeekKey = formatDateKey(selectedWeekMonday);

  const activeWeekSchedule = customWeekSchedules[selectedWeekKey] || activeSplit.schedule;

  // Routine assigned to selected day in split schedule
  const assignedRoutineId = activeWeekSchedule[selectedDayOfWeek];
  const isRestDay = !assignedRoutineId || assignedRoutineId === 'REST';

  // State to switch/view any routine among all workouts of the split
  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(() => {
    if (assignedRoutineId && assignedRoutineId !== 'REST') {
      return assignedRoutineId;
    }
    return activeSplit.routines[0]?.id || '';
  });

  // Update selected routine when date or schedule changes
  useEffect(() => {
    if (assignedRoutineId && assignedRoutineId !== 'REST') {
      setSelectedRoutineId(assignedRoutineId);
    } else if (activeSplit.routines.length > 0 && !activeSplit.routines.some(r => r.id === selectedRoutineId)) {
      setSelectedRoutineId(activeSplit.routines[0].id);
    }
  }, [selectedDate, assignedRoutineId, activeSplit]);

  const currentRoutine = activeSplit.routines.find(r => r.id === selectedRoutineId) || 
    (assignedRoutineId && assignedRoutineId !== 'REST' ? activeSplit.routines.find(r => r.id === assignedRoutineId) : null) || 
    activeSplit.routines[0] || null;

  // Current day's log
  const currentLog = gymLogs[selectedDate];

  // Stopwatch ticking interval
  useEffect(() => {
    let interval: any = null;
    if (isWorkoutRunning) {
      interval = setInterval(() => {
        setWorkoutSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWorkoutRunning]);

  // Audio Chime trigger for rest timer completion
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const audioCtx = new AudioContextClass();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
      }
    } catch (e) {
      // suppressed in sandbox
    }
  };

  // Rest Countdown ticking interval
  useEffect(() => {
    let interval: any = null;
    if (isRestRunning && restSecondsLeft > 0) {
      interval = setInterval(() => {
        setRestSecondsLeft(prev => {
          if (prev <= 1) {
            playChime();
            setIsRestRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRestRunning, restSecondsLeft]);

  // Calculate Streak & Totals
  const totalCompletedWorkouts = (Object.values(gymLogs) as GymDayLog[]).filter(l => l.isCompleted).length;
  
  const calculateStreak = () => {
    let streak = 0;
    const checkDate = new Date();
    
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(checkDate.getDate() - i);
      const key = formatDateKey(d);
      const dayOfWeek = d.getDay();
      const mondayOfD = getWeekDays(d)[0];
      const wKey = formatDateKey(mondayOfD);
      const sched = customWeekSchedules[wKey] || activeSplit.schedule;
      const routineId = sched[dayOfWeek];
      const isRest = !routineId || routineId === 'REST';
      
      if (gymLogs[key]?.isCompleted) {
        streak++;
      } else if (isRest) {
        continue;
      } else if (i === 0) {
        continue;
      } else {
        break;
      }
    }
    return streak;
  };

  const streakDays = calculateStreak();

  // Handlers
  const handleSelectSplit = (newSplitId: string) => {
    setActiveSplitId(newSplitId);
    const newSplit = splits.find(s => s.id === newSplitId);
    if (newSplit && newSplit.routines.length > 0) {
      setSelectedRoutineId(newSplit.routines[0].id);
    }
  };

  const handleUpdateSplitSchedule = (splitId: string, newSchedule: Record<number, string>) => {
    setSplits(prev => prev.map(s => {
      if (s.id === splitId) {
        return { ...s, schedule: newSchedule };
      }
      return s;
    }));
  };

  // Weekly Planner schedule update handler
  const handleUpdateWeekSchedule = (newSchedule: Record<number, string>, weekKey?: string) => {
    if (weekKey) {
      setCustomWeekSchedules(prev => ({
        ...prev,
        [weekKey]: newSchedule,
      }));
    } else {
      // update current active split schedule directly
      handleUpdateSplitSchedule(activeSplitId, newSchedule);
    }
  };

  // Routine manager save/update
  const handleSaveRoutine = (routine: WorkoutRoutine) => {
    setSplits(prev => prev.map(s => {
      if (s.id !== activeSplit.id) return s;

      const idx = s.routines.findIndex(r => r.id === routine.id);
      let updatedRoutines: WorkoutRoutine[];
      if (idx >= 0) {
        updatedRoutines = s.routines.map((r, i) => i === idx ? routine : r);
      } else {
        updatedRoutines = [...s.routines, routine];
      }

      return {
        ...s,
        routines: updatedRoutines,
      };
    }));
  };

  const handleDeleteRoutine = (routineId: string) => {
    setSplits(prev => prev.map(s => {
      if (s.id !== activeSplit.id) return s;
      return {
        ...s,
        routines: s.routines.filter(r => r.id !== routineId),
      };
    }));
  };

  const handleDuplicateRoutine = (routineId: string) => {
    const routine = activeSplit.routines.find(r => r.id === routineId);
    if (!routine) return;

    const duplicated: WorkoutRoutine = {
      ...routine,
      id: `routine-${Date.now()}`,
      name: `${routine.name} (Copia)`,
      shortName: `${routine.shortName} +`,
      exercises: routine.exercises.map(e => ({
        ...e,
        id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sets: e.sets.map(s => ({
          ...s,
          id: `set-${Date.now()}-${s.setNumber}`,
          isCompleted: false,
        })),
      })),
    };

    handleSaveRoutine(duplicated);
  };

  // Toggle set completion and dynamically trigger rest timer!
  const handleToggleSet = (exerciseId: string, setNumber: number) => {
    const setKey = `${exerciseId}_${setNumber}`;
    const prevChecked = currentLog?.completedSets?.[setKey] || false;
    const nextChecked = !prevChecked;

    setGymLogs(prev => {
      const existing = prev[selectedDate] || {
        date: selectedDate,
        routineId: currentRoutine?.id || '',
        isCompleted: false,
        completedSets: {},
      };

      const newCompletedSets = {
        ...existing.completedSets,
        [setKey]: nextChecked,
      };

      return {
        ...prev,
        [selectedDate]: {
          ...existing,
          completedSets: newCompletedSets,
        },
      };
    });

    // Auto-start workout stopwatch if not already running
    if (!isWorkoutRunning && workoutSeconds === 0) {
      setIsWorkoutRunning(true);
    }

    // Auto-trigger dynamic rest countdown on marking set as done!
    if (nextChecked) {
      const ex = currentRoutine?.exercises.find(e => e.id === exerciseId);
      const restDuration = ex?.restSeconds || 90;
      setRestTargetSeconds(restDuration);
      setRestSecondsLeft(restDuration);
      setIsRestRunning(true);
    }
  };

  const handleUpdateSetData = (exerciseId: string, setNumber: number, reps: string, weightKg: number) => {
    if (!currentRoutine) return;
    setSplits(prev => prev.map(split => {
      if (split.id !== activeSplit.id) return split;

      return {
        ...split,
        routines: split.routines.map(rt => {
          if (rt.id !== currentRoutine.id) return rt;
          return {
            ...rt,
            exercises: rt.exercises.map(ex => {
              if (ex.id !== exerciseId) return ex;
              return {
                ...ex,
                sets: ex.sets.map(st => {
                  if (st.setNumber === setNumber) {
                    return { ...st, reps, weightKg };
                  }
                  return st;
                }),
              };
            }),
          };
        }),
      };
    }));
  };

  const handleAddExercise = (newExercise: Exercise) => {
    if (!currentRoutine) return;
    setSplits(prev => prev.map(split => {
      if (split.id !== activeSplit.id) return split;
      return {
        ...split,
        routines: split.routines.map(rt => {
          if (rt.id !== currentRoutine.id) return rt;
          return {
            ...rt,
            exercises: [...rt.exercises, newExercise],
          };
        }),
      };
    }));
  };

  const handleDeleteExercise = (exerciseId: string) => {
    if (!currentRoutine) return;
    setSplits(prev => prev.map(split => {
      if (split.id !== activeSplit.id) return split;
      return {
        ...split,
        routines: split.routines.map(rt => {
          if (rt.id !== currentRoutine.id) return rt;
          return {
            ...rt,
            exercises: rt.exercises.filter(e => e.id !== exerciseId),
          };
        }),
      };
    }));
  };

  // Workout Session Controls
  const handleStartWorkout = () => {
    setIsWorkoutRunning(true);
    setIsGuidedWorkoutOpen(true);
  };

  const handlePauseWorkout = () => {
    setIsWorkoutRunning(false);
  };

  const handleResumeWorkout = () => {
    setIsWorkoutRunning(true);
  };

  const handleFinishWorkout = () => {
    setIsWorkoutRunning(false);
    setIsRestRunning(false);
    setIsGuidedWorkoutOpen(false);

    // Count sets completed
    let setsCount = 0;
    if (currentRoutine) {
      currentRoutine.exercises.forEach(ex => {
        ex.sets.forEach(s => {
          if (currentLog?.completedSets?.[`${ex.id}_${s.setNumber}`]) {
            setsCount++;
          }
        });
      });
    }

    const durationMins = Math.max(1, Math.round(workoutSeconds / 60));

    // Save as completed
    setGymLogs(prev => {
      const existing = prev[selectedDate] || {
        date: selectedDate,
        routineId: currentRoutine?.id || '',
        isCompleted: false,
        completedSets: {},
      };

      const performances: Record<string, { reps: string | number; weightKg: number }[]> = {};
      if (currentRoutine) {
        currentRoutine.exercises.forEach(ex => {
          const completedForEx: { reps: string | number; weightKg: number }[] = [];
          ex.sets.forEach(s => {
            if (existing.completedSets[`${ex.id}_${s.setNumber}`]) {
              completedForEx.push({
                reps: s.reps,
                weightKg: s.weightKg || 0
              });
            }
          });
          
          if (completedForEx.length > 0) {
            const exKey = ex.name.trim().toLowerCase();
            performances[exKey] = completedForEx;
          }
        });
      }

      return {
        ...prev,
        [selectedDate]: {
          ...existing,
          isCompleted: true,
          durationMinutes: durationMins,
          performances,
        },
      };
    });

    // Sync with agenda
    if (onAddActivity && currentRoutine) {
      const now = new Date();
      const endH = String(now.getHours()).padStart(2, '0');
      const endM = String(now.getMinutes()).padStart(2, '0');
      const startD = new Date(now.getTime() - workoutSeconds * 1000);
      const startH = String(startD.getHours()).padStart(2, '0');
      const startM = String(startD.getMinutes()).padStart(2, '0');

      onAddActivity({
        title: `Gym: ${currentRoutine.shortName}`,
        category: 'Gym',
        date: selectedDate,
        startTime: `${startH}:${startM}`,
        endTime: `${endH}:${endM}`,
        description: `Sesión de ${currentRoutine.name} completada en ${durationMins} min.`,
      });
    }

    // Show summary modal
    setWorkoutFinishedSummary({
      routineName: currentRoutine?.name || 'Entrenamiento',
      durationMinutes: durationMins,
      setsCompleted: setsCount,
    });
  };

  // Rest Timer Controls
  const handleStartRest = (seconds: number = 90) => {
    setRestTargetSeconds(seconds);
    setRestSecondsLeft(seconds);
    setIsRestRunning(true);
  };

  const handleAdjustRest = (delta: number) => {
    setRestSecondsLeft(prev => Math.max(0, prev + delta));
    setRestTargetSeconds(prev => Math.max(0, prev + delta));
  };

  const handleSkipRest = () => {
    setIsRestRunning(false);
    setRestSecondsLeft(0);
  };

  return (
    <div className="min-h-full pb-6 flex flex-col relative">
      {/* Gym command header */}
      <header className="px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm text-[var(--text-muted)]">Movimiento</p>
            <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-[var(--text)]">Entrenamiento</h1>
            <p className="mt-1 truncate text-sm text-[var(--text-faint)]">{activeSplit.name}</p>
          </div>
          <button type="button" onClick={() => setIsSplitModalOpen(true)} className="ui-button-secondary shrink-0 px-3">
            <Layers size={17} />
            <span>Planes</span>
          </button>
        </div>

        {programSettings && progStats ? (
          <button type="button" onClick={() => setIsProgramModalOpen(true)} className="ui-card-raised mt-5 flex w-full items-center justify-between gap-4 p-4 text-left">
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><Target size={18} /></span>
              <span className="min-w-0">
                <span className="block text-xs font-medium text-[var(--text-muted)]">Programa activo</span>
                <span className="mt-0.5 block truncate text-sm font-semibold text-[var(--text)]">
                  {progStats.currentWeek === 0 ? 'Inicia pronto' : progStats.isFinished ? 'Programa finalizado' : `Semana ${progStats.currentWeek} de ${programSettings.durationWeeks}`}
                </span>
              </span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-[10px] uppercase tracking-[0.1em] text-[var(--text-faint)]">Objetivo</span>
              <span className="mt-1 block text-sm font-semibold text-[var(--text)]">{programSettings.targetWeight} kg</span>
            </span>
          </button>
        ) : (
          <button type="button" onClick={() => setIsProgramModalOpen(true)} className="mt-5 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--border-strong)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text)]">
            <Target size={17} />
            <span>Configurar programa y objetivo</span>
          </button>
        )}

        <nav aria-label="Secciones de entrenamiento" className="mt-4 grid grid-cols-4 gap-1 rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-1.5">
          {([
            { id: 'today', label: 'Hoy', icon: Dumbbell },
            { id: 'planner', label: 'Semana', icon: CalendarDays },
            { id: 'routines', label: 'Rutinas', icon: ListOrdered },
            { id: 'progress', label: 'Progreso', icon: BarChart2 },
          ] as const).map(({ id, label, icon: Icon }) => {
            const selected = gymSubTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setGymSubTab(id)}
                aria-current={selected ? 'page' : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-[15px] text-[10px] font-medium transition-colors ${selected ? 'border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--text)]' : 'border border-transparent text-[var(--text-faint)] hover:text-[var(--text-muted)]'}`}
              >
                <Icon size={17} className={selected ? 'text-[var(--accent)]' : ''} />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-col pt-2">
        {/* SUBTAB 1: TODAY / ACTIVE WORKOUT */}
        {gymSubTab === 'today' && (
          <>
            {/* Quiet performance summary */}
            <div className="mb-5 grid grid-cols-2 gap-3 px-5">
              <section className="ui-card p-4">
                <div className="flex items-center justify-between text-[var(--text-muted)]"><span className="text-xs font-medium">Racha</span><Trophy size={17} /></div>
                <p className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">{streakDays}</p>
                <p className="mt-1 text-xs text-[var(--text-faint)]">días consecutivos</p>
              </section>
              <section className="ui-card p-4">
                <div className="flex items-center justify-between text-[var(--text-muted)]"><span className="text-xs font-medium">Sesiones</span><CheckCircle2 size={17} /></div>
                <p className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">{totalCompletedWorkouts}</p>
                <p className="mt-1 text-xs text-[var(--text-faint)]">completadas</p>
              </section>
            </div>

            {/* Dynamic Gym Calendar (Week + Month) */}
            <GymCalendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              activeSplit={activeSplit}
              gymLogs={gymLogs}
              onOpenSplitSelector={() => setIsSplitModalOpen(true)}
              customWeekSchedules={customWeekSchedules}
            />

            {/* Clean Routine Detail View & Quick Guided Launcher */}
            <RoutineDayDetail
              dateKey={selectedDate}
              routine={currentRoutine}
              allRoutines={activeSplit.routines}
              selectedRoutineId={selectedRoutineId}
              onSelectRoutine={setSelectedRoutineId}
              scheduledRoutineId={assignedRoutineId}
              isRestDay={isRestDay}
              dayLog={currentLog}
              onToggleSet={handleToggleSet}
              onUpdateSet={handleUpdateSetData}
              onAddExerciseClick={() => setIsAddExModalOpen(true)}
              onDeleteExercise={handleDeleteExercise}
              onOpenGuidedWorkout={() => {
                if (!isWorkoutRunning && workoutSeconds === 0) {
                  setIsWorkoutRunning(true);
                }
                setIsGuidedWorkoutOpen(true);
              }}
              workoutSeconds={workoutSeconds}
              isWorkoutRunning={isWorkoutRunning}
              onSelectAlternativeRoutine={() => setIsSplitModalOpen(true)}
            />
          </>
        )}

        {/* SUBTAB 2: WEEKLY PLANNER (DEFINE QUÉ SE HARÁ EN LA SEMANA) */}
        {gymSubTab === 'planner' && (
          <WeeklyPlanner
            currentSplit={activeSplit}
            allSplits={splits}
            allRoutines={activeSplit.routines}
            onUpdateWeekSchedule={handleUpdateWeekSchedule}
            onSelectRoutineToEdit={(routineId) => {
              setSelectedRoutineId(routineId);
              setGymSubTab('routines');
            }}
            onOpenCreateRoutine={() => {
              setGymSubTab('routines');
            }}
          />
        )}

        {/* SUBTAB 3: ROUTINE & EXERCISE BUILDER */}
        {gymSubTab === 'routines' && (
          <RoutineManager
            routines={activeSplit.routines}
            onSaveRoutine={handleSaveRoutine}
            onDeleteRoutine={handleDeleteRoutine}
            onDuplicateRoutine={handleDuplicateRoutine}
            onSelectRoutineToTrain={(routineId) => {
              setSelectedRoutineId(routineId);
              setGymSubTab('today');
            }}
          />
        )}

        {/* SUBTAB 4: PROGRESS TRACKING */}
        {gymSubTab === 'progress' && (
          <ProgressTracker 
            gymLogs={gymLogs} 
            programSettings={programSettings} 
            onUpdateSettings={setProgramSettings}
            onOpenSettings={() => setIsProgramModalOpen(true)}
          />
        )}
      </div>

      {/* Floating Mini Workout Bar (when workout is active and guided modal is minimized) */}
      {currentRoutine && (workoutSeconds > 0 || isWorkoutRunning) && !isGuidedWorkoutOpen && (
        <FloatingWorkoutBar
          routine={currentRoutine}
          workoutSeconds={workoutSeconds}
          isWorkoutRunning={isWorkoutRunning}
          onToggleWorkoutTimer={() => setIsWorkoutRunning(!isWorkoutRunning)}
          restSecondsLeft={restSecondsLeft}
          isRestRunning={isRestRunning}
          onExpand={() => setIsGuidedWorkoutOpen(true)}
          dayLog={currentLog}
        />
      )}

      {/* Fullscreen Guided Workout Experience (Focus Mode) */}
      {currentRoutine && (
        <ActiveGuidedWorkout
          isOpen={isGuidedWorkoutOpen}
          onClose={() => setIsGuidedWorkoutOpen(false)}
          routine={currentRoutine}
          dayLog={currentLog}
          onToggleSet={handleToggleSet}
          onUpdateSet={handleUpdateSetData}
          onFinishWorkout={handleFinishWorkout}
          workoutSeconds={workoutSeconds}
          isWorkoutRunning={isWorkoutRunning}
          onStartWorkout={handleStartWorkout}
          onPauseWorkout={handlePauseWorkout}
          onResumeWorkout={handleResumeWorkout}
          restSecondsLeft={restSecondsLeft}
          restTargetSeconds={restTargetSeconds}
          isRestRunning={isRestRunning}
          onStartRest={handleStartRest}
          onAdjustRest={handleAdjustRest}
          onSkipRest={handleSkipRest}
        />
      )}

      {/* Program Settings Modal */}
      <ProgramSettingsModal
        isOpen={isProgramModalOpen}
        onClose={() => setIsProgramModalOpen(false)}
        currentSettings={programSettings}
        onSave={(settings) => setProgramSettings(settings)}
        onClear={() => setProgramSettings(null)}
      />

      {/* Split Selector & Schedule Customizer Modal */}
      <SplitSelectorModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        splits={splits}
        activeSplitId={activeSplitId}
        onSelectSplit={handleSelectSplit}
        onUpdateSplitSchedule={handleUpdateSplitSchedule}
        onCreateCustomSplit={(newSplit) => {
          setSplits(prev => [...prev, newSplit]);
          setActiveSplitId(newSplit.id);
        }}
      />

      {/* Add Exercise Modal (Direct Quick Add from Today) */}
      <AddExerciseModal
        isOpen={isAddExModalOpen}
        onClose={() => setIsAddExModalOpen(false)}
        onAddExercise={handleAddExercise}
        routineName={currentRoutine?.name || 'Rutina Actual'}
      />

      {/* Workout completion summary */}
      <AnimatePresence>
        {workoutFinishedSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
            <motion.button type="button" aria-label="Cerrar resumen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setWorkoutFinishedSummary(null)} className="absolute inset-0 bg-[color:var(--surface-glass)] backdrop-blur-xl" />
            <motion.section initial={{ scale: 0.96, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0, y: 16 }} className="ui-card-raised relative z-10 w-full max-w-sm p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] bg-[var(--success-soft)] text-[var(--success)]"><Award size={27} /></div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--success)]">Sesión completada</p>
              <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">{workoutFinishedSummary.routineName}</h3>
              <p className="mt-2 text-sm text-[var(--text-muted)]">Buen trabajo. El entrenamiento quedó guardado en tu progreso.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><span className="block text-xs text-[var(--text-faint)]">Duración</span><span className="mt-1 block text-lg font-semibold text-[var(--text)]">{workoutFinishedSummary.durationMinutes} min</span></div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4"><span className="block text-xs text-[var(--text-faint)]">Series</span><span className="mt-1 block text-lg font-semibold text-[var(--text)]">{workoutFinishedSummary.setsCompleted}</span></div>
              </div>
              <button type="button" onClick={() => setWorkoutFinishedSummary(null)} className="ui-button-primary mt-6 w-full">Continuar</button>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
