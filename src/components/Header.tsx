import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Menu, User, Sparkles, X, Check, Dumbbell, Calendar, Flame } from 'lucide-react';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onOpenProfile?: () => void;
  onNavigateToGym?: () => void;
  pendingTasksCount?: number;
}

export default function Header({
  userName,
  userAvatar,
  onOpenProfile,
  onNavigateToGym,
  pendingTasksCount = 0,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  const longDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const today = longDate.format(new Date());

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 
    ? '¡Buenos días' 
    : currentHour < 19 
      ? '¡Buenas tardes' 
      : '¡Buenas noches';

  const displayName = userName?.trim() ? userName.split(' ')[0] : 'Daniel';
  const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80";
  const avatarSrc = userAvatar || defaultAvatar;

  return (
    <>
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="pt-[max(1.5rem,env(safe-area-inset-top))] pb-6 px-4 flex items-center justify-between"
      >
        <div 
          onClick={onOpenProfile}
          className="flex items-center gap-3.5 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--surface-raised)] border border-[var(--border)] group-hover:border-[var(--accent-border)] shrink-0 transition-colors">
            <img 
              src={avatarSrc} 
              alt="User Avatar"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-[22px] font-bold text-[var(--text)] tracking-tight leading-tight group-hover:text-[var(--accent)] transition-colors">
              {greeting}, {displayName}! <span className="text-[20px] inline-block ml-0.5">👋</span>
            </h1>
            <p className="text-[14px] font-medium text-[var(--text-faint)] capitalize mt-0.5">
              {today}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setShowNotifications(true)}
            aria-label="Ver notificaciones y recordatorios" 
            className="relative w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] transition-colors"
          >
            <Bell size={18} strokeWidth={2.2} />
            {pendingTasksCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[var(--accent)] rounded-full border-2 border-[var(--surface)] animate-pulse" />
            )}
          </button>
          <button 
            type="button"
            onClick={onOpenProfile}
            aria-label="Menú y Perfil" 
            className="w-10 h-10 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] transition-colors"
          >
            <User size={18} strokeWidth={2.2} />
          </button>
        </div>
      </motion.header>

      {/* Notifications Drawer / Modal */}
      <AnimatePresence>
        {showNotifications && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNotifications(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-[32px] sm:rounded-3xl p-6 w-full max-w-md max-h-[85dvh] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)]">
                    <Bell size={16} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[var(--text)]">Notificaciones y Avisos</h2>
                    <p className="text-[11px] text-[var(--text-faint)]">Tus recordatorios activos</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="w-8 h-8 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scroll-y-touch py-4 space-y-3">
                <div className="p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] text-[var(--accent)] flex items-center justify-center shrink-0 mt-0.5">
                    <Dumbbell size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-[var(--text)]">Rutina de Entrenamiento</h3>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      Recuerda registrar las cargas y series de tu sesión de hoy.
                    </p>
                    {onNavigateToGym && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowNotifications(false);
                          onNavigateToGym();
                        }}
                        className="mt-2 text-[11px] font-bold text-[var(--accent)] hover:underline flex items-center gap-1"
                      >
                        Ir al Gimnasio →
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--warning-soft)] text-[var(--warning)] flex items-center justify-center shrink-0 mt-0.5">
                    <Flame size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-[var(--text)]">Racha de Constancia</h3>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                      ¡Llevas un ritmo excelente esta semana! Mantén el foco en tus objetivos.
                    </p>
                  </div>
                </div>

                {pendingTasksCount > 0 ? (
                  <div className="p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--plum-soft)] text-[var(--plum)] flex items-center justify-center shrink-0 mt-0.5">
                      <Calendar size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-[var(--text)]">Agenda del Día</h3>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        Tienes {pendingTasksCount} tarea{pendingTasksCount > 1 ? 's' : ''} o actividad{pendingTasksCount > 1 ? 'es' : ''} pendiente{pendingTasksCount > 1 ? 's' : ''} para hoy.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-[var(--text)]">Todo al día</h3>
                      <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        Has completado todas tus tareas pendientes de hoy.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  className="w-full py-3 bg-[var(--surface-raised)] hover:bg-[var(--surface-soft)] text-[var(--text)] font-semibold text-xs rounded-xl transition-colors border border-[var(--border)]"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
