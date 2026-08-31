import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  ChevronRight, 
  Settings, 
  SlidersHorizontal, 
  Database, 
  LogOut, 
  User, 
  Scale, 
  Ruler, 
  Target, 
  Check, 
  Palette, 
  X, 
  Upload, 
  Volume2, 
  Sparkles,
  Smartphone,
  Camera,
  ShieldCheck,
  Play
} from 'lucide-react';
import { UserProfile } from '../types';
import AvatarUploaderModal from '../components/AvatarUploaderModal';
import { notificationService } from '../utils/notificationService';

interface ProfileViewProps {
  onResetProfile?: () => void;
  onUpdateProfile?: (profile: UserProfile) => void;
}

interface ThemeColor {
  id: string;
  name: string;
  accent: string;
  accentHover: string;
  accentSoft: string;
  accentBorder: string;
}

const THEME_PRESETS: ThemeColor[] = [
  {
    id: 'burgundy',
    name: 'Vino Borgoña',
    accent: '#9E2948',
    accentHover: '#B43758',
    accentSoft: 'rgba(158, 41, 72, 0.16)',
    accentBorder: 'rgba(180, 55, 88, 0.35)',
  },
  {
    id: 'emerald',
    name: 'Esmeralda',
    accent: '#10B981',
    accentHover: '#059669',
    accentSoft: 'rgba(16, 185, 129, 0.16)',
    accentBorder: 'rgba(16, 185, 129, 0.35)',
  },
  {
    id: 'ocean',
    name: 'Azul Eléctrico',
    accent: '#3B82F6',
    accentHover: '#2563EB',
    accentSoft: 'rgba(59, 130, 246, 0.16)',
    accentBorder: 'rgba(59, 130, 246, 0.35)',
  },
  {
    id: 'amber',
    name: 'Ámbar Cálido',
    accent: '#F59E0B',
    accentHover: '#D97706',
    accentSoft: 'rgba(245, 158, 11, 0.16)',
    accentBorder: 'rgba(245, 158, 11, 0.35)',
  },
  {
    id: 'violet',
    name: 'Violeta Imperial',
    accent: '#8B5CF6',
    accentHover: '#7C3AED',
    accentSoft: 'rgba(139, 92, 246, 0.16)',
    accentBorder: 'rgba(139, 92, 246, 0.35)',
  },
];

export default function ProfileView({ onResetProfile, onUpdateProfile }: ProfileViewProps) {
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
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile?.avatarUrl || '');
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  // Modals state
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Theme state
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    return localStorage.getItem('produc_accent_theme_v1') || 'burgundy';
  });

  // Notification Preferences state
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unsupported'>('prompt');
  const [testSent, setTestSent] = useState(false);
  const [notifSettings, setNotifSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('produc_notif_settings_v1');
      return saved ? JSON.parse(saved) : {
        gymReminder: true,
        reminderTime: '18:00',
        timerSound: true,
        streakReminders: true,
      };
    } catch {
      return {
        gymReminder: true,
        reminderTime: '18:00',
        timerSound: true,
        streakReminders: true,
      };
    }
  });

  useEffect(() => {
    notificationService.getPermissionStatus().then(setPermissionStatus);
  }, [isNotifModalOpen]);

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    if (granted) {
      notificationService.sendNotification(
        '🎉 ¡Notificaciones activadas!',
        'Las alertas de descanso y entrenamientos están listas en tu dispositivo.'
      );
    }
  };

  const handleSendTestNotification = () => {
    notificationService.sendNotification(
      '🏋️ Alerta de Prueba (APK & Web)',
      'Tu temporizador de descanso y avisos de rutina funcionan al 100%.'
    );
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  const applyTheme = (themeId: string) => {
    const theme = THEME_PRESETS.find(t => t.id === themeId) || THEME_PRESETS[0];
    document.documentElement.style.setProperty('--accent', theme.accent);
    document.documentElement.style.setProperty('--accent-hover', theme.accentHover);
    document.documentElement.style.setProperty('--accent-soft', theme.accentSoft);
    document.documentElement.style.setProperty('--accent-border', theme.accentBorder);
    localStorage.setItem('produc_accent_theme_v1', theme.id);
    setSelectedThemeId(theme.id);
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem('produc_accent_theme_v1') || 'burgundy';
    applyTheme(currentTheme);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    const updated: UserProfile = {
      name: editName.trim(),
      weight: editWeight.trim(),
      height: editHeight.trim(),
      goal: editGoal,
      avatarUrl: editAvatarUrl || profile?.avatarUrl,
    };
    localStorage.setItem('produc_user_profile_v1', JSON.stringify(updated));
    setProfile(updated);
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    setIsEditing(false);
  };

  const handleSaveAvatar = (newAvatarUrl: string) => {
    const updated: UserProfile = {
      name: profile?.name || 'Usuario',
      weight: profile?.weight,
      height: profile?.height,
      goal: profile?.goal,
      avatarUrl: newAvatarUrl,
    };
    localStorage.setItem('produc_user_profile_v1', JSON.stringify(updated));
    setProfile(updated);
    setEditAvatarUrl(newAvatarUrl);
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  const handleRemoveAvatar = () => {
    const updated: UserProfile = {
      name: profile?.name || 'Usuario',
      weight: profile?.weight,
      height: profile?.height,
      goal: profile?.goal,
      avatarUrl: '',
    };
    localStorage.setItem('produc_user_profile_v1', JSON.stringify(updated));
    setProfile(updated);
    setEditAvatarUrl('');
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  const handleSaveNotifSettings = (newSettings: typeof notifSettings) => {
    setNotifSettings(newSettings);
    localStorage.setItem('produc_notif_settings_v1', JSON.stringify(newSettings));
  };

  const handleExportData = () => {
    try {
      const backupData = {
        profile,
        activities: JSON.parse(localStorage.getItem('produc_day_activities_v1') || '[]'),
        tasks: JSON.parse(localStorage.getItem('produc_day_tasks_v1') || '[]'),
        gymSplits: JSON.parse(localStorage.getItem('gym_splits_v3') || '[]'),
        activeSplitId: localStorage.getItem('gym_active_split_id_v3') || '',
        gymLogs: JSON.parse(localStorage.getItem('gym_daily_logs_v3') || '{}'),
        theme: selectedThemeId,
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

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.profile) localStorage.setItem('produc_user_profile_v1', JSON.stringify(parsed.profile));
        if (parsed.activities) localStorage.setItem('produc_day_activities_v1', JSON.stringify(parsed.activities));
        if (parsed.tasks) localStorage.setItem('produc_day_tasks_v1', JSON.stringify(parsed.tasks));
        if (parsed.gymSplits) localStorage.setItem('gym_splits_v3', JSON.stringify(parsed.gymSplits));
        if (parsed.activeSplitId) localStorage.setItem('gym_active_split_id_v3', parsed.activeSplitId);
        if (parsed.gymLogs) localStorage.setItem('gym_daily_logs_v3', JSON.stringify(parsed.gymLogs));
        
        setImportSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } catch (err) {
        alert('El archivo no tiene un formato válido de respaldo.');
      }
    };
    reader.readAsText(file);
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
    <div className="px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-12 min-h-full">
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
        <form onSubmit={handleSaveProfile} className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-[24px] p-5 mb-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text)]">Editar Datos Personales</h3>
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="text-xs font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
            >
              <Camera size={14} /> Cambiar foto
            </button>
          </div>

          {/* Avatar edit row */}
          <div className="flex items-center gap-4 py-2 border-y border-[var(--border)]">
            <div 
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative w-14 h-14 rounded-full overflow-hidden border border-[var(--border)] bg-[var(--surface)] shrink-0 cursor-pointer group"
            >
              <img
                src={editAvatarUrl || profile?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"}
                alt="Avatar"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                <Camera size={16} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--text)]">Foto de perfil</p>
              <p className="text-[11px] text-[var(--text-faint)] mt-0.5">Toca la imagen o el botón para actualizarla</p>
            </div>
          </div>
          
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
                step="0.1"
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
              className="w-full bg-[var(--canvas)] border border-[var(--border)] rounded-xl py-2.5 px-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
            >
              <option value="Ganar masa muscular">Ganar masa muscular</option>
              <option value="Perder grasa">Perder grasa</option>
              <option value="Mantenimiento">Mantenimiento</option>
              <option value="Mejorar rendimiento">Mejorar rendimiento</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[var(--accent)] text-[var(--accent-ink)] font-bold rounded-xl text-sm mt-2 hover:bg-[var(--accent-hover)] transition-colors shadow-md"
          >
            Guardar Cambios
          </button>
        </form>
      ) : (
        <>
          <section className="flex items-center gap-4 mb-6">
            <div 
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative cursor-pointer group"
              role="button"
              tabIndex={0}
              title="Cambiar foto de perfil"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--border)] group-hover:border-[var(--accent-border)] bg-[var(--surface-raised)] flex items-center justify-center shadow-md transition-colors">
                <img
                  src={profile?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"}
                  alt={profile?.name || 'Usuario'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center shadow-md border border-[var(--surface)] group-hover:scale-110 transition-transform">
                <Camera size={12} strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--text)] leading-tight truncate">
                  {profile?.name || 'Usuario'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="text-[11px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  <Camera size={12} />
                  Foto
                </button>
              </div>
              <p className="text-[13px] text-[var(--text-muted)] mt-0.5">{profile?.goal || 'Construyendo constancia'}</p>
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
          { label: 'Cambiar foto de perfil', icon: Camera, action: () => setIsAvatarModalOpen(true) },
          { label: 'Editar datos de cuenta', icon: Settings, action: () => setIsEditing(true) },
          { label: 'Personalización de tema y color', icon: SlidersHorizontal, action: () => setIsThemeModalOpen(true) },
          { label: 'Notificaciones y avisos', icon: Bell, action: () => setIsNotifModalOpen(true) },
        ].map(({ label, icon: Icon, action }, index, arr) => (
          <button 
            key={label} 
            type="button"
            onClick={action}
            className={`w-full h-14 px-4 flex items-center gap-4 text-left hover:bg-[var(--surface-muted)] transition-colors ${index !== arr.length - 1 ? 'border-b border-[var(--border)]' : ''}`}
          >
            <Icon size={20} className="text-[var(--text-muted)]" strokeWidth={1.5} />
            <span className="flex-1 text-[15px] font-medium text-[var(--text)]">{label}</span>
            <ChevronRight size={18} className="text-[var(--text-faint)]" />
          </button>
        ))}
      </div>

      <h2 className="mb-3 text-[13px] font-medium text-[var(--text-faint)] uppercase tracking-wider ml-2">Datos y Copias de Seguridad</h2>
      <div className="bg-[var(--surface-raised)] rounded-[20px] overflow-hidden mb-8 border border-[var(--border)]">
        <button 
          type="button"
          onClick={handleExportData}
          className="w-full h-14 px-4 flex items-center gap-4 text-left hover:bg-[var(--surface-muted)] transition-colors border-b border-[var(--border)]"
        >
          <Database size={20} className="text-[var(--text-muted)]" strokeWidth={1.5} />
          <span className="flex-1 text-[15px] font-medium text-[var(--text)]">
            {copiedNotice ? '¡Copia de seguridad descargada!' : 'Exportar mis datos (JSON)'}
          </span>
          {copiedNotice ? <Check size={18} className="text-[var(--success)]" /> : <ChevronRight size={18} className="text-[var(--text-faint)]" />}
        </button>

        <label className="w-full h-14 px-4 flex items-center gap-4 text-left hover:bg-[var(--surface-muted)] transition-colors border-b border-[var(--border)] cursor-pointer">
          <Upload size={20} className="text-[var(--text-muted)]" strokeWidth={1.5} />
          <span className="flex-1 text-[15px] font-medium text-[var(--text)]">
            {importSuccess ? '¡Datos restaurados! Reiniciando...' : 'Importar copia de seguridad'}
          </span>
          <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          {importSuccess ? <Check size={18} className="text-[var(--success)]" /> : <ChevronRight size={18} className="text-[var(--text-faint)]" />}
        </label>

        <button 
          type="button"
          onClick={handleLogout}
          className="w-full h-14 px-4 flex items-center gap-4 text-left hover:bg-[var(--danger-soft)] transition-colors text-[var(--danger)]"
        >
          <LogOut size={20} strokeWidth={1.5} />
          <span className="flex-1 text-[15px] font-medium">Reiniciar / Cambiar usuario</span>
        </button>
      </div>

      {/* Theme Customization Modal */}
      <AnimatePresence>
        {isThemeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsThemeModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-[32px] sm:rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col max-h-[85dvh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                    <Palette size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)]">Color de Acento</h3>
                    <p className="text-[11px] text-[var(--text-faint)]">Personaliza el tono visual de la aplicación</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsThemeModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="py-5 space-y-3">
                {THEME_PRESETS.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => applyTheme(theme.id)}
                      className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                        isSelected 
                          ? 'bg-[var(--surface-raised)] border-[var(--accent-border)] ring-1 ring-[var(--accent-border)]' 
                          : 'bg-[var(--canvas)] border-[var(--border)] hover:border-[var(--border-strong)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-7 h-7 rounded-full shadow-md flex items-center justify-center text-white"
                          style={{ backgroundColor: theme.accent }}
                        >
                          {isSelected && <Check size={14} strokeWidth={3} />}
                        </div>
                        <span className="text-sm font-semibold text-[var(--text)]">{theme.name}</span>
                      </div>
                      <div
                        className="px-2.5 py-1 rounded-lg text-xs font-bold"
                        style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
                      >
                        Muestra
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsThemeModalOpen(false)}
                  className="w-full py-3 bg-[var(--accent)] text-[var(--accent-ink)] font-bold text-sm rounded-xl transition-colors"
                >
                  Guardar y Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notifications Preferences Modal */}
      <AnimatePresence>
        {isNotifModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotifModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-[32px] sm:rounded-3xl p-6 w-full max-w-md shadow-2xl flex flex-col max-h-[85dvh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)]">
                    <Bell size={16} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[var(--text)]">Preferencias de Alertas</h3>
                    <p className="text-[11px] text-[var(--text-faint)]">Configura tus avisos diarios</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNotifModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)]"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="py-4 space-y-4 flex-1 overflow-y-auto">
                {/* Native Permission Activation Card */}
                <div className="p-4 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={18} className={permissionStatus === 'granted' ? 'text-[var(--accent)]' : 'text-amber-400'} />
                      <span className="text-xs font-bold text-[var(--text)]">
                        Estado del Sistema
                      </span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      permissionStatus === 'granted'
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent-border)]'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {permissionStatus === 'granted' ? 'Permitido' : 'Pendiente'}
                    </span>
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed mb-3">
                    Compatible con tu APK de Capacitor y navegadores. Permite recibir avisos cuando termine tu descanso o a la hora de entrenar.
                  </p>

                  <div className="flex items-center gap-2">
                    {permissionStatus !== 'granted' ? (
                      <button
                        type="button"
                        onClick={handleRequestPermission}
                        className="flex-1 py-2 px-3 bg-[var(--accent)] text-[var(--accent-ink)] font-bold text-xs rounded-xl shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Activar Permisos en APK
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendTestNotification}
                        disabled={testSent}
                        className="flex-1 py-2 px-3 bg-[var(--surface)] border border-[var(--accent-border)] text-[var(--accent)] font-semibold text-xs rounded-xl hover:bg-[var(--accent-soft)] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Play size={12} />
                        <span>{testSent ? '¡Notificación enviada!' : 'Probar Notificación'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        notificationService.playAlertSound();
                        notificationService.triggerHaptic();
                      }}
                      className="py-2 px-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
                      title="Probar sonido y vibración"
                    >
                      <Volume2 size={13} />
                      <span>Sonido</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl">
                  <div>
                    <span className="text-sm font-semibold text-[var(--text)] block">Recordatorio de Entrenamiento</span>
                    <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">Aviso para no saltarte la rutina</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSettings.gymReminder}
                    onChange={(e) => {
                      const updated = { ...notifSettings, gymReminder: e.target.checked };
                      handleSaveNotifSettings(updated);
                      if (e.target.checked && updated.reminderTime) {
                        const [h, m] = updated.reminderTime.split(':').map(Number);
                        notificationService.scheduleDailyReminder(h, m);
                      }
                    }}
                    className="w-5 h-5 rounded accent-[var(--accent)] cursor-pointer"
                  />
                </div>

                {notifSettings.gymReminder && (
                  <div className="p-3.5 bg-[var(--canvas)] border border-[var(--border)] rounded-2xl flex items-center justify-between">
                    <span className="text-xs font-medium text-[var(--text-muted)]">Hora preferida:</span>
                    <input
                      type="time"
                      value={notifSettings.reminderTime}
                      onChange={(e) => {
                        const updated = { ...notifSettings, reminderTime: e.target.value };
                        handleSaveNotifSettings(updated);
                        const [h, m] = e.target.value.split(':').map(Number);
                        notificationService.scheduleDailyReminder(h, m);
                      }}
                      className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2.5 py-1 text-xs text-[var(--text)]"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl">
                  <div>
                    <span className="text-sm font-semibold text-[var(--text)] block">Sonido y Vibración en Descansos</span>
                    <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">Al terminar los segundos de descanso en el gym</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSettings.timerSound}
                    onChange={(e) => handleSaveNotifSettings({ ...notifSettings, timerSound: e.target.checked })}
                    className="w-5 h-5 rounded accent-[var(--accent)] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl">
                  <div>
                    <span className="text-sm font-semibold text-[var(--text)] block">Alertas de Racha</span>
                    <span className="text-[11px] text-[var(--text-muted)] block mt-0.5">Motivación y constancia semanal</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSettings.streakReminders}
                    onChange={(e) => handleSaveNotifSettings({ ...notifSettings, streakReminders: e.target.checked })}
                    className="w-5 h-5 rounded accent-[var(--accent)] cursor-pointer"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsNotifModalOpen(false)}
                  className="w-full py-3 bg-[var(--accent)] text-[var(--accent-ink)] font-bold text-sm rounded-xl transition-colors"
                >
                  Listo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Avatar Uploader Modal */}
      <AnimatePresence>
        {isAvatarModalOpen && (
          <AvatarUploaderModal
            isOpen={isAvatarModalOpen}
            onClose={() => setIsAvatarModalOpen(false)}
            currentAvatarUrl={editAvatarUrl || profile?.avatarUrl}
            onSaveAvatar={handleSaveAvatar}
            onRemoveAvatar={handleRemoveAvatar}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
