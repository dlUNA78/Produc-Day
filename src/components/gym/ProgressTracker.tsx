import React, { useMemo, useState } from 'react';
import { GymDayLog, GymProgramSettings } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, BarChart3, Dumbbell, CalendarDays, Layers, Plus, Target } from 'lucide-react';

interface ProgressTrackerProps {
  gymLogs: Record<string, GymDayLog>;
  programSettings: GymProgramSettings | null;
  onUpdateSettings?: (settings: GymProgramSettings) => void;
  onOpenSettings?: () => void;
}

export default function ProgressTracker({ gymLogs, programSettings, onUpdateSettings, onOpenSettings }: ProgressTrackerProps) {
  const [activeTab, setActiveTab] = useState<'overload' | 'exercises' | 'summary'>('overload');
  const [summaryType, setSummaryType] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedExercise, setSelectedExercise] = useState<string>('');

  // 1. Calculate Exercise History for Charts
  const exerciseHistory = useMemo(() => {
    const history: Record<string, { date: string; maxWeight: number; totalVolume: number; avgReps: number }[]> = {};

    Object.values(gymLogs).forEach(log => {
      if (log.isCompleted && log.performances) {
        Object.entries(log.performances).forEach(([exerciseName, sets]) => {
          let maxWeight = 0;
          let totalVolume = 0;
          let totalReps = 0;
          let validSets = 0;

          sets.forEach(s => {
            const w = s.weightKg || 0;
            const r = parseInt(String(s.reps)) || 0;
            if (w > maxWeight) maxWeight = w;
            totalVolume += (w * r);
            if (r > 0) {
              totalReps += r;
              validSets++;
            }
          });

          if (validSets > 0) {
            if (!history[exerciseName]) history[exerciseName] = [];
            history[exerciseName].push({
              date: log.date,
              maxWeight,
              totalVolume,
              avgReps: Math.round(totalReps / validSets)
            });
          }
        });
      }
    });

    Object.keys(history).forEach(k => {
      history[k].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });

    return history;
  }, [gymLogs]);

  // 2. Calculate Weekly / Monthly Summaries
  const summaries = useMemo(() => {
    const sortedLogs = Object.values(gymLogs)
      .filter(l => l.isCompleted)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const groups: Record<string, { workouts: number; volume: number; dateRange: string }> = {};

    sortedLogs.forEach(log => {
      const d = new Date(log.date);
      let groupKey = '';
      let dateRange = '';

      if (summaryType === 'weekly') {
        if (programSettings?.startDate) {
          // Relative to program start
          const start = new Date(programSettings.startDate);
          start.setHours(0,0,0,0);
          const diffDays = Math.floor((d.getTime() - start.getTime()) / (1000 * 3600 * 24));
          const weekNum = Math.floor(Math.max(0, diffDays) / 7) + 1;
          groupKey = `Semana ${weekNum}`;
          dateRange = 'Semana del Programa';
        } else {
          // Absolute week (Monday start)
          const day = d.getDay() || 7;
          const monday = new Date(d);
          monday.setDate(d.getDate() - day + 1);
          groupKey = `Semana del ${monday.getDate()}/${monday.getMonth()+1}`;
          dateRange = 'Semana Natural';
        }
      } else {
        // Monthly
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        groupKey = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
        dateRange = 'Resumen Mensual';
      }

      if (!groups[groupKey]) {
        groups[groupKey] = { workouts: 0, volume: 0, dateRange };
      }

      groups[groupKey].workouts += 1;
      
      if (log.performances) {
        Object.values(log.performances).forEach(sets => {
          sets.forEach(s => {
            const w = s.weightKg || 0;
            const r = parseInt(String(s.reps)) || 0;
            groups[groupKey].volume += (w * r);
          });
        });
      }
    });

    return Object.entries(groups).map(([name, data]) => ({ name, ...data }));
  }, [gymLogs, summaryType, programSettings]);

  // View state for specific exercise
  const allExercises = Object.keys(exerciseHistory).sort();
  const activeExercise = selectedExercise || (allExercises.length > 0 ? allExercises[0] : '');
  const data = activeExercise ? exerciseHistory[activeExercise] : [];

  // Check if activeExercise matches a key lift
  const matchingKeyLift = programSettings?.keyLifts?.find(
    k => k.name.toLowerCase() === activeExercise.toLowerCase()
  );

  const currentMax = data.length > 0 ? Math.max(...data.map(d => d.maxWeight)) : 0;
  
  // Progress calculation: prefer keyLift initial weight, fallback to first recorded session
  const initialMax = matchingKeyLift && matchingKeyLift.initialWeight > 0 
    ? matchingKeyLift.initialWeight 
    : (data.length > 0 ? data[0].maxWeight : 0);
    
  const progressPercent = initialMax > 0 ? Math.round(((currentMax - initialMax) / initialMax) * 100) : 0;

  const handleUpdateWeight = (liftId: string, newWeight: number) => {
    if (!programSettings || !onUpdateSettings) return;
    const updatedLifts = programSettings.keyLifts?.map(l => 
      l.id === liftId ? { ...l, currentWeight: newWeight } : l
    );
    onUpdateSettings({ ...programSettings, keyLifts: updatedLifts });
  };

  return (
    <div className="p-6 flex flex-col gap-6 pb-24">
      
      {/* Sub-Tabs */}
      <div className="flex bg-black p-1 rounded-none border-b border border-white/10">
        <button
          onClick={() => setActiveTab('overload')}
          className={`flex-1 py-2 text-xs font-bold rounded-sm transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'overload'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          <Target size={14} />
          Sobrecarga
        </button>
        <button
          onClick={() => setActiveTab('exercises')}
          className={`flex-1 py-2 text-xs font-bold rounded-sm transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'exercises'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          <TrendingUp size={14} />
          Ejercicios (PR)
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-2 text-xs font-bold rounded-sm transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'summary'
              ? 'bg-white text-black shadow-md'
              : 'text-zinc-500 hover:text-white'
          }`}
        >
          <CalendarDays size={14} />
          Historial
        </button>
      </div>

      {activeTab === 'overload' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-white">Registro de Sobrecarga</h3>
            <button onClick={onOpenSettings} className="text-xs font-bold text-orange-400 hover:text-orange-300">
              Editar Lista
            </button>
          </div>
          
          {!programSettings?.keyLifts || programSettings.keyLifts.length === 0 ? (
            <div className="bg-black/60 border border-white/10 rounded-none border-b p-6 text-center">
              <Target size={32} className="text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-white mb-2">Sin ejercicios base</p>
              <p className="text-xs text-zinc-500 mb-4">Añade los ejercicios que deseas someter a sobrecarga progresiva.</p>
              <button 
                onClick={onOpenSettings}
                className="bg-white text-black px-4 py-2 rounded-sm text-xs font-bold hover:bg-orange-400"
              >
                Configurar Ejercicios
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {programSettings.keyLifts.map(lift => {
                const current = lift.currentWeight || lift.initialWeight || 0;
                const target = lift.targetWeight || 0;
                let percent = 0;
                if (target > lift.initialWeight) {
                   percent = Math.min(100, Math.max(0, ((current - lift.initialWeight) / (target - lift.initialWeight)) * 100));
                }

                return (
                  <div key={lift.id} className="bg-black border border-white/10 rounded-none border-b p-5 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white text-sm capitalize">{lift.name}</h4>
                      <div className="flex items-center gap-1.5 bg-black px-3 py-1.5 rounded-lg border border-white/10">
                        <Activity size={14} className="text-orange-500" />
                        <span className="text-xs text-orange-400 font-mono font-bold">{current} kg</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1 w-1/4">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Inicio</span>
                        <span className="text-sm text-slate-300 font-mono font-bold">{lift.initialWeight} kg</span>
                      </div>
                      
                      <div className="flex flex-col gap-1 flex-1 items-center">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Actual</span>
                        <div className="flex items-center gap-2 bg-black px-2 py-1.5 rounded-sm border border-white/10 w-full justify-between">
                          <button 
                            onClick={() => handleUpdateWeight(lift.id, current - 2.5)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-800 text-zinc-500 hover:text-white hover:bg-slate-700 transition-colors font-mono font-bold text-xs"
                          >
                            -2.5
                          </button>
                          <input 
                            type="number" 
                            value={current}
                            onChange={(e) => handleUpdateWeight(lift.id, parseFloat(e.target.value) || 0)}
                            className="w-14 bg-transparent text-center text-white font-mono font-bold text-lg focus:outline-none"
                          />
                          <button 
                            onClick={() => handleUpdateWeight(lift.id, current + 2.5)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 hover:text-orange-300 hover:bg-orange-500/20 transition-colors font-mono font-bold text-xs"
                          >
                            +2.5
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 w-1/4 items-end">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Meta</span>
                        <span className="text-sm text-slate-300 font-mono font-bold">{target > 0 ? target : '--'} kg</span>
                      </div>
                    </div>

                    {target > lift.initialWeight && (
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] font-bold text-zinc-500">Progreso de Sobrecarga</span>
                          <span className="text-[10px] font-bold text-orange-400">{Math.round(percent)}%</span>
                        </div>
                        <div className="w-full bg-black rounded-full h-2 border border-white/10">
                          <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'exercises' && (
        <>
          {allExercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full gap-4 mt-8">
              <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center text-zinc-500">
                <Dumbbell size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">No hay datos aún</h3>
                <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                  Completa tus entrenamientos para ver tu evolución de PRs aquí.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  Selecciona un Ejercicio
                </label>
                <div className="relative">
                  <select
                    value={activeExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="w-full appearance-none bg-black border border-white/10 text-sm font-semibold text-white px-4 py-3 rounded-sm focus:outline-none focus:border-orange-500 capitalize"
                  >
                    {allExercises.map(ex => (
                      <option key={ex} value={ex} className="capitalize">{ex}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <Dumbbell size={16} />
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/60 border border-white/10 rounded-none border-b p-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      PR Actual
                    </span>
                    <Activity size={14} className="text-orange-400" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-white font-mono">{currentMax}</span>
                    <span className="text-sm font-bold text-zinc-500 mb-1">kg</span>
                  </div>
                  
                  {progressPercent !== 0 && (
                    <span className={`text-[10px] font-bold ${progressPercent > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {progressPercent > 0 ? '+' : ''}{progressPercent}% vs inicio ({initialMax}kg)
                    </span>
                  )}
                  {progressPercent === 0 && initialMax > 0 && (
                     <span className="text-[10px] font-bold text-zinc-500">Inicio: {initialMax}kg</span>
                  )}
                </div>

                <div className="bg-black/60 border border-white/10 rounded-none border-b p-4 flex flex-col gap-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      Sesiones
                    </span>
                    <BarChart3 size={14} className="text-amber-400" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-black text-white font-mono">{data.length}</span>
                    <span className="text-sm font-bold text-zinc-500 mb-1">registros</span>
                  </div>
                </div>
              </div>

              {/* Chart: Max Weight */}
              <div className="bg-black border border-white/10 rounded-none p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Evolución del Peso (kg)</h3>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={10}
                        tickFormatter={(val) => {
                          const d = new Date(val);
                          return `${d.getDate()}/${d.getMonth()+1}`;
                        }}
                        tickMargin={10}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10}
                        tickFormatter={(val) => `${val}`}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="maxWeight" 
                        name="Peso Máximo"
                        stroke="#f97316" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#0f172a', stroke: '#f97316', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#f97316', stroke: '#0f172a' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart: Total Volume */}
              <div className="bg-black border border-white/10 rounded-none p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Volumen Total (kg × reps)</h3>
                </div>
                
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#64748b" 
                        fontSize={10}
                        tickFormatter={(val) => ''} 
                        tickMargin={5}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        fontSize={10}
                        tickFormatter={(val) => `${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}`}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#fbbf24', fontWeight: 'bold' }}
                        labelStyle={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="totalVolume" 
                        name="Volumen"
                        stroke="#fbbf24" 
                        strokeWidth={2}
                        dot={{ r: 3, fill: '#0f172a', stroke: '#fbbf24', strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: '#fbbf24', stroke: '#0f172a' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'summary' && (
        <div className="flex flex-col gap-4">
          <div className="flex bg-black border border-white/10 rounded-sm p-1 self-start">
            <button
              onClick={() => setSummaryType('weekly')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                summaryType === 'weekly' ? 'bg-slate-800 text-white' : 'text-zinc-500 hover:text-slate-300'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setSummaryType('monthly')}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                summaryType === 'monthly' ? 'bg-slate-800 text-white' : 'text-zinc-500 hover:text-slate-300'
              }`}
            >
              Mensual
            </button>
          </div>

          {summaries.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full gap-4 mt-4">
              <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center text-zinc-500">
                <Layers size={32} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Sin actividad</h3>
                <p className="text-sm text-zinc-500 max-w-xs mx-auto">
                  Aquí verás el resumen de todo el volumen levantado semana a semana.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {summaries.map((sum, i) => (
                <div key={i} className="bg-black border border-white/10 rounded-none border-b p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">{sum.name}</h4>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{sum.dateRange}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-zinc-500">Entrenamientos</span>
                      <span className="text-xl font-black text-white font-mono">{sum.workouts}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-zinc-500">Volumen Total</span>
                      <span className="text-xl font-black text-amber-400 font-mono">
                        {sum.volume >= 1000 ? (sum.volume / 1000).toFixed(1) + 'k' : sum.volume} <span className="text-xs text-zinc-500 font-sans">kg</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
