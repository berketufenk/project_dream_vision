import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../../src/components/Dashboard';

const mockUser = {
  id: '1',
  name: 'John',
  surname: 'Doe',
  age: 30,
  sex: 'male' as const,
  horoscope: 'Aries',
  email: 'john@example.com',
  joinDate: '2024-01-01',
  trialAnalysesUsed: 1,
  trialAnalysesLimit: 3,
  isPremium: false
};

const mockStats = {
  totalDreams: 5,
  averageMood: 3.5,
  averageLucidity: 2.8,
  mostCommonThemes: ['Adventure', 'Family', 'Work'],
  mostCommonSymbols: ['water', 'flying', 'animals'],
  dreamingStreak: 3,
  monthlyDreams: [1, 2, 0, 1, 3, 2, 1, 0, 0, 0, 0, 0]
};

describe('Dashboard', () => {
  it('renders welcome message', () => {
    render(<Dashboard stats={mockStats} user={mockUser} />);
    
    expect(screen.getByText(/welcome to your dream dashboard/i)).toBeInTheDocument();
  });

  it('displays correct statistics', () => {
    render(<Dashboard stats={mockStats} user={mockUser} />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // Total dreams
    expect(screen.getByText('3.5')).toBeInTheDocument(); // Average mood
    expect(screen.getByText('2.8')).toBeInTheDocument(); // Average lucidity
    expect(screen.getByText('3')).toBeInTheDocument(); // Dream streak
  });

  it('shows trial status for non-premium users', () => {
    render(<Dashboard stats={mockStats} user={mockUser} />);
    
    expect(screen.getByText(/free trial/i)).toBeInTheDocument();
    expect(screen.getByText(/2 of 3 free analyses remaining/i)).toBeInTheDocument();
  });

  it('shows premium status for premium users', () => {
    const premiumUser = { ...mockUser, isPremium: true };
    render(<Dashboard stats={mockStats} user={premiumUser} />);
    
    expect(screen.getByText(/premium member/i)).toBeInTheDocument();
  });

  it('displays most common themes', () => {
    render(<Dashboard stats={mockStats} user={mockUser} />);
    
    expect(screen.getByText('Adventure')).toBeInTheDocument();
    expect(screen.getByText('Family')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('renders monthly activity chart', () => {
    render(<Dashboard stats={mockStats} user={mockUser} />);
    
    expect(screen.getByText(/monthly dream activity/i)).toBeInTheDocument();
    expect(screen.getByText('Jan')).toBeInTheDocument();
    expect(screen.getByText('Dec')).toBeInTheDocument();
  });
});