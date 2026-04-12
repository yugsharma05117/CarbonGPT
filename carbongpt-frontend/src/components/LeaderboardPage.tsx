import React, { useState } from 'react';
import { Trophy, Medal, Leaf, Flame, Award, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LeaderboardPage() {
  const [showRankingsModal, setShowRankingsModal] = useState(false);

  const users = [
    { rank: 1, name: 'Sarah R.', impact: '2,847g', badges: ['Eco User', 'Weekly Winner'], color: 'from-amber-400 to-orange-500', avatar: 'SR' },
    { rank: 2, name: 'Mike J.', impact: '2,214g', badges: ['Most Efficient'], color: 'from-blue-400 to-indigo-500', avatar: 'MJ' },
    { rank: 3, name: 'Alex K.', impact: '1,892g', badges: ['Eco User'], color: 'from-carbon-green to-emerald-500', avatar: 'AK', isMe: true },
    { rank: 4, name: 'Emma L.', impact: '1,567g', badges: [], color: 'from-pink-400 to-rose-500', avatar: 'EL' },
    { rank: 5, name: 'David W.', impact: '1,203g', badges: [], color: 'from-purple-400 to-violet-500', avatar: 'DW' },
  ];

  const topRankings = [
    ...users,
    { rank: 6, name: 'Sophie B.', impact: '1,150g', badges: [], color: 'from-teal-400 to-cyan-500', avatar: 'SB' },
    { rank: 7, name: 'James M.', impact: '1,080g', badges: [], color: 'from-orange-400 to-red-500', avatar: 'JM' },
    { rank: 8, name: 'Olivia P.', impact: '995g', badges: [], color: 'from-lime-400 to-green-500', avatar: 'OP' },
    { rank: 9, name: 'Lucas H.', impact: '920g', badges: [], color: 'from-indigo-400 to-blue-500', avatar: 'LH' },
    { rank: 10, name: 'Mia T.', impact: '880g', badges: [], color: 'from-rose-400 to-pink-500', avatar: 'MT' },
    { rank: 11, name: 'Ethan G.', impact: '850g', badges: [], color: 'from-amber-400 to-yellow-500', avatar: 'EG' },
    { rank: 12, name: 'Isabella C.', impact: '820g', badges: [], color: 'from-emerald-400 to-teal-500', avatar: 'IC' },
    { rank: 13, name: 'Noah F.', impact: '790g', badges: [], color: 'from-sky-400 to-blue-500', avatar: 'NF' },
    { rank: 14, name: 'Ava S.', impact: '760g', badges: [], color: 'from-violet-400 to-purple-500', avatar: 'AS' },
    { rank: 15, name: 'William R.', impact: '730g', badges: [], color: 'from-fuchsia-400 to-pink-500', avatar: 'WR' },
    { rank: 16, name: 'Charlotte D.', impact: '700g', badges: [], color: 'from-red-400 to-orange-500', avatar: 'CD' },
    { rank: 17, name: 'Benjamin L.', impact: '670g', badges: [], color: 'from-cyan-400 to-blue-500', avatar: 'BL' },
    { rank: 18, name: 'Amelia V.', impact: '640g', badges: [], color: 'from-green-400 to-emerald-500', avatar: 'AV' },
    { rank: 19, name: 'Henry P.', impact: '610g', badges: [], color: 'from-yellow-400 to-amber-500', avatar: 'HP' },
    { rank: 20, name: 'Chloe M.', impact: '580g', badges: [], color: 'from-indigo-400 to-purple-500', avatar: 'CM' },
  ];

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case 'Eco User': return <Leaf size={12} />;
      case 'Weekly Winner': return <Award size={12} />;
      case 'Most Efficient': return <Flame size={12} />;
      default: return <Star size={12} />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center">
          <Trophy className="text-amber-500" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-display font-extrabold tracking-tight">Leaderboard</h1>
          <p className="text-slate-500 text-sm">Top carbon savers this week. Can you reach #1?</p>
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user, i) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card rounded-3xl p-5 flex items-center gap-6 border-l-4 ${
              user.rank === 1 ? 'border-amber-400' : 
              user.rank === 2 ? 'border-slate-300' : 
              user.rank === 3 ? 'border-carbon-green' : 'border-transparent'
            } ${user.isMe ? 'bg-carbon-green/5 ring-1 ring-carbon-green/20' : ''}`}
          >
            <div className="w-10 text-center">
              {user.rank <= 3 ? (
                <Medal className={
                  user.rank === 1 ? 'text-amber-400' : 
                  user.rank === 2 ? 'text-slate-400' : 'text-carbon-green'
                } size={28} />
              ) : (
                <span className="text-xl font-display font-extrabold text-slate-300">{user.rank}</span>
              )}
            </div>

            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
              {user.avatar}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-base truncate">{user.name}</p>
                {user.isMe && <span className="text-[10px] font-bold text-carbon-green bg-carbon-green/10 px-2 py-0.5 rounded-full uppercase">You</span>}
              </div>
              <p className="text-xs text-slate-500 font-medium">{user.impact} CO₂ saved</p>
            </div>

            <div className="flex gap-2 flex-wrap justify-end max-w-[200px]">
              {user.badges.map(badge => (
                <span key={badge} className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-gray-700 text-[10px] font-bold uppercase tracking-wider">
                  {getBadgeIcon(badge)}
                  {badge}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-8 text-center bg-gradient-to-br from-carbon-green/5 to-carbon-blue/5">
        <h3 className="text-lg font-bold mb-2">Keep Optimizing!</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Every optimized prompt gets you closer to the top. Users in the top 10 receive exclusive "Eco-Warrior" profile badges.
        </p>
        <button 
          onClick={() => setShowRankingsModal(true)}
          className="px-8 py-3 rounded-2xl border-2 border-carbon-green text-carbon-green font-bold text-sm hover:bg-carbon-green hover:text-white transition-all"
        >
          View All Rankings
        </button>
      </div>

      {/* Rankings Modal */}
      <AnimatePresence>
        {showRankingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRankingsModal(false)}
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
                    <Trophy className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Top Rankings</h2>
                    <p className="text-xs text-slate-500">The most efficient prompt engineers globally</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowRankingsModal(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
                <div className="space-y-3">
                  {topRankings.map((user, i) => (
                    <motion.div
                      key={user.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`flex items-center gap-4 p-3 rounded-2xl border border-transparent hover:border-slate-100 dark:hover:border-gray-700 transition-all ${user.isMe ? 'bg-carbon-green/5 ring-1 ring-carbon-green/10' : ''}`}
                    >
                      <div className="w-8 text-center">
                        {user.rank <= 3 ? (
                          <Medal className={
                            user.rank === 1 ? 'text-amber-400' : 
                            user.rank === 2 ? 'text-slate-400' : 'text-carbon-green'
                          } size={20} />
                        ) : (
                          <span className="text-sm font-bold text-slate-300">{user.rank}</span>
                        )}
                      </div>

                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${user.color} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                        {user.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm truncate">{user.name}</p>
                          {user.isMe && <span className="text-[8px] font-bold text-carbon-green bg-carbon-green/10 px-1.5 py-0.5 rounded-full uppercase">You</span>}
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium">{user.impact} CO₂ saved</p>
                      </div>

                      <div className="flex gap-1.5 flex-wrap justify-end max-w-[120px]">
                        {user.badges.map(badge => (
                          <span key={badge} className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-gray-700 text-[8px] font-bold uppercase tracking-wider">
                            {getBadgeIcon(badge)}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="p-6 sm:p-8 bg-slate-50/50 dark:bg-black/10 border-t border-slate-100 dark:border-gray-700 text-center">
                <p className="text-xs text-slate-500">
                  Rankings are updated every 24 hours based on prompt efficiency.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
