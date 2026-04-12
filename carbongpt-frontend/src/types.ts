export type Page = 'analyze' | 'dashboard' | 'leaderboard' | 'history' | 'profile';

export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
  tokens?: number;
  co2?: number;
}

export interface AnalysisResult {
  originalPrompt: string;
  originalTokens: number;
  optimizedTokens: number;
  originalCo2: number;
  optimizedCo2: number;
  energyWh: number;
  efficiency: number;
  optimizedPrompt: string;
  explanation: string;
  quality: 'efficient' | 'moderate' | 'high';
}

export interface HistoryItem {
  id: string;
  prompt: string;
  tokens: number;
  co2: number;
  model: string;
  region: string;
  timestamp: number;
  status: 'efficient' | 'moderate' | 'high';
}
