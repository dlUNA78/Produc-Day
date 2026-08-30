/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_ACTIVITIES, MOCK_TASKS } from './data';
import { Activity, Task } from './types';
import { Check, Plus } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import BottomNav, { TabType } from './components/BottomNav';
import SpecularButton from './components/SpecularButton';
import CreateEntryModal from './components/CreateEntryModal';
import { formatDateKey } from './components/WeeklyCalendar';
import HomeView from './views/HomeView';
import GymView from './views/GymView';
import StatsView from './views/StatsView';
import ProfileView from './views/ProfileView';

export default function App() {
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateKey(new Date()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const showConfirmation = (type: 'activity' | 'task') => {
    setConfirmation(type === 'task' ? 'Tarea guardada en tu día' : 'Bloque añadido a tu agenda');
    window.setTimeout(() => setConfirmation(''), 2600);
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

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleEditTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  useEffect(() => {
    document.body.className = 'antialiased selection:bg-[var(--accent)]/30';
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-dvh bg-[var(--canvas)] border-x border-[var(--border)]/60 relative overflow-hidden flex flex-col font-sans">
      
      {/* Active Tab View Rendering */}
      <div className="flex-1 pb-20 overflow-y-auto">
        {activeTab === 'home' && (
          <HomeView 
            activities={activities}
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onToggleItem={handleToggleItem}
            onOpenCreate={() => setIsModalOpen(true)}
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
      <div className="fixed bottom-6 left-0 right-0 z-[60] max-w-md mx-auto flex flex-col items-end px-4 pb-safe pointer-events-none">
        
        {activeTab === 'home' && (
          <button
            onClick={() => setIsModalOpen(true)}
            aria-label="Crear una tarea o actividad"
            className="mb-3 mr-1 w-14 h-14 bg-[var(--accent)] text-[#17120e] rounded-2xl flex items-center justify-center shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:bg-[var(--accent-strong)] active:scale-95 transition-all pointer-events-auto"
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
        onClose={() => setIsModalOpen(false)}
        onAddActivity={handleAddActivity}
        onAddTask={handleAddTask}
        onCreated={showConfirmation}
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
            <span className="w-8 h-8 shrink-0 rounded-xl bg-[var(--sage)]/15 text-[var(--sage)] flex items-center justify-center"><Check size={17} /></span>
            <span className="text-sm font-medium text-[var(--text)]">{confirmation}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
