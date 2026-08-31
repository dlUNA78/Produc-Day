import React from 'react';
import { motion } from 'motion/react';
import { Bell, Menu } from 'lucide-react';
import { formatDateKey, parseDateKey } from './WeeklyCalendar';

export default function Header() {
  const longDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const today = longDate.format(new Date());

  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="pt-[max(1.5rem,env(safe-area-inset-top))] pb-6 px-4 flex items-center justify-between"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--surface-raised)] border border-[var(--border)] shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-[22px] font-bold text-[var(--text)] tracking-tight leading-tight">
            ¡Buenos días, Daniel! <span className="text-[20px] inline-block ml-0.5">👋</span>
          </h1>
          <p className="text-[14px] font-medium text-[var(--text-faint)] capitalize mt-0.5">
            {today}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <button aria-label="Ver notificaciones" className="relative w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] transition-colors">
          <Bell size={18} strokeWidth={2.5} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--accent)] rounded-full border border-[var(--surface)]" />
        </button>
        <button aria-label="Menú" className="w-10 h-10 rounded-full bg-[var(--surface)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] transition-colors">
          <Menu size={18} strokeWidth={2.5} />
        </button>
      </div>
    </motion.header>
  );
}
