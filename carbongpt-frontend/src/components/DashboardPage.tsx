import React from 'react';
import { Leaf, Droplets, MessageSquare, Zap, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardPage() {
  const stats = [
    { label: 'CO₂ Saved', value: '1.2', unit: 'kg', trend: '+23%', icon: Leaf, color: 'text-carbon-green', bg: 'bg-green-500/10' },
    { label: 'Water Saved', value: '3.8', unit: 'L', trend: '+15%', icon: Droplets, color: 'text-carbon-blue', bg: 'bg-blue-500/10' },
    { label: 'Total Prompts', value: '247', unit: '', trend: '', icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Avg / Prompt', value: '4.8', unit: 'g', trend: '-12%', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Your environmental impact overview for the last 30 days.</p>
        </div>
        <div className="flex items-center gap-2 glass-panel rounded-xl px-4 py-2 text-sm font-medium">
          <Calendar size={16} className="text-slate-400" />
          Last 30 Days
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-3xl p-6 border border-white/20 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={stat.color} size={24} />
              </div>
              {stat.trend && (
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-display font-extrabold">{stat.value}</span>
              <span className="text-sm font-medium text-slate-400">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp size={20} className="text-carbon-green" />
            Impact Over Time
          </h3>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className="w-3 h-3 rounded-full bg-carbon-green" />
              CO₂ Saved (g)
            </div>
            <div className="flex items-center gap-2 text-xs font-medium">
              <div className="w-3 h-3 rounded-full bg-carbon-blue" />
              Water Saved (mL)
            </div>
          </div>
        </div>
        
        <div className="relative h-[300px] w-full">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
            <defs>
              <linearGradient id="gradGreen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid Lines */}
            {[0, 1, 2, 3].map((i) => (
              <line 
                key={i} 
                x1="0" y1={i * 100} x2="1000" y2={i * 100} 
                stroke="currentColor" 
                strokeOpacity="0.05" 
                strokeWidth="1" 
              />
            ))}

            {/* CO2 Area & Line */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M0,250 C100,220 200,180 300,190 S500,120 600,140 S850,100 1000,80"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              d="M0,250 C100,220 200,180 300,190 S500,120 600,140 S850,100 1000,80 L1000,300 L0,300 Z"
              fill="url(#gradGreen)"
            />

            {/* Water Area & Line */}
            <motion.path
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.3 }}
              d="M0,280 C150,260 250,240 400,220 S650,200 800,180 S950,160 1000,150"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <motion.path
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
              d="M0,280 C150,260 250,240 400,220 S650,200 800,180 S950,160 1000,150 L1000,300 L0,300 Z"
              fill="url(#gradBlue)"
            />
          </svg>
        </div>
      </div>

      {/* Efficiency Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-6">Efficiency Breakdown</h3>
          <div className="space-y-6">
            {[
              { label: 'Low Energy', value: 68, color: 'bg-carbon-green' },
              { label: 'Medium Energy', value: 24, color: 'bg-amber-500' },
              { label: 'High Energy', value: 8, color: 'bg-red-500' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold">{item.label}</span>
                  <span className="text-xs font-mono font-bold">{item.value}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8 flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-carbon-green/10 flex items-center justify-center mb-6 animate-float">
            <Leaf className="text-carbon-green" size={40} />
          </div>
          <h3 className="text-xl font-bold mb-2">You're in the Top 5%</h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
            Your prompt optimization habits have saved the equivalent of planting <span className="font-bold text-carbon-green">12 trees</span> this year.
          </p>
          <button className="mt-8 px-8 py-3 rounded-2xl gradient-bg text-white font-bold text-sm shadow-lg shadow-carbon-green/20 hover:scale-105 transition-all">
            Share My Impact
          </button>
        </div>
      </div>
    </div>
  );
}
