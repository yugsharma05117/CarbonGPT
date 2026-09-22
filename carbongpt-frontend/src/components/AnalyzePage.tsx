import React, { useState, useRef, useEffect } from 'react';

import { 
  Send, 
  Zap, 
  Brain, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  Cpu, 
  Globe,
  Lightbulb,
  ArrowRight,
  User,
  Leaf
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage, AnalysisResult } from '../types';
import { sendPrompt } from './api.js';

export default function AnalyzePage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'ai',
      content: "Hello! I'm **CarbonGPT** — your AI prompt efficiency analyzer. Paste a prompt below and I'll analyze its energy footprint, optimize it, and suggest the best model. Let's make AI greener together! 🌱",
      timestamp: new Date()
    }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [model, setModel] = useState('auto');
  const [region, setRegion] = useState('us-west');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsAnalyzing(true);
    setInput('');

    try {
      const response = await sendPrompt(input);

      // Map backend response to AnalysisResult
      const tokens = response.tokensBefore;
      const optTokens = response.tokensAfter;
      const saved = response.tokensSaved;
      const efficiency = tokens > 0 ? Math.round((saved / tokens) * 100) : 0;
      const quality = tokens < 50 ? 'efficient' : tokens < 150 ? 'moderate' : 'high';

      const result: AnalysisResult = {
        originalPrompt: response.originalPrompt,
        originalTokens: tokens,
        optimizedTokens: optTokens,
        originalCo2: response.energyBefore || 0,
        optimizedCo2: response.energyAfter || 0,
        energyWh: (response.energySaved || 0) * 2.5,
        efficiency,
        optimizedPrompt: response.optimizedPrompt,
        explanation: `Backend optimized your prompt, saving ${saved} tokens (${efficiency}%) and ${response.energySaved?.toFixed(1)} energy units. Model used: ${response.modelUsed}.`,
        quality
      };

      setAnalysis(result);

      // Real AI response from backend
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);

      // Update history with real data
      const historyItem = {
        id: Date.now().toString(),
        prompt: input,
        tokens,
        co2: response.energyBefore || 0,
        model: response.modelUsed || 'Auto',
        region,
        timestamp: Date.now(),
        status: quality
      };
      const existingHistory = JSON.parse(localStorage.getItem('carbon_history') || '[]');
      localStorage.setItem('carbon_history', JSON.stringify([historyItem, ...existingHistory]));

    } catch (error) {
      console.error('Analysis failed:', error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Sorry, analysis failed. The backend may be temporarily unavailable. Please try again in a moment.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const liveTokens = Math.ceil(input.split(/\s+/).filter(w => w).length * 1.3);
  const liveCo2 = liveTokens * 0.02 * 0.5 * 0.7;

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden relative">
      {/* LEFT: Chat Interface */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-[#0f172a] relative">
        {/* Banner - Floating at top */}
        <div className="absolute top-0 left-0 right-0 p-6 z-10 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 dark:bg-[#1e293b]/80 backdrop-blur-md border border-carbon-green/20 rounded-2xl px-6 py-3 flex items-center gap-4 shadow-sm pointer-events-auto max-w-2xl mx-auto"
          >
            <span className="text-2xl animate-float">🌱</span>
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              You saved <span className="font-bold">42g CO₂</span> today. Keep it up!
            </p>
          </motion.div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 pt-24 pb-32 space-y-8 scroll-smooth">
          <div className="max-w-3xl mx-auto w-full space-y-8">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ai' && (
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm gradient-bg">
                    <Leaf size={18} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-2' : ''}>
                        {line.split('**').map((part, j) => j % 2 === 1 ? <strong key={j} className="font-bold">{part}</strong> : part)}
                      </p>
                    ))}
                  </div>
                  <p className={`text-[10px] mt-2 opacity-50 font-medium ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm bg-slate-200 dark:bg-gray-700">
                    <User size={18} className="text-slate-500" />
                  </div>
                )}
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-50 dark:from-[#0f172a] via-slate-50 dark:via-[#0f172a] to-transparent">
          <div className="max-w-3xl mx-auto">
            {/* Selectors - Above input */}
            <div className="flex flex-wrap gap-3 mb-4 justify-center">
              <div className="glass-panel rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm">
                <Cpu size={14} className="text-carbon-blue" />
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="bg-transparent text-[11px] font-bold uppercase tracking-wider outline-none cursor-pointer"
                >
                  <option value="auto">Auto Model</option>
                  <option value="gpt4">GPT-4</option>
                  <option value="gpt35">GPT-3.5</option>
                  <option value="claude">Claude 3</option>
                  <option value="llama">LLaMA 3</option>
                </select>
              </div>
              <div className="glass-panel rounded-xl px-3 py-1.5 flex items-center gap-2 shadow-sm">
                <Globe size={14} className="text-carbon-green" />
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="bg-transparent text-[11px] font-bold uppercase tracking-wider outline-none cursor-pointer"
                >
                  <option value="us-west">US West</option>
                  <option value="eu-west">EU West</option>
                  <option value="asia-east">Asia East</option>
                  <option value="india">India</option>
                </select>
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-2 shadow-xl border border-white/20 dark:border-gray-700 focus-within:ring-2 ring-carbon-green/20 transition-all bg-white dark:bg-[#1e293b]">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAnalyze())}
                placeholder="Message CarbonGPT..."
                className="w-full bg-transparent border-none outline-none px-4 py-3 text-sm resize-none min-h-[60px] max-h-[200px]"
                rows={1}
              />
              <div className="flex items-center justify-between px-4 pb-2 pt-1">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Tokens</span>
                    <span className="text-xs font-mono font-bold text-carbon-green">{liveTokens}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest">Est. CO₂</span>
                    <span className="text-xs font-mono font-bold text-carbon-blue">{liveCo2.toFixed(1)}g</span>
                  </div>
                  {liveTokens > 100 && (
                    <div className="flex items-center gap-1 text-amber-500 animate-pulse self-end mb-0.5">
                      <Lightbulb size={12} />
                      <span className="text-[9px] font-bold uppercase tracking-wider">Optimization Tip</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!input.trim() || isAnalyzing}
                  className="gradient-bg text-white rounded-2xl p-2.5 shadow-lg shadow-carbon-green/20 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                  aria-label="Send message"
                >
                  {isAnalyzing ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Analysis Panel */}
      <AnimatePresence>
        {analysis && (
          <motion.aside
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '420px' }}
            exit={{ opacity: 0, width: 0 }}
            className="hidden lg:flex flex-col border-l border-slate-200 dark:border-gray-700 bg-white dark:bg-[#1e293b] overflow-y-auto p-6 space-y-6"
          >
            <div className="flex items-center justify-between sticky top-0 bg-transparent z-10 pb-2">
              <h2 className="text-lg font-display font-extrabold flex items-center gap-2">
                <BarChart3 className="text-carbon-green" size={20} />
                Analysis Panel
              </h2>
              <button 
                onClick={() => setAnalysis(null)} 
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1e293b] text-slate-400 transition-colors"
                aria-label="Close analysis"
              >
                <AlertCircle size={18} />
              </button>
            </div>

            {/* Quality Card */}
            <div className="glass-card rounded-2xl p-5 border-l-4 border-carbon-green">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Prompt Quality</span>
                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                  analysis.quality === 'efficient' ? 'bg-green-100 text-green-700' : 
                  analysis.quality === 'moderate' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {analysis.quality}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: analysis.quality === 'efficient' ? '90%' : analysis.quality === 'moderate' ? '60%' : '30%' }}
                  className={`h-full rounded-full ${
                    analysis.quality === 'efficient' ? 'bg-carbon-green' : 
                    analysis.quality === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                {analysis.quality === 'efficient' ? 'Excellent! Your prompt is concise and energy-efficient.' : 
                 analysis.quality === 'moderate' ? 'Good, but there is room for optimization.' : 'This prompt is energy-intensive. Consider shortening it.'}
              </p>
            </div>

            {/* Smart Warning */}
            <div className={`p-4 rounded-2xl border flex items-center gap-4 ${
              analysis.quality === 'efficient' ? 'bg-green-500/5 border-green-500/20 text-green-700' : 
              analysis.quality === 'moderate' ? 'bg-amber-500/5 border-amber-500/20 text-amber-700' : 
              'bg-red-500/5 border-red-500/20 text-red-700'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                analysis.quality === 'efficient' ? 'bg-green-500/10' : 
                analysis.quality === 'moderate' ? 'bg-amber-500/10' : 'bg-red-500/10'
              }`}>
                <Zap size={20} />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-tight">
                  {analysis.quality === 'efficient' ? 'Eco-Friendly' : analysis.quality === 'moderate' ? 'Moderate Impact' : 'High Footprint'}
                </p>
                <p className="text-[10px] opacity-70 font-medium">Energy consumption is {analysis.quality}</p>
              </div>
            </div>

            {/* Optimization Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2 px-1">
                <Brain size={16} className="text-purple-500" />
                Optimization
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-[#1e293b] border border-slate-200 dark:border-gray-700">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Original</span>
                  <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-3 italic leading-relaxed">"{analysis.originalPrompt || '...'}"</p>
                </div>
                <div className="p-4 rounded-2xl bg-green-500/5 border border-carbon-green/20 relative group">
                  <span className="text-[9px] font-bold text-carbon-green uppercase tracking-widest block mb-2">Optimized</span>
                  <p className="text-xs font-bold leading-relaxed text-slate-800 dark:text-gray-100">
                    {analysis.optimizedPrompt}
                  </p>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(analysis.optimizedPrompt);
                    }}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-white dark:bg-gray-700 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-slate-200 dark:border-gray-700"
                    title="Copy optimized prompt"
                  >
                    <Copy size={14} className="text-carbon-green" />
                  </button>
                </div>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-sm font-bold mb-4 px-1">Comparison</h3>
              <div className="space-y-5">
                {/* Tokens Row */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Tokens</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Original</span>
                    <span className="font-mono text-slate-400">{analysis.originalTokens}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Optimized</span>
                    <span className="font-mono font-bold text-carbon-green">{analysis.optimizedTokens}</span>
                  </div>
                </div>
                
                <div className="h-px bg-slate-100 dark:bg-gray-700" />
                
                {/* CO2 Row */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">CO₂ (g)</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Original</span>
                    <span className="font-mono text-slate-400">{analysis.originalCo2.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Optimized</span>
                    <span className="font-mono font-bold text-carbon-green">{analysis.originalCo2.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card rounded-2xl p-3 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Energy</span>
                <span className="text-xs font-bold text-carbon-blue">{analysis.energyWh.toFixed(1)}Wh</span>
              </div>
              <div className="glass-card rounded-2xl p-3 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Saved</span>
                <span className="text-xs font-bold text-carbon-green">{(analysis.originalCo2 - analysis.optimizedCo2).toFixed(1)}g</span>
              </div>
              <div className="glass-card rounded-2xl p-3 text-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Efficiency</span>
                <span className="text-xs font-bold text-purple-500">{analysis.efficiency}%</span>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="glass-card rounded-2xl p-5 bg-gradient-to-br from-purple-500/5 to-carbon-blue/5 border-purple-500/10">
              <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-amber-500" />
                AI Explanation
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed italic font-medium">
                {analysis.explanation}
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
