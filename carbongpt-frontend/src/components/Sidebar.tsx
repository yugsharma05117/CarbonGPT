import React from 'react';
import { Page } from '../types';
import { 
  Sparkles, 
  LayoutDashboard, 
  Trophy, 
  Clock, 
  User, 
  PanelLeftClose, 
  PanelLeftOpen,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ currentPage, setCurrentPage, isCollapsed, setIsCollapsed }: SidebarProps) {
  const menuItems = [
    { id: 'analyze', label: 'Analyze', icon: Sparkles, color: 'text-carbon-green' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-carbon-blue' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, color: 'text-amber-500' },
    { id: 'history', label: 'History', icon: Clock, color: 'text-purple-500' },
    { id: 'profile', label: 'Profile', icon: User, color: 'text-slate-400' },
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? '80px' : '260px' }}
      className="h-full glass-panel flex flex-col z-30 relative border-r border-slate-200 dark:border-gray-700"
    >
      <div className="p-6 flex items-center justify-between">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-carbon-green/20">
                <Leaf className="text-white w-6 h-6" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight">CarbonGPT</span>
            </motion.div>
          )}
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-carbon-green/20 mx-auto"
            >
              <Leaf className="text-white w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(true)}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 transition-colors"
          >
            <PanelLeftClose size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as Page)}
            className={`sidebar-item w-full ${currentPage === item.id ? 'sidebar-item-active' : ''} ${isCollapsed ? 'justify-center px-0' : ''}`}
          >
            <item.icon className={`${item.color} ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5'}`} />
            {!isCollapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card rounded-2xl p-4 border border-carbon-green/20 dark:border-gray-700"
            >
              <p className="text-xs font-semibold text-carbon-green uppercase tracking-wider mb-1">🌱 Eco Impact</p>
              <p className="text-2xl font-bold font-display">142<span className="text-sm font-normal text-slate-500 ml-1">g</span></p>
              <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-1">CO₂ saved this week</p>
              <div className="w-full bg-slate-200 dark:bg-gray-700 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-carbon-green h-full w-[65%] rounded-full" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {isCollapsed && (
          <button 
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 mx-auto flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 transition-colors"
          >
            <PanelLeftOpen size={20} />
          </button>
        )}
      </div>
    </motion.aside>
  );
}
