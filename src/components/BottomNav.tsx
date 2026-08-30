import React from 'react';
import { CalendarDays, Dumbbell, ChartNoAxesColumnIncreasing, User } from 'lucide-react';
import { motion } from 'motion/react';

export type TabType = 'home' | 'gym' | 'stats' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

const tabs: Array<{ id: TabType; label: string; icon: typeof CalendarDays }> = [
  { id: 'home', label: 'Hoy', icon: CalendarDays },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'stats', label: 'Progreso', icon: ChartNoAxesColumnIncreasing },
  { id: 'profile', label: 'Perfil', icon: User },
];

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegación principal"
      className="grid grid-cols-4 items-center p-1.5 mx-1 rounded-[24px] border border-[var(--border)] bg-[color:var(--surface-glass)] backdrop-blur-2xl shadow-[var(--shadow-raised)]"
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChangeTab(id)}
            aria-current={isActive ? 'page' : undefined}
            className={`relative min-h-14 rounded-[18px] flex flex-col items-center justify-center gap-1 transition-colors ${isActive ? 'text-[var(--text)]' : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]'}`}
          >
            {isActive && (
              <motion.span
                layoutId="bottom-nav-selection"
                className="absolute inset-0 rounded-[18px] border border-[var(--accent-border)] bg-[var(--accent-soft)]"
                transition={{ type: 'spring', bounce: 0.08, duration: 0.35 }}
              />
            )}
            <Icon className={`relative z-10 ${isActive ? 'text-[var(--accent)]' : ''}`} size={19} strokeWidth={isActive ? 2.4 : 2} />
            <span className={`relative z-10 text-[10px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
