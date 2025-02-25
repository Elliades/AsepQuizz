import React from 'react';
import { UserAnswer } from '../types';

interface ScoreTrackerProps {
  userAnswers: UserAnswer[];
  totalQuestions: number;
  currentTime: number;
}

export default function ScoreTracker({ 
  userAnswers, 
  totalQuestions,
  currentTime 
}: ScoreTrackerProps) {
  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const answeredQuestions = userAnswers.length;
  const scorePercentage = (correctAnswers / totalQuestions) * 100;
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-primary">
            {correctAnswers}/{totalQuestions}
          </div>
          <div className="text-sm text-gray-400">Score</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-primary">
            {Math.round(scorePercentage)}%
          </div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
        
        <div>
          <div className="text-2xl font-bold text-primary">
            {formatTime(currentTime)}
          </div>
          <div className="text-sm text-gray-400">Time</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
          />
        </div>
        <div className="text-sm text-gray-400 mt-1 text-center">
          Progress: {answeredQuestions}/{totalQuestions} questions
        </div>
      </div>
    </div>
  );
} 