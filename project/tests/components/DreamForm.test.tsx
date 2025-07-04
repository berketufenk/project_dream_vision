import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DreamForm } from '../../src/components/DreamForm';

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

const mockProps = {
  onSave: vi.fn(),
  onCancel: vi.fn(),
  user: mockUser,
  onUpgrade: vi.fn()
};

describe('DreamForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders form fields correctly', () => {
    render(<DreamForm {...mockProps} />);
    
    expect(screen.getByLabelText(/dream title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dream description/i)).toBeInTheDocument();
    expect(screen.getByText(/dream mood/i)).toBeInTheDocument();
    expect(screen.getByText(/lucidity level/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
  });

  it('shows trial status for non-premium users', () => {
    render(<DreamForm {...mockProps} />);
    
    expect(screen.getByText(/3 free analyses remaining/i)).toBeInTheDocument();
    expect(screen.getByText(/request analysis/i)).toBeInTheDocument();
  });

  it('shows premium status for premium users', () => {
    const premiumUser = { ...mockUser, isPremium: true };
    render(<DreamForm {...mockProps} user={premiumUser} />);
    
    expect(screen.getByText(/unlimited analyses with premium/i)).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<DreamForm {...mockProps} />);
    
    await user.type(screen.getByLabelText(/dream title/i), 'Flying Dream');
    await user.type(screen.getByLabelText(/dream description/i), 'I was flying over mountains');
    
    await user.click(screen.getByRole('button', { name: /save dream/i }));
    
    await waitFor(() => {
      expect(mockProps.onSave).toHaveBeenCalledWith({
        title: 'Flying Dream',
        content: 'I was flying over mountains',
        mood: 3,
        lucidity: 2,
        tags: [],
        themes: [],
        symbols: [],
        isTrialAnalysis: true
      });
    });
  });

  it('adds and removes tags correctly', async () => {
    const user = userEvent.setup();
    render(<DreamForm {...mockProps} />);
    
    const tagInput = screen.getByPlaceholderText(/add a tag/i);
    const addButton = screen.getByRole('button', { name: /add/i });
    
    await user.type(tagInput, 'nightmare');
    await user.click(addButton);
    
    expect(screen.getByText('nightmare')).toBeInTheDocument();
    
    // Remove tag
    const removeButton = screen.getByText('×');
    await user.click(removeButton);
    
    expect(screen.queryByText('nightmare')).not.toBeInTheDocument();
  });

  it('updates mood and lucidity sliders', async () => {
    const user = userEvent.setup();
    render(<DreamForm {...mockProps} />);
    
    const moodSlider = screen.getByDisplayValue('3');
    await user.clear(moodSlider);
    await user.type(moodSlider, '5');
    
    expect(screen.getByText(/5\/5 - Amazing/i)).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<DreamForm {...mockProps} />);
    
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    
    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('shows upgrade option when trial is expired', () => {
    const expiredUser = { ...mockUser, trialAnalysesUsed: 3 };
    render(<DreamForm {...mockProps} user={expiredUser} />);
    
    expect(screen.getByText(/trial expired/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
  });
});