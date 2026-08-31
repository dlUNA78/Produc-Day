import React, { useState } from 'react';
import { Bell, ChevronRight, Settings, SlidersHorizontal, Database, LogOut, User, Scale, Ruler, Target, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileViewProps {
  onResetProfile?: () => void;
}

export default function ProfileView({ onResetProfile }: ProfileViewProps) {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('produc_user_profile_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile?.name || '');
  const [editWeight, setEditWeight] = useState(profile?.weight || '');
  const [editHeight, setEditHeight] = useState(profile?.height || '');
  const [editGoal, setEditGoal] = useState(profile?.goal || 'Ganar masa muscular');
  const [copiedNotice, setCopiedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    const updated: UserProfile = {
      name: editName.trim(),
      weight: editWeight.trim(),
      height: editHeight.trim(),
      goal: editGoal,
    };
    localStorage.setItem('produc_user_profile_v1', JSON.stringify(updated));
    setProfile(updated);
    setIsEditing(false);
  };

  const handleExportData = () => {
    try {
      const backupData = {
        profile,
        activities: JSON.parse(localStorage.getItem('produc_day_activities_v1') || '[]'),
        tasks: JSON.parse(localStorage.getItem('produc_day_tasks_v1') || '[]'),
        gymSplits: JSON.parse(localStorage.getItem('gym_splits_v3') || '[]'),
        exportDate: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agenda_gym_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setCopiedNotice(true);
      setTimeout(() => setCopiedNotice(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    if (window.confirm('¿Deseas reiniciar tu perfil y volver a configurar tus datos?')) {
      localStorage.removeItem('produc_user_profile_v1');
      if (onResetProfile) {
        onResetProfile();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <div className="px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-6 min-h-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-[28px] font-bold tracking-[-0.03em] text-[var(--text)]">Tu espacio</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs font-semibold text-[var(--accent)] hover:underline"
        >
          {isEditing ? 'Cancelar' : 'Editar perfil'}
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[24px] p-5 mb-8 space-y-4">
          <h3 className="text-sm font-bold text-[var(--text)]">Editar Datos Personales</h3>
          
          <div>
            <label className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-1">Nombre</label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-[var(--canvas)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-1">Peso (kg)</label>
              <input
                type="number"
                value={editWeight}
                onChange={(e) => setEditWeight(e.target.value)}
                className="w-full bg-[var(--canvas)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-1">Altura (cm)</label>
              <input
                type="number"
                value={editHeight}
                onChange={(e) => setEditHeight(e.target.value)}
                className="w-full bg-[var(--canvas)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-1">Objetivo</label>
            <select
              value={editGoal}
              onChange={(e) => setEditGoal(e.target.value)}
              className="w-full appearance-none bg-[var(--canvas)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="Ganar masa muscular">Ganar masa muscular</option>
              <option value="Perder grasa">Perder grasa</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Mejorar rendimiento">Mejorar rendimiento</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[var(--accent)] text-[var(--accent-ink)] font-bold rounded-xl text-sm mt-2 hover:bg-[var(--accent-hover)] transition-colors"
          >
            Guardar Cambios
          </button>
        </form>
      ) : (
        <>
          <section className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-center text-[var(--accent)] shadow-md">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)] leading-tight">{profile?.name || 'Usuario'}</h2>
              <p className="text-[14px] text-[var(--text-muted)] mt-0.5">{profile?.goal || 'Construyendo constancia'}</p>
            </div>
          </section>

          {/* User Metrics Summary */}
          <div className="grid grid-cols-3 gap-2.5 mb-8">
            <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[18px] p-3.5 flex flex-col items-center text-center">
              <Scale size={16} className="text-[var(--text-muted)] mb-1.5" />
              <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase">Peso</span>
              <span className="text-sm font-bold text-[var(--text)] mt-0.5">{profile?.weight ? `${profile.weight} kg` : '—'}</span>
            </div>
            <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[18px] p-3.5 flex flex-col items-center text-center">
              <Ruler size={16} className="text-[var(--text-muted)] mb-1.5" />
              <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase">Altura</span>
              <span className="text-sm font-bold text-[var(--text)] mt-0.5">{profile?.height ? `${profile.height} cm` : '—'}</span>
            </div>
            <div className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[18px] p-3.5 flex flex-col items-center text-center">
              <Target size={16} className="text-[var(--accent)] mb-1.5" />
              <span className="text-[10px] font-bold text-[var(--text-faint)] uppercase">Meta</span>
              <span className="text-[11px] font-bold text-[var(--text)] mt-0.5 truncate max-w-full">{profile?.goal ? profile.goal.split(' ')[0] : 'Fitness'}</span>
            </div>
          </div>
        </>
      )}

      <h2 className="mb-3 text-[13px] font-medium text-[var(--text-faint)] uppercase tracking-wider ml-2">General</h2>
      <div className="bg-[var(--surface-raised)] rounded-[20px] mb-8 overflow-hidden border border-[var(--border)]">
        {[
          { label: 'Editar datos de cuenta', icon: Settings, action: () => setIsEditing(true) },
          { label: 'Personalización', icon: SlidersHorizontal, action: () => {} },
          { label: 'Notificaciones', icon: Bell, action: () => {} },
        ].map(({ label, icon: Icon, action }, index, arr) => (
          <button 
            key={label} 
            onClick={action}
            className={`w-full h-14 px-4 flex items-center gap-4 text-left hover:bg-[var(--surface-muted)] transition-colors ${index !== arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
          >
            <Icon size={20} className="text-[var(--text-muted)]" strokeWidth={1.5} />
            <span className="flex-1 text-[15px] font-medium text-[var(--text)]">{label}</span>
            <ChevronRight size={18} className="text-[var(--text-faint)]" />
          </button>
        ))}
      </div>

      <h2 className="mb-3 text-[13px] font-medium text-[var(--text-faint)] uppercase tracking-wider ml-2">Datos y Privacidad</h2>
      <div className="bg-[var(--surface-raised)] rounded-[20px] overflow-hidden mb-8 border border-[var(--border)]">
        <button 
          onClick={handleExportData}
          className="w-full h-14 px-4 flex items-center gap-4 text-left hover:bg-[var(--surface-muted)] transition-colors border-b border-[var(--border)]"
        >
          <Database size={20} className="text-[var(--text-muted)]" strokeWidth={1.5} />
          <span className="flex-1 text-[15px] font-medium text-[var(--text)]">
            {copiedNotice ? '¡Copia de seguridad descargada!' : 'Exportar mis datos'}
          </span>
          {copiedNotice ? <Check size={18} className="text-[var(--success)]" /> : <ChevronRight size={18} className="text-[var(--text-faint)]" />}
        </button>
        <button 
          onClick={handleLogout}
          className="w-full h-14 px-4 flex items-center gap-4 text-left hover:bg-[var(--danger-soft)] transition-colors text-[var(--danger)]"
        >
          <LogOut size={20} strokeWidth={1.5} />
          <span className="flex-1 text-[15px] font-medium">Reiniciar / Cambiar usuario</span>
        </button>
      </div>
    </div>
  );
}
