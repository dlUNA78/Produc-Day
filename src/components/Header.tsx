import React from 'react';
import { motion } from 'motion/react';
import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="pt-12 pb-6 px-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800 border-2 border-[#1C1C1E]">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80" 
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white">Hola, David</h1>
            <p className="text-sm font-medium text-zinc-400">Welcome Back!</p>
          </div>
        </div>
        <button className="relative h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
          <Bell size={24} strokeWidth={2} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full" />
        </button>
      </div>
    </motion.header>
  );
}
