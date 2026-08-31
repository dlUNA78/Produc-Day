import React from 'react';
import { CalendarDays, Dumbbell, ChartNoAxesColumnIncreasing, User } from 'lucide-react';

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
      className="grid grid-cols-4 items-start pt-2 pb-safe px-4 border-t border-[var(--border)] bg-[var(--canvas)]/95 backdrop-blur-xl w-full"
    >
      {tabs.map(({ id, label, icon: Icon }) => {
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChangeTab(id)}
            aria-current={isActive ? 'page' : undefined}
            className={`relative min-h-[64px] flex flex-col items-center justify-center gap-1 transition-colors group`}
          >
            <div className={`flex flex-col items-center justify-center w-16 h-[52px] rounded-2xl transition-all ${isActive ? 'bg-[var(--accent-soft)]' : ''}`}>
               <Icon className={`mb-1 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-faint)] group-hover:text-[var(--text-muted)]'}`} size={22} strokeWidth={isActive ? 2.5 : 2} />
               <span className={`text-[10px] leading-none ${isActive ? 'font-semibold text-[var(--accent)]' : 'font-medium text-[var(--text-faint)] group-hover:text-[var(--text-muted)]'}`}>{label}</span>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
