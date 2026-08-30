import React from 'react';
import { motion } from 'motion/react';
import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pt-[max(2rem,env(safe-area-inset-top))] pb-4 px-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl overflow-hidden bg-[var(--surface-raised)] border border-[var(--border)]">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xs font-medium text-[var(--text-muted)] mb-0.5">Tu día, a tu ritmo</p>
            <h1 className="text-lg leading-tight font-semibold text-[var(--text)]">Hola, David</h1>
          </div>
        </div>
        <button aria-label="Ver notificaciones" className="relative h-11 w-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
          <Bell size={20} strokeWidth={2} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[var(--accent)] rounded-full ring-2 ring-[var(--surface)]" />
        </button>
      </div>
    </motion.header>
  );
}
