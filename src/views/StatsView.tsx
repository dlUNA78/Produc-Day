import React from 'react';
import { Activity, Clock3, Dumbbell, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const weeklyLoad = [38, 58, 46, 76, 62, 88, 54];

export default function StatsView() {
  return (
    <div className="min-h-full px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-6">
      <div className="mb-10">
        <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text)]">Progreso</h1>
        <p className="mt-1.5 text-sm leading-6 text-[var(--text-muted)] max-w-sm">
          Una lectura simple de tu constancia y evolución.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-10 mb-12">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[var(--text-faint)] mb-2">
            <Dumbbell size={15} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">Sesiones</span>
          </div>
          <p className="text-[40px] font-semibold tracking-[-0.03em] text-[var(--text)] leading-none">12</p>
          <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">este mes</p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[var(--text-faint)] mb-2">
            <Clock3 size={15} />
            <span className="text-[11px] font-semibold uppercase tracking-widest">Tiempo</span>
          </div>
          <p className="text-[40px] font-semibold tracking-[-0.03em] text-[var(--text)] leading-none">8.4<span className="text-xl text-[var(--text-faint)] ml-1">h</span></p>
          <p className="mt-1.5 text-[13px] text-[var(--text-muted)]">acumulado</p>
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12"
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--text)]">Carga semanal</h3>
            <p className="text-[13px] text-[var(--text-muted)] mt-0.5">Volumen relativo de los últimos 7 días</p>
          </div>
          <span className="text-[13px] font-semibold text-[var(--success)]">+8%</span>
        </div>
        
        <div className="flex h-32 items-end gap-2.5">
          {weeklyLoad.map((value, index) => (
            <div key={index} className="flex-1 flex flex-col justify-end gap-2 h-full group">
              <div className="w-full bg-[var(--surface-raised)] rounded-t-lg transition-all" style={{ height: `${value}%` }}>
                <div className="w-full bg-[var(--accent)] opacity-80 h-full rounded-t-lg transition-all group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-between text-[11px] font-medium text-[var(--text-faint)]">
          <span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span>
        </div>
      </motion.section>

      <section className="bg-[var(--surface-raised)] rounded-3xl p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 text-[var(--accent)] mt-1"><TrendingUp size={20} strokeWidth={2.5} /></div>
          <div>
            <h2 className="font-semibold text-[var(--text)] text-[15px]">Vas construyendo ritmo</h2>
            <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--text-muted)]">
              Tu mejor ventana de consistencia es entre martes y sábado. Mantén una sesión ligera el jueves para distribuir mejor la carga.
            </p>
          </div>
        </div>
        <button type="button" className="mt-5 text-sm font-semibold text-[var(--text)] flex items-center gap-2 hover:text-[var(--accent)] transition-colors">
          Ver detalle de actividad
          <Activity size={16} />
        </button>
      </section>
    </div>
  );
}
