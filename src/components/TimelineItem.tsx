import React from 'react';
import { Category } from '../types';
import { Check } from 'lucide-react';

export interface UnifiedAgendaItem {
  id: string;
  type: 'activity' | 'task';
  title: string;
  category: Category;
  date: string;
  timeDisplay: string;
  rawTime?: string;
  isCompleted: boolean;
  description?: string;
}

interface TimelineItemProps {
  key?: string;
  item: UnifiedAgendaItem;
  isLast?: boolean;
  isActive?: boolean;
  onToggle: (id: string, type: 'activity' | 'task') => void;
}

const categoryDotColors: Record<string, string> = {
  Gym: 'border-[var(--accent)]',
  School: 'border-[var(--amber)]',
  Work: 'border-[var(--accent)]',
  Study: 'border-[var(--amber)]',
  Personal: 'border-[var(--sage)]',
  Task: 'border-[var(--text-faint)]',
};

const categoryLabels: Record<string, string> = {
  Gym: 'Entrenamiento',
  School: 'Clases',
  Work: 'Trabajo',
  Study: 'Estudio',
  Personal: 'Personal',
  Task: 'Tarea',
};

export default function TimelineItem({ item, isLast, isActive, onToggle }: TimelineItemProps) {
  const isDone = item.isCompleted;
  const colorClass = categoryDotColors[item.category] || categoryDotColors.Personal;
  const [borderColor] = colorClass.split(' ');

  return (
    <div className={`relative pl-8 mb-5 group transition-all duration-200 ${isDone ? 'opacity-50' : ''}`}>
      {/* Node / Checkbox button on timeline */}
      <button
        type="button"
        onClick={() => onToggle(item.id, item.type)}
        className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 bg-[var(--canvas)] flex items-center justify-center transition-all ${
          isDone
            ? 'bg-[var(--sage)] border-[var(--sage)] text-[var(--canvas)]'
            : isActive
              ? `${borderColor}`
              : 'border-[var(--border)] hover:border-[var(--text-muted)]'
        }`}
        title={isDone ? 'Marcar como pendiente' : 'Marcar como completado'}
      >
        {isDone && <Check size={10} strokeWidth={4} />}
      </button>

      {/* Content */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]">
              {categoryLabels[item.category] || item.category}
            </span>
            <p className={`text-sm font-medium transition-all ${
              isActive && !isDone
                ? 'text-[var(--text)] font-semibold'
                : isDone
                  ? 'text-[var(--text-faint)] line-through'
                  : 'text-[var(--text)]'
            }`}>
              {item.title}
            </p>
          </div>
          {item.description && (
            <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">{item.description}</p>
          )}
        </div>
        <span className="text-[11px] text-[var(--text-muted)] flex-shrink-0 whitespace-nowrap bg-[var(--surface)] border border-[var(--border)] px-2 py-1 rounded-lg">
          {item.timeDisplay}
        </span>
      </div>
    </div>
  );
}
