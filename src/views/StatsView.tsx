import React from 'react';
import { Activity, BarChart3, Clock3, Dumbbell, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

const weeklyLoad = [38, 58, 46, 76, 62, 88, 54];

export default function StatsView() {
  return (
    <div className="min-h-full px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-28">
      <p className="text-sm text-[var(--text-muted)]">Tu evolución</p>
      <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-[var(--text)]">Progreso</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-faint)]">Una lectura simple de tu carga, constancia y tiempo de entrenamiento.</p>

      <div className="mt-7 grid grid-cols-2 gap-3">
        {[
          { label: 'Sesiones', value: '12', detail: 'este mes', icon: Dumbbell },
          { label: 'Tiempo', value: '8.4 h', detail: 'acumulado', icon: Clock3 },
        ].map(({ label, value, detail, icon: Icon }, index) => (
          <motion.section
            key={label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="ui-card p-4"
          >
            <div className="flex items-center justify-between text-[var(--text-muted)]">
              <span className="text-xs font-medium">{label}</span>
              <Icon size={17} />
            </div>
            <p className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--text)]">{value}</p>
            <p className="mt-1 text-xs text-[var(--text-faint)]">{detail}</p>
          </motion.section>
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="ui-card mt-3 p-5"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[var(--text-muted)]"><BarChart3 size={17} /><span className="text-sm font-medium">Carga semanal</span></div>
            <p className="mt-2 text-xs text-[var(--text-faint)]">Volumen relativo de los últimos 7 días</p>
          </div>
          <span className="rounded-lg border border-[var(--success-border)] bg-[var(--success-soft)] px-2 py-1 text-xs font-semibold text-[var(--success)]">+8%</span>
        </div>
        <div className="mt-6 flex h-28 items-end gap-2">
          {weeklyLoad.map((value, index) => (
            <div key={index} className="flex-1 overflow-hidden rounded-lg bg-[var(--surface-muted)]">
              <div className="w-full rounded-lg bg-[var(--accent)] opacity-80" style={{ height: `${value}%` }} />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-[var(--text-faint)]"><span>L</span><span>M</span><span>X</span><span>J</span><span>V</span><span>S</span><span>D</span></div>
      </motion.section>

      <section className="ui-card-raised mt-3 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]"><TrendingUp size={19} /></div>
          <div>
            <h2 className="font-semibold text-[var(--text)]">Vas construyendo ritmo</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">Tu mejor ventana de consistencia es entre martes y sábado. Mantén una sesión ligera el jueves para distribuir mejor la carga.</p>
          </div>
        </div>
        <button type="button" className="ui-button-secondary mt-4 w-full"><Activity size={17} />Ver detalle de actividad</button>
      </section>
    </div>
  );
}
