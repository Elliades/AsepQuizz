import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useLocation, useNavigate } from 'react-router-dom';
import Results_Pages from './Results_Pages.tsx';
import '@testing-library/jest-dom';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

// Sample test data
const mockResultsState = {
  score: 7,
  total: 10,
  timeSpent: 300, // 5 minutes
  answers: [
    { questionId: '1', answerId: 'a1', isCorrect: true },
    { questionId: '2', answerId: 'a2', isCorrect: false },
    { questionId: '3', answerId: 'a3', isCorrect: true },
  ],
  questions: [
    {
      id: '1',
      text: 'Question 1',
      subjectId: 'Systems Thinking',
      difficulty: 'beginner',
      answers: [
        { id: 'a1', text: 'Correct Answer', isCorrect: true, explanation: 'This is why' },
        { id: 'a2', text: 'Wrong Answer', isCorrect: false, explanation: 'Not this' },
      ],
    },
    {
      id: '2',
      text: 'Question 2',
      subjectId: 'Requirements Engineering',
      difficulty: 'intermediate',
      answers: [
        { id: 'a1', text: 'Wrong Answer', isCorrect: false, explanation: 'Not this' },
        { id: 'a2', text: 'Correct Answer', isCorrect: true, explanation: 'This is why' },
      ],
    },
    {
      id: '3',
      text: 'Question 3',
      subjectId: 'Systems Thinking',
      difficulty: 'advanced',
      answers: [
        { id: 'a3', text: 'Correct Answer', isCorrect: true, explanation: 'This is why' },
        { id: 'a4', text: 'Wrong Answer', isCorrect: false, explanation: 'Not this' },
      ],
    },
  ],
};

describe('Results_Pages Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useLocation as jest.Mock).mockReturnValue({ state: mockResultsState });
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  // Functional Tests
  describe('Functional Tests', () => {
    test('renders all main sections', () => {
      render(<Results_Pages />);
      
      expect(screen.getByText('Quiz_Page Results_Pages')).toBeInTheDocument();
      expect(screen.getByText('Performance Analysis')).toBeInTheDocument();
      expect(screen.getByText('Topic Performance')).toBeInTheDocument();
      expect(screen.getByText('Areas for Improvement')).toBeInTheDocument();
      expect(screen.getByText('Questions to Review')).toBeInTheDocument();
    });

    test('renders score summary with correct values and colors', () => {
      render(<Results_Pages />);
      
      const scoreElement = screen.getByText('70%');
      expect(scoreElement).toBeInTheDocument();
      expect(scoreElement.className).toContain('text-yellow-500'); // Score between 60-80%
      
      expect(screen.getByText('7/10')).toBeInTheDocument();
    });

    test('displays correct time formatting and calculations', () => {
      render(<Results_Pages />);
      
      expect(screen.getByText('5:00')).toBeInTheDocument(); // Total time
      expect(screen.getByText('0:30')).toBeInTheDocument(); // Avg time per question
    });

    test('calculates and displays topic statistics with correct percentages', () => {
      render(<Results_Pages />);
      
      // Systems Thinking stats (2 questions, 2 correct = 100%)
      const systemsThinkingSection = screen.getByText('Systems Thinking').closest('div');
      expect(systemsThinkingSection).toHaveTextContent('2/2');
      expect(systemsThinkingSection).toHaveTextContent('100%');
      
      // Requirements Engineering stats (1 question, 0 correct = 0%)
      const requirementsSection = screen.getByText('Requirements Engineering').closest('div');
      expect(requirementsSection).toHaveTextContent('0/1');
      expect(requirementsSection).toHaveTextContent('0%');
    });

    test('displays correct difficulty breakdown for each topic', () => {
      render(<Results_Pages />);
      
      // Check Systems Thinking difficulty breakdown
      const difficultyStats = screen.getAllByText(/beginner|intermediate|advanced/);
      expect(difficultyStats).toHaveLength(6); // 2 topics × 3 difficulties
      
      // Verify percentages for each difficulty
      expect(screen.getByText('100%')).toBeInTheDocument(); // beginner success rate
    });

    test('navigation buttons trigger correct routes', () => {
      render(<Results_Pages />);
      
      fireEvent.click(screen.getByText('Try Another Quiz_Page'));
      expect(mockNavigate).toHaveBeenCalledWith('/quiz/random');
      
      fireEvent.click(screen.getByText('Study by Subject'));
      expect(mockNavigate).toHaveBeenCalledWith('/subjects');
    });
  });

  // Disfunctional Tests
  describe('Disfunctional Tests', () => {
    test('handles missing location state by showing error message', () => {
      (useLocation as jest.Mock).mockReturnValue({ state: null });
      render(<Results_Pages />);
      
      expect(screen.getByText(/No results available/i)).toBeInTheDocument();
    });

    test('handles missing question difficulty by defaulting to intermediate', () => {
      const modifiedState = {
        ...mockResultsState,
        questions: [{
          ...mockResultsState.questions[0],
          difficulty: undefined,
        }],
      };
      
      (useLocation as jest.Mock).mockReturnValue({ state: modifiedState });
      render(<Results_Pages />);
      
      expect(screen.getByText('intermediate')).toBeInTheDocument();
    });

    test('handles zero total questions with appropriate UI feedback', () => {
      const modifiedState = {
        ...mockResultsState,
        score: 0,
        total: 0,
        questions: [],
        answers: [],
      };
      
      (useLocation as jest.Mock).mockReturnValue({ state: modifiedState });
      render(<Results_Pages />);
      
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.queryByText('NaN%')).not.toBeInTheDocument();
      expect(screen.getByText('No questions answered')).toBeInTheDocument();
    });

    test('handles malformed answer data gracefully', () => {
      const modifiedState = {
        ...mockResultsState,
        answers: [{ questionId: '1', answerId: 'invalid' }], // Malformed answer
      };
      
      (useLocation as jest.Mock).mockReturnValue({ state: modifiedState });
      expect(() => render(<Results_Pages />)).not.toThrow();
    });

    test('handles missing answer explanations without crashing', () => {
      const modifiedState = {
        ...mockResultsState,
        questions: [{
          ...mockResultsState.questions[0],
          answers: [{ id: 'a1', text: 'Answer', isCorrect: true }], // No explanation
        }],
      };
      
      (useLocation as jest.Mock).mockReturnValue({ state: modifiedState });
      render(<Results_Pages />);
      
      // Should still render the answer without explanation
      expect(screen.getByText('Answer')).toBeInTheDocument();
    });

    test('handles extremely long question texts properly', () => {
      const modifiedState = {
        ...mockResultsState,
        questions: [{
          ...mockResultsState.questions[0],
          text: 'A'.repeat(1000), // Very long question text
        }],
      };
      
      (useLocation as jest.Mock).mockReturnValue({ state: modifiedState });
      render(<Results_Pages />);
      
      // Should truncate or handle long text appropriately
      const questionElement = screen.getByText(/A+/);
      expect(questionElement).toBeInTheDocument();
      expect(questionElement.textContent?.length).toBeLessThan(1000);
    });
  });
}); 