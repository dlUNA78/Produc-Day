import React from 'react';
import { Bell, ChevronRight, Settings, SlidersHorizontal, User } from 'lucide-react';

export default function ProfileView() {
  return (
    <div className="px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-28 min-h-full">
      <p className="text-sm text-[var(--text-muted)]">Tu espacio</p>
      <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-[var(--text)]">Perfil</h1>

      <section className="ui-card-raised mt-7 p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-[var(--surface-raised)] flex items-center justify-center text-[var(--accent)]">
          <User size={25} />
        </div>
        <div>
          <h2 className="font-semibold text-[var(--text)]">David</h2>
          <p className="text-sm text-[var(--text-muted)]">Construyendo constancia</p>
        </div>
      </section>

      <h2 className="mt-8 mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-faint)]">Preferencias</h2>
      <div className="ui-card overflow-hidden divide-y divide-[var(--border)]">
        {[
          { label: 'Configuración', detail: 'Cuenta, datos y privacidad', icon: Settings },
          { label: 'Notificaciones', detail: 'Recordatorios y avisos', icon: Bell },
          { label: 'Personalización', detail: 'Objetivos y preferencias', icon: SlidersHorizontal },
        ].map(({ label, detail, icon: Icon }) => (
          <button key={label} className="w-full min-h-[68px] px-4 flex items-center gap-3 text-left hover:bg-[var(--surface-raised)] transition-colors">
            <Icon size={19} className="text-[var(--text-muted)]" />
            <span className="flex-1"><span className="block text-sm font-medium text-[var(--text)]">{label}</span><span className="block text-xs text-[var(--text-faint)]">{detail}</span></span>
            <ChevronRight size={17} className="text-[var(--text-faint)]" />
          </button>
        ))}
      </div>
    </div>
  );
}
