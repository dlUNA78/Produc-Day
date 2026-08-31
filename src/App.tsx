/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MOCK_ACTIVITIES, MOCK_TASKS } from './data';
import { Activity, Task } from './types';
import { Check, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import BottomNav, { TabType } from './components/BottomNav';
import CreateEntryModal from './components/CreateEntryModal';
import { formatDateKey } from './components/WeeklyCalendar';
import HomeView from './views/HomeView';
import GymView from './views/GymView';
import StatsView from './views/StatsView';
import ProfileView from './views/ProfileView';

type EditableEntry = { type: 'activity'; item: Activity } | { type: 'task'; item: Task };
type DeletedEntry = EditableEntry;

const loadEntries = <T,>(key: string, fallback: T[]): T[] => {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [activities, setActivities] = useState<Activity[]>(() => loadEntries('produc_day_activities_v1', MOCK_ACTIVITIES));
  const [tasks, setTasks] = useState<Task[]>(() => loadEntries('produc_day_tasks_v1', MOCK_TASKS));
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateKey(new Date()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const [editingEntry, setEditingEntry] = useState<EditableEntry | null>(null);
  const [deletedEntry, setDeletedEntry] = useState<DeletedEntry | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showConfirmation = (type: 'activity' | 'task') => {
    setConfirmation(type === 'task' ? 'Tarea guardada en tu día' : 'Bloque añadido a tu agenda');
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => { setConfirmation(''); setDeletedEntry(null); }, 3500);
  };

  const showMessage = (message: string) => {
    setConfirmation(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => { setConfirmation(''); setDeletedEntry(null); }, 3500);
  };

  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const handleToggleActivity = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, isCompleted: !a.isCompleted } : a));
  };

  const handleToggleItem = (id: string, type: 'activity' | 'task') => {
    if (type === 'activity') {
      handleToggleActivity(id);
    } else {
      handleToggleTask(id);
    }
  };

  const handleAddActivity = (activityData: Omit<Activity, 'id' | 'isCompleted'>) => {
    const newActivity: Activity = {
      ...activityData,
      id: Date.now().toString(),
      isCompleted: false,
    };
    setActivities(prev => [...prev, newActivity].sort((a, b) => a.startTime.localeCompare(b.startTime)));
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      isCompleted: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleEditTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showMessage('Cambios guardados');
  };

  const handleEditActivity = (id: string, updates: Partial<Activity>) => {
    setActivities(prev => prev.map(activity => activity.id === id ? { ...activity, ...updates } : activity));
    showMessage('Cambios guardados');
  };

  const handleOpenItem = (id: string, type: 'activity' | 'task') => {
    const item = type === 'activity' ? activities.find(entry => entry.id === id) : tasks.find(entry => entry.id === id);
    if (!item) return;
    setEditingEntry(type === 'activity' ? { type, item: item as Activity } : { type, item: item as Task });
    setIsModalOpen(true);
  };

  const handleDeleteEntry = (id: string, type: 'activity' | 'task') => {
    const item = type === 'activity' ? activities.find(entry => entry.id === id) : tasks.find(entry => entry.id === id);
    if (!item) return;
    setDeletedEntry(type === 'activity' ? { type, item: item as Activity } : { type, item: item as Task });
    if (type === 'activity') setActivities(prev => prev.filter(entry => entry.id !== id));
    else setTasks(prev => prev.filter(entry => entry.id !== id));
    setEditingEntry(null);
    showMessage('Entrada eliminada');
  };

  const handleUndoDelete = () => {
    if (!deletedEntry) return;
    if (deletedEntry.type === 'activity') setActivities(prev => [...prev, deletedEntry.item].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    else setTasks(prev => [...prev, deletedEntry.item]);
    setDeletedEntry(null);
    showMessage('Entrada restaurada');
  };

  useEffect(() => {
    document.body.className = 'antialiased selection:bg-[var(--accent)]/30';
  }, []);

  useEffect(() => localStorage.setItem('produc_day_activities_v1', JSON.stringify(activities)), [activities]);
  useEffect(() => localStorage.setItem('produc_day_tasks_v1', JSON.stringify(tasks)), [tasks]);
  useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); }, []);

  return (
    <div className="max-w-[430px] mx-auto min-h-dvh bg-[var(--canvas)] border-x border-[var(--border)]/60 relative overflow-hidden flex flex-col font-sans">
      
      {/* Active Tab View Rendering */}
      <div className="flex-1 pb-[140px] overflow-y-auto overscroll-y-contain">
        {activeTab === 'home' && (
          <HomeView 
            activities={activities}
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onToggleItem={handleToggleItem}
            onOpenCreate={() => { setEditingEntry(null); setIsModalOpen(true); }}
            onOpenItem={handleOpenItem}
          />
        )}
        
        {activeTab === 'gym' && (
          <GymView onAddActivity={handleAddActivity} />
        )}
        
        {activeTab === 'stats' && (
          <StatsView />
        )}

        {activeTab === 'profile' && (
          <ProfileView />
        )}
      </div>

      {/* Floating Add Button & Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-[60] max-w-[430px] mx-auto flex flex-col pointer-events-none">
        
        {activeTab === 'home' && (
          <button
            onClick={() => { setEditingEntry(null); setIsModalOpen(true); }}
            aria-label="Crear una tarea o actividad"
            className="mb-4 mr-2 w-[52px] h-[52px] bg-[var(--accent)] text-[var(--accent-ink)] rounded-full flex items-center justify-center shadow-lg shadow-[var(--accent-soft)] hover:bg-[var(--accent-strong)] active:scale-95 transition-transform pointer-events-auto"
          >
            <Plus size={25} strokeWidth={2.4} />
          </button>
        )}

        <div className="w-full pointer-events-auto">
          <BottomNav 
            activeTab={activeTab} 
            onChangeTab={setActiveTab} 
          />
        </div>
      </div>
      
      <CreateEntryModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingEntry(null); }}
        onAddActivity={handleAddActivity}
        onAddTask={handleAddTask}
        onCreated={showConfirmation}
        editingEntry={editingEntry}
        onUpdateActivity={handleEditActivity}
        onUpdateTask={handleEditTask}
        onDelete={handleDeleteEntry}
        defaultDate={selectedDate}
      />

      <AnimatePresence>
        {confirmation && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            role="status"
            className="fixed z-[120] left-1/2 -translate-x-1/2 bottom-28 w-[calc(100%-2rem)] max-w-sm rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] shadow-2xl px-4 py-3 flex items-center gap-3"
          >
            <span className="w-8 h-8 shrink-0 rounded-xl bg-[var(--success-soft)] text-[var(--success)] flex items-center justify-center"><Check size={17} /></span>
            <span className="text-sm font-medium text-[var(--text)]">{confirmation}</span>
            {deletedEntry && <button type="button" onClick={handleUndoDelete} className="ml-auto text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]">Deshacer</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
