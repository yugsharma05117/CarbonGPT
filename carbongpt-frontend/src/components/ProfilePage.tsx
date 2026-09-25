import React, { useState } from 'react';
import { User, Mail, Shield, Bell, Moon, Sun, Award, Leaf, Flame, Star, ChevronRight, LogOut, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProfilePageProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

export default function ProfilePage({ isDark, setIsDark }: ProfilePageProps) {
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  const achievements = [
    { title: 'First Optimization', icon: '🌱', color: 'bg-green-500/10 text-green-600', border: 'border-green-500/20' },
    { title: 'Water Save', icon: '💧', color: 'bg-blue-500/10 text-blue-600', border: 'border-blue-500/20' },
    { title: '100 Prompts', icon: '🔥', color: 'bg-amber-500/10 text-amber-600', border: 'border-amber-500/20' },
    { title: 'Weekly Winner', icon: '🏆', color: 'bg-slate-100 dark:bg-gray-700 text-slate-400', border: 'border-slate-200 dark:border-gray-700', locked: true },
  ];

  const allBadges = [
    ...achievements,
    { title: 'Carbon Master', icon: '💎', color: 'bg-purple-500/10 text-purple-600', border: 'border-purple-500/20', locked: true },
    { title: 'Night Owl', icon: '🦉', color: 'bg-indigo-500/10 text-indigo-600', border: 'border-indigo-500/20', locked: true },
    { title: 'Early Bird', icon: '☀️', color: 'bg-orange-500/10 text-orange-600', border: 'border-orange-500/20', locked: true },
    { title: 'Team Player', icon: '🤝', color: 'bg-blue-500/10 text-blue-600', border: 'border-blue-500/20', locked: true },
    { title: 'Eco Warrior', icon: '🛡️', color: 'bg-emerald-500/10 text-emerald-600', border: 'border-emerald-500/20', locked: true },
    { title: 'Efficiency Pro', icon: '⚡', color: 'bg-yellow-500/10 text-yellow-600', border: 'border-yellow-500/20', locked: true },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-display font-extrabold tracking-tight">Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-3xl p-8 flex flex-col sm:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-3xl gradient-bg flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-carbon-green/20">
              AK
            </div>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">Alex K.</h2>
                <span className="px-3 py-1 rounded-full bg-carbon-green/10 text-carbon-green text-[10px] font-bold uppercase tracking-widest inline-block">🌱 Eco User</span>
              </div>
              <p className="text-slate-500 text-sm flex items-center justify-center sm:justify-start gap-2">
                <Mail size={14} /> alex.k@email.com
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-gray-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Prompts</p>
                  <p className="text-lg font-bold">247</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-gray-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">CO₂ Saved</p>
                  <p className="text-lg font-bold text-carbon-green">1.2kg</p>
                </div>
                <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-gray-700">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Rank</p>
                  <p className="text-lg font-bold text-amber-500">#3</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Sidebar */}
        <div className="space-y-8">
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Award size={20} className="text-amber-500" />
              Achievements
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((ach) => (
                <div 
                  key={ach.title}
                  className={`p-4 rounded-2xl border ${ach.border} ${ach.color} flex flex-col items-center text-center gap-2 ${ach.locked ? 'opacity-40 grayscale' : ''}`}
                >
                  <span className="text-2xl">{ach.icon}</span>
                  <p className="text-[10px] font-bold uppercase tracking-tight leading-tight">{ach.title}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowBadgesModal(true)}
              className="w-full mt-6 py-3 rounded-2xl border border-slate-200 dark:border-gray-700 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-all"
            >
              View All Badges
            </button>
          </div>
        </div>
      </div>

      {/* Badges Modal */}
      <AnimatePresence>
        {showBadgesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBadgesModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass-panel rounded-[2rem] shadow-2xl border border-white/20 dark:border-gray-700 overflow-hidden bg-white dark:bg-[#1e293b]"
            >
              <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Award className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">All Achievements</h2>
                    <p className="text-xs text-slate-500">Track your environmental impact milestones</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowBadgesModal(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {allBadges.map((ach, idx) => (
                    <motion.div 
                      key={ach.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`p-5 rounded-3xl border ${ach.border} ${ach.color} flex flex-col items-center text-center gap-3 relative group transition-all ${ach.locked ? 'opacity-40 grayscale' : 'hover:scale-105 shadow-sm'}`}
                    >
                      <span className="text-4xl mb-1">{ach.icon}</span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-tight leading-tight mb-1">{ach.title}</p>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${ach.locked ? 'bg-slate-200 dark:bg-gray-800 text-slate-500' : 'bg-white/50 dark:bg-black/20 text-current'}`}>
                          {ach.locked ? 'Locked' : 'Unlocked'}
                        </span>
                      </div>
                      {ach.locked && (
                        <div className="absolute top-2 right-2">
                          <Lock size={12} className="text-slate-400" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-slate-50/50 dark:bg-black/10 border-t border-slate-100 dark:border-gray-700 text-center">
                <p className="text-xs text-slate-500">
                  Keep optimizing your prompts to unlock more badges and climb the leaderboard!
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
