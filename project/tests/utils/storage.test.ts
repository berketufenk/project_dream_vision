import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveUser, getUser, saveDream, getDreams, getStats } from '../../src/utils/storage';

const mockUser = {
  id: '1',
  name: 'John',
  surname: 'Doe',
  age: 30,
  sex: 'male' as const,
  horoscope: 'Aries',
  email: 'john@example.com',
  joinDate: '2024-01-01',
  trialAnalysesUsed: 0,
  trialAnalysesLimit: 3,
  isPremium: false
};

const mockDream = {
  id: '1',
  userId: '1',
  title: 'Test Dream',
  content: 'This is a test dream',
  date: '2024-01-01',
  mood: 3,
  lucidity: 2,
  tags: ['test'],
  themes: ['Testing'],
  symbols: ['test']
};

describe('Storage Utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('User Storage', () => {
    it('saves and retrieves user data', () => {
      saveUser(mockUser);
      const retrievedUser = getUser();
      
      expect(retrievedUser).toEqual(mockUser);
    });

    it('returns null when no user data exists', () => {
      const user = getUser();
      expect(user).toBeNull();
    });
  });

  describe('Dream Storage', () => {
    it('saves and retrieves dreams', () => {
      saveDream(mockDream);
      const dreams = getDreams();
      
      expect(dreams).toHaveLength(1);
      expect(dreams[0]).toEqual(mockDream);
    });

    it('updates existing dream', () => {
      saveDream(mockDream);
      
      const updatedDream = { ...mockDream, title: 'Updated Dream' };
      saveDream(updatedDream);
      
      const dreams = getDreams();
      expect(dreams).toHaveLength(1);
      expect(dreams[0].title).toBe('Updated Dream');
    });

    it('returns empty array when no dreams exist', () => {
      const dreams = getDreams();
      expect(dreams).toEqual([]);
    });
  });

  describe('Statistics', () => {
    it('calculates stats correctly', () => {
      saveDream(mockDream);
      saveDream({ ...mockDream, id: '2', mood: 5, themes: ['Testing', 'Adventure'] });
      
      const stats = getStats();
      
      expect(stats.totalDreams).toBe(2);
      expect(stats.averageMood).toBe(4);
      expect(stats.mostCommonThemes).toContain('Testing');
    });

    it('returns default stats when no dreams exist', () => {
      const stats = getStats();
      
      expect(stats.totalDreams).toBe(0);
      expect(stats.averageMood).toBe(0);
      expect(stats.mostCommonThemes).toEqual([]);
    });
  });
});