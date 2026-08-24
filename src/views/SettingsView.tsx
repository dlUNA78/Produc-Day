import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsView() {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center text-center gap-4 mt-20">
      <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
        <Settings size={32} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Configuración</h2>
        <p className="text-sm text-zinc-500 max-w-xs mx-auto">
          Ajusta las preferencias de la aplicación y notificaciones.
        </p>
      </div>
    </div>
  );
}
