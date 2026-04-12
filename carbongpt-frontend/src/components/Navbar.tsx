import React, { useState } from 'react';
import { Search, Sun, Moon, ChevronDown, LogOut, Settings, User, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export default function Navbar({ isDark, setIsDark }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="h-20 flex-shrink-0 glass-panel flex items-center px-8 gap-6 border-b border-slate-200 dark:border-gray-700 z-20">
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2.5 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-700 shadow-sm hover:scale-110 active:scale-95 text-amber-500 dark:text-carbon-blue transition-all"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="h-8 w-px bg-slate-200 dark:bg-white/10 mx-2" />

        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-[#1e293b] transition-all border border-transparent hover:border-slate-200 dark:hover:border-gray-700"
          >
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm shadow-md">
              AK
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-bold leading-none">Alex K.</p>
              <p className="text-[10px] text-slate-500 mt-1">alex.k@email.com</p>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-14 w-64 glass-panel rounded-2xl shadow-2xl py-2 border border-slate-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-gray-700">
                  <p className="text-sm font-bold">Alex K.</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <Mail size={12} /> alex.k@email.com
                  </p>
                </div>
                <div className="py-1">
                  <button className="w-full px-4 py-2.5 text-sm text-left hover:bg-slate-100 dark:hover:bg-[#1e293b] flex items-center gap-3 text-red-500 transition-colors">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
