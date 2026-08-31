import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { AVATAR_PRESETS, compressImageFile } from '../utils/imageUtils';

interface AvatarUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string;
  onSaveAvatar: (newAvatarUrl: string) => void;
  onRemoveAvatar?: () => void;
}

export default function AvatarUploaderModal({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSaveAvatar,
  onRemoveAvatar,
}: AvatarUploaderModalProps) {
  const [selectedUrl, setSelectedUrl] = useState<string>(currentAvatarUrl || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync with current prop when opened
  React.useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentAvatarUrl || '');
      setErrorMsg(null);
    }
  }, [isOpen, currentAvatarUrl]);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMsg('La imagen no debe superar los 15MB.');
      return;
    }

    try {
      setIsProcessing(true);
      setErrorMsg(null);
      const compressedDataUrl = await compressImageFile(file, 320, 0.88);
      setSelectedUrl(compressedDataUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar la imagen.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
    // reset input value so re-selecting same file triggers change
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleConfirm = () => {
    onSaveAvatar(selectedUrl);
    onClose();
  };

  const handleRemove = () => {
    setSelectedUrl('');
    if (onRemoveAvatar) {
      onRemoveAvatar();
    }
    onClose();
  };

  const defaultPlaceholder = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className="relative bg-[var(--surface)] border-t sm:border border-[var(--border)] rounded-t-[32px] sm:rounded-3xl p-6 w-full max-w-md max-h-[90dvh] flex flex-col shadow-[0_-20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-soft)] border border-[var(--accent-border)] flex items-center justify-center text-[var(--accent)]">
              <Camera size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text)]">Foto de Perfil</h2>
              <p className="text-[11px] text-[var(--text-faint)]">Sube tu foto o elige un avatar</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scroll-y-touch py-4 space-y-6">
          {/* Live Preview Avatar */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[var(--accent)] bg-[var(--surface-raised)] shadow-xl flex items-center justify-center">
                {selectedUrl ? (
                  <img
                    src={selectedUrl}
                    alt="Vista previa de perfil"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <img
                    src={defaultPlaceholder}
                    alt="Avatar por defecto"
                    className="w-full h-full object-cover opacity-80"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[var(--accent)] text-[var(--accent-ink)] flex items-center justify-center shadow-lg border-2 border-[var(--surface)] hover:scale-105 active:scale-95 transition-transform"
                title="Cambiar imagen"
              >
                <Camera size={15} />
              </button>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2 font-medium">
              {isProcessing ? 'Procesando imagen...' : 'Vista previa de tu avatar'}
            </p>
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-red-400 text-xs">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Upload Drop Zone */}
          <div>
            <label className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider block mb-2">
              Subir desde tu dispositivo
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp, image/gif"
              onChange={handleFileChange}
              className="hidden"
              id="avatar-file-input"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full py-5 px-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[var(--accent)] bg-[var(--accent-soft)]/20'
                  : 'border-[var(--border)] bg-[var(--surface-raised)] hover:border-[var(--accent-border)] hover:bg-[var(--surface-muted)]'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[var(--accent)] mb-2">
                <Upload size={18} />
              </div>
              <p className="text-xs font-semibold text-[var(--text)]">
                Toca para seleccionar o arrastra una foto aquí
              </p>
              <p className="text-[11px] text-[var(--text-faint)] mt-1">
                PNG, JPG, WebP (se optimizará automáticamente)
              </p>
            </div>
          </div>

          {/* Preset Avatars Gallery */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider">
                O elige un avatar sugerido
              </label>
              <span className="text-[10px] text-[var(--accent)] font-semibold flex items-center gap-1">
                <Sparkles size={11} /> 6 estilos
              </span>
            </div>

            <div className="grid grid-cols-6 gap-2">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = selectedUrl === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedUrl(preset.url);
                      setErrorMsg(null);
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                      isSelected 
                        ? 'border-[var(--accent)] scale-105 shadow-md shadow-[var(--accent-soft)]' 
                        : 'border-[var(--border)] hover:border-[var(--text-faint)] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[var(--accent)]/30 backdrop-blur-[1px] flex items-center justify-center text-[var(--accent-ink)]">
                        <Check size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-[var(--border)] flex items-center gap-2">
          {selectedUrl && (
            <button
              type="button"
              onClick={handleRemove}
              className="px-3.5 py-3 rounded-xl border border-[var(--border)] hover:bg-red-500/10 hover:border-red-500/30 text-[var(--text-muted)] hover:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              title="Quitar foto actual"
            >
              <Trash2 size={15} />
              <span>Quitar</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-[var(--surface-raised)] hover:bg-[var(--surface-muted)] text-[var(--text)] font-semibold text-xs rounded-xl border border-[var(--border)] transition-colors"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={handleConfirm}
            className="flex-1 py-3 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--accent-ink)] font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            Guardar Foto
          </button>
        </div>
      </motion.div>
    </div>
  );
}
