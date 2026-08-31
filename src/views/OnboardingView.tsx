import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile } from '../types';
import { ArrowRight, Activity, Target, User } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingView({ onComplete }: OnboardingViewProps) {
  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [goal, setGoal] = useState('Ganar masa muscular');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onComplete({
      name: name.trim(),
      weight: weight.trim(),
      height: height.trim(),
      goal,
    });
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col h-full bg-[var(--canvas)] overflow-y-auto overscroll-y-contain">
      <div className="px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-[var(--accent)] text-[var(--accent-ink)] rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-[var(--accent-soft)]">
            <Activity size={32} />
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] mb-3">
            Bienvenido
          </h1>
          <p className="text-[var(--text-muted)] mb-10 leading-relaxed text-sm">
            Para personalizar tu experiencia y seguir tu progreso, cuéntanos un poco sobre ti.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                Tu Nombre
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-3.5 pl-11 pr-4 text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Ej. 75"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-3.5 px-4 text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Ej. 175"
                  className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl py-3.5 px-4 text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--text-faint)]">
                Objetivo Principal
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                  <Target size={18} />
                </span>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full appearance-none bg-[var(--surface)] border border-[var(--border)] rounded-xl py-3.5 pl-11 pr-4 text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                >
                  <option value="Ganar masa muscular">Ganar masa muscular</option>
                  <option value="Perder grasa">Perder grasa</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Mejorar rendimiento">Mejorar rendimiento</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full mt-8 flex items-center justify-center gap-2 bg-[var(--text)] text-[var(--canvas)] py-4 rounded-xl font-bold disabled:opacity-50 transition-opacity active:scale-[0.98]"
            >
              Comenzar
              <ArrowRight size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
