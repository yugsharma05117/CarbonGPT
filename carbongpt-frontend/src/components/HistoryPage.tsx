import React, { useState, useEffect } from 'react';
import { Clock, Search, Filter, MoreVertical, CheckCircle2, Zap, Leaf } from 'lucide-react';
import { motion } from 'motion/react';
import { HistoryItem } from '../types';

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('carbon_history') || '[]');
    setHistory(savedHistory);
  }, []);

  const filteredHistory = history.filter(item => 
    item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleHistory = filteredHistory.slice(0, visibleCount);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
            <Clock className="text-purple-500" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tight">Prompt History</h1>
            <p className="text-slate-500 text-sm">Review and reuse your previous optimizations.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter history..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 ring-purple-500/20"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-slate-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors">
            <Filter size={18} className="text-slate-500" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {visibleHistory.length > 0 ? (
          visibleHistory.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl p-5 hover:scale-[1.01] transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate group-hover:text-purple-500 transition-colors">"{item.prompt}"</p>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <Zap size={12} className="text-amber-500" />
                      {item.tokens} tokens
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-carbon-blue">
                      <Leaf size={12} className="text-carbon-green" />
                      {item.co2.toFixed(1)}g CO₂
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                      {item.model} • {item.region}
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                      item.status === 'efficient' ? 'bg-green-100 text-green-700' : 
                      item.status === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{formatTime(item.timestamp)}</span>
                  <button className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 glass-card rounded-3xl">
            <Clock className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-slate-500 font-medium">No history found.</p>
          </div>
        )}
      </div>

      {visibleCount < filteredHistory.length && (
        <div className="flex justify-center pt-4">
          <button 
            onClick={() => setVisibleCount(prev => prev + 5)}
            className="text-sm font-bold text-purple-500 hover:underline"
          >
            Load more history
          </button>
        </div>
      )}
      
      {visibleCount >= filteredHistory.length && filteredHistory.length > 0 && (
        <div className="flex justify-center pt-4">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No more history</p>
        </div>
      )}
    </div>
  );
}
