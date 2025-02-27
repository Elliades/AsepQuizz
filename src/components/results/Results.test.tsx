import { render, screen } from '@testing-library/react';
import { QuizAttempt } from '../../types';
import Results from './Results';

describe('Results_Pages Component', () => {
  const mockAttempt: QuizAttempt = {
    id: '1',
    userId: 'user1',
    quizId: 'quiz1',
    score: 80,
    completedAt: new Date(),
    answers: [
      {
        questionId: 'q1',
        answerIds: ['a1'],
        isCorrect: true,
        timeSpent: 30
      }
    ],
    timeSpent: 30
  };

  it('renders results when attempt is provided', () => {
    render(<Results attempt={mockAttempt} />);
    expect(screen.getByText(/Quiz_Page Results_Pages/i)).toBeInTheDocument();
    expect(screen.getByText(/Score:/i)).toBeInTheDocument();
  });

  it('shows "No results available" when no attempt is provided', () => {
    render(<Results />);
    expect(screen.getByText(/No results available/i)).toBeInTheDocument();
  });
}); 