import React from 'react';
import { Bell, ChevronRight, Settings, SlidersHorizontal, Database, LogOut } from 'lucide-react';

export default function ProfileView() {
  return (
    <div className="px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-6 min-h-full">
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text)]">Tu espacio</h1>
      </div>

      <section className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--border)]">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80" 
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--text)] leading-tight">David</h2>
          <p className="text-[14px] text-[var(--text-muted)] mt-0.5">Construyendo constancia</p>
        </div>
      </section>

      <h2 className="mb-3 text-[13px] font-medium text-[var(--text-faint)] uppercase tracking-wider ml-2">General</h2>
      <div className="bg-[var(--surface-raised)] rounded-[20px] mb-8 overflow-hidden">
        {[
          { label: 'Configuración de cuenta', icon: Settings },
          { label: 'Personalización', icon: SlidersHorizontal },
          { label: 'Notificaciones', icon: Bell },
        ].map(({ label, icon: Icon }, index, arr) => (
          <button key={label} className={`w-full h-14 px-4 flex items-center gap-4 text-left hover:bg-[var(--surface-muted)] transition-colors ${index !== arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}>
            <Icon size={20} className="text-[var(--text-muted)]" strokeWidth={1.5} />
            <span className="flex-1 text-[15px] font-medium text-[var(--text)]">{label}</span>
            <ChevronRight size={18} className="text-[var(--text-faint)]" />
          </button>
        ))}
      </div>

      <h2 className="mb-3 text-[13px] font-medium text-[var(--text-faint)] uppercase tracking-wider ml-2">Datos y Privacidad</h2>
      <div className="bg-[var(--surface-raised)] rounded-[20px] overflow-hidden mb-8">
        <button className="w-full h-14 px-4 flex items-center gap-4 text-left hover:bg-[var(--surface-muted)] transition-colors border-b border-[var(--border)]">
          <Database size={20} className="text-[var(--text-muted)]" strokeWidth={1.5} />
          <span className="flex-1 text-[15px] font-medium text-[var(--text)]">Exportar mis datos</span>
          <ChevronRight size={18} className="text-[var(--text-faint)]" />
        </button>
        <button className="w-full h-14 px-4 flex items-center gap-4 text-left hover:bg-[var(--danger-soft)] transition-colors text-[var(--danger)]">
          <LogOut size={20} strokeWidth={1.5} />
          <span className="flex-1 text-[15px] font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}
