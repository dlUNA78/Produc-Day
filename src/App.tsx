/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MOCK_ACTIVITIES, MOCK_TASKS } from './data';
import { Activity, Task } from './types';
import { Plus } from 'lucide-react';
import BottomNav, { TabType } from './components/BottomNav';
import SpecularButton from './components/SpecularButton';
import CreateEntryModal from './components/CreateEntryModal';
import { formatDateKey } from './components/WeeklyCalendar';
import HomeView from './views/HomeView';
import GymView from './views/GymView';
import StatsView from './views/StatsView';
import SettingsView from './views/SettingsView';
import ProfileView from './views/ProfileView';

export default function App() {
  const [activities, setActivities] = useState<Activity[]>(MOCK_ACTIVITIES);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedDate, setSelectedDate] = useState<string>(() => formatDateKey(new Date()));
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    document.body.className = 'bg-black text-white antialiased selection:bg-white/30';
  }, []);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-black border-x border-white/5 relative overflow-hidden flex flex-col font-sans">
      
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

        {activeTab === 'settings' && (
          <SettingsView />
        )}

        {activeTab === 'profile' && (
          <ProfileView />
        )}
      </div>

      {/* Floating Add Button & Nav */}
      <div className="fixed bottom-6 left-0 right-0 z-[60] max-w-md mx-auto flex flex-col items-end px-4 pb-safe pointer-events-none">
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="mb-4 w-14 h-14 bg-[white] text-black rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform pointer-events-auto"
        >
          <Plus size={28} strokeWidth={2.5} />
        </button>

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
        defaultDate={selectedDate}
      />
    </div>
  );
}
