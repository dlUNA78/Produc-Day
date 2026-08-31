import React from 'react';
import { Category } from '../types';
import { Check, Dumbbell, Briefcase, BookOpen, User, CheckSquare } from 'lucide-react';

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
  onOpen?: (id: string, type: 'activity' | 'task') => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  Gym: Dumbbell,
  School: BookOpen,
  Work: Briefcase,
  Study: BookOpen,
  Personal: User,
  Task: CheckSquare,
};

const categoryColors: Record<string, string> = {
  Gym: 'text-[var(--accent)] bg-[var(--accent-soft)]',
  School: 'text-[var(--warning)] bg-[var(--warning-soft)]',
  Work: 'text-[#F472B6] bg-[#F472B6]/15', // Pinkish
  Study: 'text-[var(--warning)] bg-[var(--warning-soft)]',
  Personal: 'text-[#818CF8] bg-[#818CF8]/15', // Indigo
  Task: 'text-[var(--text-muted)] bg-[var(--surface-raised)]',
};

const categoryLabels: Record<string, string> = {
  Gym: 'Gym',
  School: 'Escuela',
  Work: 'Trabajo',
  Study: 'Estudio',
  Personal: 'Personal',
  Task: 'Tarea',
};

export default function TimelineItem({ item, isLast, isActive, onToggle, onOpen }: TimelineItemProps) {
  const isDone = item.isCompleted;
  const Icon = categoryIcons[item.category] || CheckSquare;
  const colorClass = categoryColors[item.category] || categoryColors.Task;

  return (
    <div className={`relative flex items-center py-3 group transition-all duration-300 ${isDone ? 'opacity-60' : ''}`}>
      
      {/* Time column */}
      <div className="w-[52px] shrink-0 text-right pr-4">
        <span className={`text-[13px] font-semibold ${isDone ? 'text-[var(--text-faint)] line-through' : 'text-[var(--text)]'}`}>
          {item.timeDisplay.split(' - ')[0]}
        </span>
      </div>

      {/* Connection Dot */}
      <div className={`absolute left-[64px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full -ml-1 border-2 border-[var(--surface)] ${isDone ? 'bg-[var(--text-faint)]' : 'bg-[var(--accent)]'}`} />

      {/* Main Content Area */}
      <button 
        type="button" 
        onClick={() => onOpen?.(item.id, item.type)} 
        className="flex-1 flex items-center gap-3 pl-6 pr-2 text-left"
      >
        <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ${isDone ? 'bg-[var(--surface-raised)] text-[var(--text-faint)]' : colorClass}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`text-[16px] font-semibold truncate ${isDone ? 'text-[var(--text-faint)] line-through' : 'text-[var(--text)]'}`}>
            {item.title}
          </p>
          <p className="text-[13px] text-[var(--text-muted)] mt-0.5 font-medium truncate">
            {categoryLabels[item.category] || item.category} {item.type === 'activity' && item.timeDisplay.includes('-') ? `· ${item.timeDisplay}` : ''}
          </p>
        </div>
      </button>

      {/* Checkbox */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle(item.id, item.type);
        }}
        className={`shrink-0 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all ml-2 ${
          isDone
            ? 'bg-[var(--accent)] border-[var(--accent)] text-[var(--accent-ink)]'
            : 'border-[var(--text-faint)] hover:border-[var(--text-muted)] bg-[var(--surface)]'
        }`}
      >
        {isDone && <Check size={16} strokeWidth={3} />}
      </button>

    </div>
  );
}
