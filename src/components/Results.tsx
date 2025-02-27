import React from 'react';
import { QuizAttempt, UserAnswer } from '../types';
import { useLocation } from 'react-router-dom';

interface ResultsProps {
  attempt?: QuizAttempt;
  onRetry?: () => void;
}

const Results: React.FC<ResultsProps> = ({ attempt, onRetry }) => {
  const location = useLocation();
  const resultState = location.state;

  // Use either passed attempt or location state
  const data = attempt || resultState;

  if (!data || !data.answers || data.answers.length === 0) {
    return <div>No results available</div>;
  }

  // Calculate statistics
  const totalQuestions = data.total || data.answers.length;
  const correctAnswers = data.answers.filter(answer => answer.isCorrect).length;
  const score = data.score || (correctAnswers / totalQuestions) * 100;
  const totalTime = data.timeSpent || data.answers.reduce((total, answer) => {
    return total + (answer.timeSpent || 0);
  }, 0);
  const averageTime = totalTime / totalQuestions;

  return (
    <div className="results-container">
      <h2>Quiz Results</h2>
      <div className="stats">
        <p>Score: {score.toFixed(2)}%</p>
        <p>Correct Answers: {correctAnswers} out of {totalQuestions}</p>
        <p>Average Time per Question: {averageTime.toFixed(2)} seconds</p>
        <p>Total Time: {totalTime} seconds</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
};

export default Results; 