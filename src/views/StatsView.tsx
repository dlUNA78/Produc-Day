import React from 'react';
import { BarChart2, Flame, Clock, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function StatsView() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden pb-24">
      <div className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-bold text-white mb-2">Estadísticas</h1>
        <p className="text-sm font-medium text-zinc-400">Rendimiento y consistencia general</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-6">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-[#1C1C1E] rounded-[24px] p-5 flex flex-col justify-between aspect-square"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <Flame size={20} />
                <span className="font-semibold text-white text-sm">Calorías</span>
              </div>
              <ChevronRight size={18} className="text-zinc-500" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">540</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Kcal</p>
              </div>
              {/* Mock Circular Progress */}
              <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-white flex items-center justify-center transform -rotate-45" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[#1C1C1E] rounded-[24px] p-5 flex flex-col justify-between aspect-square"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <Clock size={20} />
                <span className="font-semibold text-white text-sm">Duración</span>
              </div>
              <ChevronRight size={18} className="text-zinc-500" />
            </div>
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">45</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Mins</p>
              </div>
              {/* Mock Circular Progress */}
              <div className="w-10 h-10 rounded-full border-4 border-white/20 border-t-white border-r-white flex items-center justify-center transform rotate-45" />
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-[#1C1C1E] rounded-[24px] p-8 flex flex-col items-center justify-center text-center gap-4"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
            <BarChart2 size={32} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white mb-2">Más gráficas pronto</h2>
            <p className="text-xs text-zinc-500 max-w-xs mx-auto">
              Aquí se integrarán las visualizaciones avanzadas de tu progreso general.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
