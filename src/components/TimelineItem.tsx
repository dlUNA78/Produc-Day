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
  Gym: 'border-white bg-white/20 text-white',
  School: 'border-white bg-white/20 text-white',
  Work: 'border-white bg-white/20 text-white',
  Study: 'border-white bg-white/20 text-white',
  Personal: 'border-white bg-white/20 text-white',
  Task: 'border-zinc-500 bg-zinc-500/20 text-zinc-400',
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
        className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 bg-black flex items-center justify-center transition-all ${
          isDone 
            ? 'bg-white border-white text-black' 
            : isActive 
              ? `${borderColor} shadow-[0_0_8px_rgba(255,255,255,0.5)]` 
              : 'border-zinc-700 hover:border-white/80'
        }`}
        title={isDone ? 'Marcar como pendiente' : 'Marcar como completado'}
      >
        {isDone && <Check size={10} strokeWidth={4} />}
      </button>

      {/* Content */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border border-white/20 bg-white/10 text-white`}>
              {item.category}
            </span>
            <p className={`text-sm font-medium transition-all ${
              isActive && !isDone 
                ? 'text-white font-semibold' 
                : isDone 
                  ? 'text-zinc-500 line-through' 
                  : 'text-zinc-300'
            }`}>
              {item.title}
            </p>
          </div>
          {item.description && (
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{item.description}</p>
          )}
        </div>
        <span className="text-[11px] text-zinc-500 font-mono flex-shrink-0 whitespace-nowrap bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
          {item.timeDisplay}
        </span>
      </div>
    </div>
  );
}
