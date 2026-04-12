
import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AnalyzePage from './components/AnalyzePage';
import DashboardPage from './components/DashboardPage';
import LeaderboardPage from './components/LeaderboardPage';
import HistoryPage from './components/HistoryPage';
import ProfilePage from './components/ProfilePage';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('analyze');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderPage = () => {
    switch (currentPage) {
      case 'analyze': return <AnalyzePage />;
      case 'dashboard': return <DashboardPage />;
      case 'leaderboard': return <LeaderboardPage />;
      case 'history': return <HistoryPage />;
      case 'profile': return <ProfilePage isDark={isDark} setIsDark={setIsDark} />;
      default: return <AnalyzePage />;
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-gray-100 font-sans">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isCollapsed={isCollapsed} 
        setIsCollapsed={setIsCollapsed} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Navbar isDark={isDark} setIsDark={setIsDark} />
        
        <main className="flex-1 overflow-y-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
