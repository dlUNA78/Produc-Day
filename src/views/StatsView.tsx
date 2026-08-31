import React, { useState } from 'react';
import { 
  Activity as ActivityIcon, 
  Clock3, 
  Dumbbell, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  Flame, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Task, GymDayLog, WorkoutSplit } from '../types';
import { formatDateKey } from '../components/WeeklyCalendar';

interface StatsViewProps {
  activities?: Activity[];
  tasks?: Task[];
  onNavigateToGym?: () => void;
  onSelectDate?: (date: string) => void;
}

export default function StatsView({
  activities = [],
  tasks = [],
  onNavigateToGym,
  onSelectDate,
}: StatsViewProps) {
  const [selectedLogDetail, setSelectedLogDetail] = useState<{ date: string; log: GymDayLog } | null>(null);

  // Load gym logs from localStorage
  const gymLogs: Record<string, GymDayLog> = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('gym_daily_logs_v3');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  }, []);

  // Load splits to map routine names
  const splits: WorkoutSplit[] = React.useMemo(() => {
    try {
      const saved = localStorage.getItem('gym_splits_v3');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  // Routine lookup map
  const routineNames = React.useMemo(() => {
    const map: Record<string, string> = {};
    splits.forEach(s => {
      s.routines.forEach(r => {
        map[r.id] = r.name;
      });
    });
    return map;
  }, [splits]);

  // Compute completed gym sessions
  const logEntries = Object.entries(gymLogs);
  const completedWorkouts = logEntries.filter(([_, log]) => log.isCompleted);
  
  // This month's sessions
  const now = new Date();
  const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonthSessions = completedWorkouts.filter(([date]) => date.startsWith(currentMonthPrefix)).length;

  // Total accumulated workout minutes
  const totalMinutes = completedWorkouts.reduce((acc, [_, log]) => acc + (log.durationMinutes || 60), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // Tasks and Activities stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

  // Calculate weekly load for current week (Mon-Sun)
  // Find Monday of current week
  const dayOfWeek = now.getDay(); // 0 is Sun
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  const weekDays = [0, 1, 2, 3, 4, 5, 6].map(i => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateKey = formatDateKey(d);
    const log = gymLogs[dateKey];
    const completedSetsCount = log?.completedSets 
      ? Object.values(log.completedSets).filter(Boolean).length 
      : 0;
    const isCompleted = Boolean(log?.isCompleted);
    return {
      label: ['L', 'M', 'X', 'J', 'V', 'S', 'D'][i],
      dateKey,
      completedSetsCount,
      isCompleted,
      value: isCompleted ? Math.max(30, Math.min(100, completedSetsCount * 6 + 30)) : (completedSetsCount > 0 ? 25 : 8),
    };
  });

  return (
    <div className="min-h-full px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-12">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text)]">Progreso</h1>
        <p className="mt-1 text-sm leading-6 text-[var(--text-muted)] max-w-sm">
          Métricas de constancia en tus entrenamientos y tareas.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[24px] p-5 flex flex-col justify-between"
        >
          <div className="flex items-center gap-1.5 text-[var(--accent)] mb-3">
            <Dumbbell size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Sesiones</span>
          </div>
          <div>
            <p className="text-[36px] font-bold tracking-tight text-[var(--text)] leading-none">
              {thisMonthSessions > 0 ? thisMonthSessions : completedWorkouts.length}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {thisMonthSessions > 0 ? 'este mes' : 'completadas'}
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.08 }} 
          className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[24px] p-5 flex flex-col justify-between"
        >
          <div className="flex items-center gap-1.5 text-[var(--warning)] mb-3">
            <Clock3 size={16} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-faint)]">Tiempo</span>
          </div>
          <div>
            <p className="text-[36px] font-bold tracking-tight text-[var(--text)] leading-none">
              {totalHours}<span className="text-lg text-[var(--text-faint)] ml-1">h</span>
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">entrenando</p>
          </div>
        </motion.div>
      </div>

      {/* Weekly Load Chart */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[28px] p-6 mb-8"
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-[var(--text)]">Carga semanal</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">Volumen y entrenamientos completados (L - D)</p>
          </div>
          <span className="text-xs font-bold text-[var(--success)] px-2.5 py-1 rounded-full bg-[var(--success-soft)]">
            Activo
          </span>
        </div>
        
        <div className="flex h-32 items-end gap-2.5">
          {weekDays.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col justify-end gap-2 h-full group">
              <div 
                className={`w-full rounded-t-xl transition-all relative overflow-hidden ${
                  day.isCompleted ? 'bg-[var(--accent)]' : 'bg-[var(--surface-soft)] group-hover:bg-[var(--border-strong)]'
                }`} 
                style={{ height: `${day.value}%` }}
              >
                {day.isCompleted && (
                  <div className="absolute inset-0 bg-white/10" />
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs font-semibold text-[var(--text-faint)]">
          {weekDays.map((d, idx) => (
            <span key={idx} className={d.isCompleted ? 'text-[var(--accent)] font-bold' : ''}>
              {d.label}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Consistency Advice Banner */}
      <section className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[28px] p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center">
            <TrendingUp size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="font-bold text-[var(--text)] text-sm">Construyendo ritmo constante</h2>
            <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
              {completedWorkouts.length > 0 
                ? `Llevas un registro acumulado de ${completedWorkouts.length} entrenamientos. La consistencia semana a semana es la clave para la sobrecarga progresiva.`
                : 'Aún no has registrado sesiones completadas esta semana. ¡Inicia una rutina desde el módulo Gym para ver tu evolución aquí!'}
            </p>
          </div>
        </div>
        {onNavigateToGym && (
          <button 
            type="button" 
            onClick={onNavigateToGym}
            className="mt-4 w-full py-3 bg-[var(--surface)] hover:bg-[var(--surface-soft)] border border-[var(--border)] rounded-xl text-xs font-bold text-[var(--text)] flex items-center justify-center gap-2 transition-colors"
          >
            Ir a Entrenar al Gym
            <ArrowRight size={14} />
          </button>
        )}
      </section>

      {/* Workout History / Recent Activity */}
      <section>
        <h3 className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider mb-3 ml-2">
          Historial de Entrenamientos
        </h3>
        
        {completedWorkouts.length === 0 ? (
          <div className="p-6 rounded-[24px] bg-[var(--surface)] border border-[var(--border)] text-center text-xs text-[var(--text-muted)]">
            No hay registros de entrenamientos previos. Al completar una sesión en el Gym se guardará automáticamente aquí.
          </div>
        ) : (
          <div className="bg-[var(--surface-raised)] rounded-[24px] border border-[var(--border)] overflow-hidden divide-y divide-[var(--border)]">
            {completedWorkouts.slice(-5).reverse().map(([date, log]) => {
              const routineName = routineNames[log.routineId] || log.routineId || 'Entrenamiento';
              const completedSetsCount = log.completedSets ? Object.values(log.completedSets).filter(Boolean).length : 0;
              
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedLogDetail({ date, log })}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--surface-muted)] transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0">
                      <Dumbbell size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                        {routineName}
                      </h4>
                      <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
                        {date} • {completedSetsCount} series • {log.durationMinutes || 60} min
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[var(--text-faint)] group-hover:text-[var(--text)] transition-colors" />
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLogDetail && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLogDetail(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-[32px] sm:rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col max-h-[85dvh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div>
                  <h3 className="text-base font-bold text-[var(--text)]">
                    {routineNames[selectedLogDetail.log.routineId] || 'Sesión de Entrenamiento'}
                  </h3>
                  <p className="text-xs text-[var(--text-faint)]">{selectedLogDetail.date}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLogDetail(null)}
                  className="w-8 h-8 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="py-4 space-y-4 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-faint)]">Duración</span>
                    <p className="text-lg font-bold text-[var(--text)] mt-0.5">{selectedLogDetail.log.durationMinutes || 60} min</p>
                  </div>
                  <div className="p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-faint)]">Series Hechas</span>
                    <p className="text-lg font-bold text-[var(--text)] mt-0.5">
                      {selectedLogDetail.log.completedSets ? Object.values(selectedLogDetail.log.completedSets).filter(Boolean).length : 0}
                    </p>
                  </div>
                </div>

                {selectedLogDetail.log.notes && (
                  <div className="p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-[var(--text-faint)] block mb-1">Notas de la sesión</span>
                    <p className="text-xs text-[var(--text)]">{selectedLogDetail.log.notes}</p>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setSelectedLogDetail(null)}
                  className="w-full py-3 bg-[var(--accent)] text-[var(--accent-ink)] font-bold text-sm rounded-xl transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
