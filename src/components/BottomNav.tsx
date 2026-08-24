import React from 'react';
import { LayoutDashboard, Dumbbell, BarChart2, Settings, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type TabType = 'home' | 'gym' | 'stats' | 'settings' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  const tabs: Array<{ id: TabType, label: string, icon: any }> = [
    { id: 'home', label: 'Inicio', icon: LayoutDashboard },
    { id: 'gym', label: 'Gym', icon: Dumbbell },
    { id: 'stats', label: 'Stats', icon: BarChart2 },
    { id: 'settings', label: 'Ajustes', icon: Settings },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="flex items-center justify-between px-2 py-2 bg-[#1C1C1E] border-none rounded-full mx-4 shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChangeTab(tab.id as TabType)}
            className={`relative flex items-center justify-center transition-colors duration-300 ${
              isActive ? 'text-black' : 'text-zinc-500 hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-bubble"
                className="absolute inset-0 bg-[white] rounded-full"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center h-12 px-4">
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap ml-2 text-xs font-bold"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          </button>
        );
      })}
    </nav>
  );
}

