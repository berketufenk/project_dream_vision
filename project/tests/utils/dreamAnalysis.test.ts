import { describe, it, expect } from 'vitest';
import { analyzeDream } from '../../src/utils/dreamAnalysis';

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
  title: 'Flying Over Water',
  content: 'I was flying over a vast ocean, feeling free and peaceful. There were birds around me.',
  date: '2024-01-01',
  mood: 4,
  lucidity: 3,
  tags: ['flying', 'peaceful'],
  themes: [],
  symbols: []
};

describe('Dream Analysis', () => {
  it('extracts symbols from dream content', () => {
    const analysis = analyzeDream(mockDream, mockUser);
    
    expect(analysis.symbols).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ symbol: 'water' }),
        expect.objectContaining({ symbol: 'flying' }),
        expect.objectContaining({ symbol: 'animals' })
      ])
    );
  });

  it('identifies themes correctly', () => {
    const analysis = analyzeDream(mockDream, mockUser);
    
    expect(analysis.themes).toContain('Adventure & Exploration');
  });

  it('extracts emotions from content', () => {
    const analysis = analyzeDream(mockDream, mockUser);
    
    expect(analysis.emotions).toContain('Peace');
  });

  it('provides personalized insights based on user profile', () => {
    const analysis = analyzeDream(mockDream, mockUser);
    
    expect(analysis.personalizedInsights).toEqual(
      expect.arrayContaining([
        expect.stringContaining('male perspective')
      ])
    );
  });

  it('includes horoscope connection', () => {
    const analysis = analyzeDream(mockDream, mockUser);
    
    expect(analysis.horoscopeConnection).toContain('Aries');
    expect(analysis.horoscopeConnection).toContain('leadership');
  });

  it('provides psychological meaning', () => {
    const analysis = analyzeDream(mockDream, mockUser);
    
    expect(analysis.psychologicalMeaning).toBeTruthy();
    expect(typeof analysis.psychologicalMeaning).toBe('string');
  });

  it('generates overview', () => {
    const analysis = analyzeDream(mockDream, mockUser);
    
    expect(analysis.overview).toBeTruthy();
    expect(analysis.overview).toContain('subconscious');
  });
});