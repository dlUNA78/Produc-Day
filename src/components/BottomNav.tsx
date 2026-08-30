import React from 'react';
import { CalendarDays, Dumbbell, ChartNoAxesColumnIncreasing, User } from 'lucide-react';
import { motion } from 'motion/react';

export type TabType = 'home' | 'gym' | 'stats' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs: Array<{ id: TabType, label: string, icon: any }> = [
    { id: 'home', label: 'Hoy', icon: CalendarDays },
    { id: 'gym', label: 'Entrenar', icon: Dumbbell },
    { id: 'stats', label: 'Progreso', icon: ChartNoAxesColumnIncreasing },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav aria-label="Navegación principal" className="grid grid-cols-4 items-center p-1.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-[22px] mx-1 shadow-[0_16px_40px_rgba(0,0,0,0.4)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id as TabType)}
            aria-current={isActive ? 'page' : undefined}
            className={`relative min-h-14 rounded-[17px] flex flex-col gap-1 items-center justify-center transition-colors duration-200 ${
              isActive ? 'text-[var(--text)]' : 'text-[var(--text-faint)] hover:text-[var(--text-muted)]'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-bubble"
                className="absolute inset-0 bg-[var(--surface-muted)] border border-[var(--border)] rounded-[17px]"
                transition={{ type: 'spring', bounce: 0.08, duration: 0.35 }}
              />
            )}
            <span className="relative z-10 flex flex-col items-center gap-1">
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[11px] leading-none ${isActive ? 'font-semibold' : 'font-medium'}`}>{tab.label}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
