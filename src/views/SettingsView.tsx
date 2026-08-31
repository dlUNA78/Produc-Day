import React from 'react';
import { Bell, ChevronRight, Database, Palette, ShieldCheck } from 'lucide-react';

const settings = [
  { label: 'Apariencia', detail: 'Tema y densidad visual', icon: Palette },
  { label: 'Notificaciones', detail: 'Avisos de agenda y entrenamiento', icon: Bell },
  { label: 'Datos', detail: 'Respaldo y almacenamiento local', icon: Database },
  { label: 'Privacidad', detail: 'Permisos y seguridad', icon: ShieldCheck },
];

export default function SettingsView() {
  return (
    <div className="min-h-full px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-6">
      <p className="text-sm text-[var(--text-muted)]">Preferencias</p>
      <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.03em] text-[var(--text)]">Configuración</h1>
      <div className="ui-card mt-7 overflow-hidden divide-y divide-[var(--border)]">
        {settings.map(({ label, detail, icon: Icon }) => (
          <button key={label} type="button" className="flex min-h-[72px] w-full items-center gap-3 px-4 text-left transition-colors hover:bg-[var(--surface-raised)]">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-raised)] text-[var(--text-muted)]"><Icon size={18} /></span>
            <span className="flex-1"><span className="block text-sm font-medium text-[var(--text)]">{label}</span><span className="block text-xs text-[var(--text-faint)]">{detail}</span></span>
            <ChevronRight size={17} className="text-[var(--text-faint)]" />
          </button>
        ))}
      </div>
    </div>
  );
}
