import { Dream, User, DreamStats } from '../types';

const STORAGE_KEYS = {
  USER: 'dreamApp_user',
  DREAMS: 'dreamApp_dreams',
  STATS: 'dreamApp_stats'
};

export function saveUser(user: User): void {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

export function getUser(): User | null {
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
}

export function saveDream(dream: Dream): void {
  const dreams = getDreams();
  const existingIndex = dreams.findIndex(d => d.id === dream.id);
  
  if (existingIndex >= 0) {
    dreams[existingIndex] = dream;
  } else {
    dreams.push(dream);
  }
  
  localStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreams));
  updateStats(dreams);
}

export function getDreams(): Dream[] {
  const dreamsData = localStorage.getItem(STORAGE_KEYS.DREAMS);
  return dreamsData ? JSON.parse(dreamsData) : [];
}

export function deleteDream(dreamId: string): void {
  const dreams = getDreams().filter(d => d.id !== dreamId);
  localStorage.setItem(STORAGE_KEYS.DREAMS, JSON.stringify(dreams));
  updateStats(dreams);
}

export function getStats(): DreamStats {
  const statsData = localStorage.getItem(STORAGE_KEYS.STATS);
  return statsData ? JSON.parse(statsData) : {
    totalDreams: 0,
    averageMood: 0,
    averageLucidity: 0,
    mostCommonThemes: [],
    mostCommonSymbols: [],
    dreamingStreak: 0,
    monthlyDreams: Array(12).fill(0)
  };
}

export function incrementTrialUsage(userId: string): void {
  const user = getUser();
  if (user && user.id === userId && !user.isPremium) {
    user.trialAnalysesUsed = Math.min(user.trialAnalysesUsed + 1, user.trialAnalysesLimit);
    saveUser(user);
  }
}

export function upgradeToPremium(userId: string): void {
  const user = getUser();
  if (user && user.id === userId) {
    user.isPremium = true;
    saveUser(user);
  }
}

function updateStats(dreams: Dream[]): void {
  if (dreams.length === 0) return;
  
  const totalDreams = dreams.length;
  const averageMood = dreams.reduce((sum, dream) => sum + dream.mood, 0) / totalDreams;
  const averageLucidity = dreams.reduce((sum, dream) => sum + dream.lucidity, 0) / totalDreams;
  
  // Extract themes and symbols
  const allThemes: string[] = [];
  const allSymbols: string[] = [];
  
  dreams.forEach(dream => {
    allThemes.push(...dream.themes);
    allSymbols.push(...dream.symbols);
  });
  
  const themeCount = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const symbolCount = allSymbols.reduce((acc, symbol) => {
    acc[symbol] = (acc[symbol] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonThemes = Object.entries(themeCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([theme]) => theme);
  
  const mostCommonSymbols = Object.entries(symbolCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([symbol]) => symbol);
  
  // Calculate monthly dreams
  const monthlyDreams = Array(12).fill(0);
  dreams.forEach(dream => {
    const month = new Date(dream.date).getMonth();
    monthlyDreams[month]++;
  });
  
  // Calculate dreaming streak
  const dreamingStreak = calculateDreamingStreak(dreams);
  
  const stats: DreamStats = {
    totalDreams,
    averageMood,
    averageLucidity,
    mostCommonThemes,
    mostCommonSymbols,
    dreamingStreak,
    monthlyDreams
  };
  
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

function calculateDreamingStreak(dreams: Dream[]): number {
  if (dreams.length === 0) return 0;
  
  const sortedDreams = dreams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const dream of sortedDreams) {
    const dreamDate = new Date(dream.date);
    dreamDate.setHours(0, 0, 0, 0);
    
    if (dreamDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (dreamDate.getTime() < currentDate.getTime()) {
      break;
    }
  }
  
  return streak;
}

export function exportDreams(): string {
  const dreams = getDreams();
  const user = getUser();
  
  const exportData = {
    user,
    dreams,
    exportDate: new Date().toISOString(),
    stats: getStats()
  };
  
  return JSON.stringify(exportData, null, 2);
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.DREAMS);
  localStorage.removeItem(STORAGE_KEYS.STATS);
}