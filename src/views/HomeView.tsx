import React from 'react';
import Header from '../components/Header';
import WeeklyCalendar from '../components/WeeklyCalendar';
import Timeline from '../components/Timeline';
import { Activity, Task } from '../types';
import { formatDateKey } from '../components/WeeklyCalendar';
import { ChevronRight, CheckSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  activities: Activity[];
  tasks: Task[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onToggleItem: (id: string, type: 'activity' | 'task') => void;
  onOpenCreate: () => void;
}

export default function HomeView({ 
  activities, 
  tasks, 
  selectedDate, 
  onSelectDate, 
  onToggleItem,
  onOpenCreate
}: HomeViewProps) {
  // Filter based on selected date
  const filteredActivities = activities.filter(a => a.date === selectedDate);
  const filteredTasks = tasks.filter(t => t.date === selectedDate);
  
  const todayKey = formatDateKey(new Date());
  const isViewingToday = selectedDate === todayKey;

  const hasItemsForDate = (dateKey: string) => {
    return activities.some(a => a.date === dateKey) || tasks.some(t => t.date === dateKey);
  };

  const completedTasks = filteredTasks.filter(t => t.completed).length;
  const totalTasks = filteredTasks.length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-24">
      <Header />
      
      <WeeklyCalendar 
        selectedDate={selectedDate} 
        onSelectDate={onSelectDate} 
        hasItemsForDate={hasItemsForDate}
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col px-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
        
        {/* Full width Tasks Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-[#1C1C1E] rounded-[24px] p-5 mb-4"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-[white]">
              <CheckSquare size={20} />
              <span className="font-semibold text-white">Tareas</span>
            </div>
            <ChevronRight size={18} className="text-zinc-500" />
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">
                {completedTasks}<span className="text-xl text-zinc-500">/{totalTasks || 0}</span>
              </h3>
              <p className="text-xs text-zinc-500">Completadas hoy</p>
            </div>
            
            {/* Mock Bar Chart */}
            <div className="flex items-end gap-1.5 h-12">
              {[40, 60, 30, 80, 50, 100, 70].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div 
                    className={`w-3.5 rounded-sm ${i === 5 ? 'bg-[white]' : 'bg-[white]/50'}`} 
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[8px] text-zinc-500">
                    {['L','M','M','J','V','S','D'][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <h2 className="text-lg font-bold text-white mb-4">Planes del día</h2>
        <div className="bg-[#1C1C1E] rounded-[24px] p-5 mb-8">
          <Timeline 
            activities={filteredActivities}
            tasks={filteredTasks} 
            onToggleItem={onToggleItem}
            onOpenCreate={onOpenCreate}
          />
        </div>
      </div>
    </div>
  );
}

