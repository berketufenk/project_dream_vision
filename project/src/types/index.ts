export interface User {
  id: string;
  name: string;
  surname: string;
  age: number;
  sex: 'male' | 'female' | 'other';
  horoscope: string;
  email: string;
  profilePicture?: string;
  joinDate: string;
  trialAnalysesUsed: number;
  trialAnalysesLimit: number;
  isPremium: boolean;
}

export interface Dream {
  id: string;
  userId: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  mood: number; // 1-5 scale
  lucidity: number; // 1-5 scale
  symbols: string[];
  themes: string[];
  analysis?: DreamAnalysis;
  visualizationUrl?: string;
  isTrialAnalysis?: boolean;
}

export interface DreamAnalysis {
  overview: string;
  symbols: SymbolInterpretation[];
  themes: string[];
  emotions: string[];
  personalizedInsights: string[];
  horoscopeConnection: string;
  recurringPatterns: string[];
  psychologicalMeaning: string;
}

export interface SymbolInterpretation {
  symbol: string;
  meaning: string;
  personalRelevance: string;
}

export interface DreamStats {
  totalDreams: number;
  averageMood: number;
  averageLucidity: number;
  mostCommonThemes: string[];
  mostCommonSymbols: string[];
  dreamingStreak: number;
  monthlyDreams: number[];
}