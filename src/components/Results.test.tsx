import { render, screen } from '@testing-library/react';
import Results from './Results';
import { QuizAttempt } from '../types';

describe('Results Component', () => {
  const mockAttempt: QuizAttempt = {
    id: '1',
    userId: 'user1',
    quizId: 'quiz1',
    score: 80,
    completedAt: new Date(),
    answers: [
      {
        questionId: 'q1',
        answerId: 'a1',
        isCorrect: true,
        timeSpent: 30
      }
    ],
    timeSpent: 30
  };

  it('renders results when attempt is provided', () => {
    render(<Results attempt={mockAttempt} />);
    expect(screen.getByText(/Quiz Results/i)).toBeInTheDocument();
    expect(screen.getByText(/Score:/i)).toBeInTheDocument();
  });

  it('shows "No results available" when no attempt is provided', () => {
    render(<Results />);
    expect(screen.getByText(/No results available/i)).toBeInTheDocument();
  });
}); 