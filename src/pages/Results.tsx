import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserAnswer, Question } from '../types';
import { getQuizById } from '../utils/quizLoader';

interface ResultsState {
  score: number;
  total: number;
  answers: UserAnswer[];
  timeSpent: number;
  questions: Question[];
}

interface TopicStats {
  name: string;
  total: number;
  correct: number;
  byDifficulty: {
    beginner: { total: number; correct: number };
    intermediate: { total: number; correct: number };
    advanced: { total: number; correct: number };
  };
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, answers, timeSpent, questions } = location.state as ResultsState;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const scorePercentage = (score / total) * 100;
  const averageTimePerQuestion = Math.round(timeSpent / total);

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Calculate topic statistics
  const topicStats = questions.reduce((acc: Record<string, TopicStats>, question) => {
    const topic = question.subjectId;
    if (!acc[topic]) {
      acc[topic] = {
        name: topic,
        total: 0,
        correct: 0,
        byDifficulty: {
          beginner: { total: 0, correct: 0 },
          intermediate: { total: 0, correct: 0 },
          advanced: { total: 0, correct: 0 }
        }
      };
    }

    const answer = answers.find(a => a.questionId === question.id);
    // Ensure difficulty is one of the valid options
    const difficulty = (question.difficulty || 'intermediate') as 'beginner' | 'intermediate' | 'advanced';
    
    acc[topic].total++;
    if (acc[topic].byDifficulty[difficulty]) {
      acc[topic].byDifficulty[difficulty].total++;
      
      if (answer?.isCorrect) {
        acc[topic].correct++;
        acc[topic].byDifficulty[difficulty].correct++;
      }
    }

    return acc;
  }, {});

  // Sort topics by error rate (descending)
  const sortedTopics = Object.values(topicStats)
    .sort((a, b) => (b.total - b.correct) / b.total - (a.total - a.correct) / a.total)
    .slice(0, 3);

  // Get incorrect questions
  const incorrectQuestions = questions.filter(q => 
    answers.find(a => a.questionId === q.id)?.isCorrect === false
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Quiz Results</h1>

      {/* Summary Card */}
      <div className="card mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className={`text-3xl font-bold ${getScoreColor(scorePercentage)}`}>
              {Math.round(scorePercentage)}%
            </div>
            <div className="text-sm text-gray-400">Score</div>
          </div>
          
          <div>
            <div className="text-3xl font-bold text-primary">
              {score}/{total}
            </div>
            <div className="text-sm text-gray-400">Correct Answers</div>
          </div>

          <div>
            <div className="text-3xl font-bold text-primary">
              {formatTime(timeSpent)}
            </div>
            <div className="text-sm text-gray-400">Total Time</div>
          </div>

          <div>
            <div className="text-3xl font-bold text-primary">
              {formatTime(averageTimePerQuestion)}
            </div>
            <div className="text-sm text-gray-400">Avg. Time/Question</div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Analysis</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm text-gray-400">Speed</div>
            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ 
                  width: `${Math.min(100, (30 / averageTimePerQuestion) * 100)}%` 
                }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 text-sm text-gray-400">Accuracy</div>
            <div className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  getScoreColor(scorePercentage).replace('text-', 'bg-')
                }`}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Topic Analysis */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Topic Performance</h2>
        <div className="space-y-6">
          {Object.values(topicStats).map(topic => (
            <div key={topic.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{topic.name}</span>
                <span className="text-sm text-gray-400">
                  {topic.correct}/{topic.total} ({Math.round((topic.correct/topic.total) * 100)}%)
                </span>
              </div>
              
              {/* Difficulty breakdown */}
              <div className="grid grid-cols-3 gap-2 text-sm">
                {Object.entries(topic.byDifficulty).map(([diff, stats]) => (
                  stats.total > 0 && (
                    <div key={diff} className="bg-gray-800 rounded p-2">
                      <div className="text-gray-400 capitalize">{diff}</div>
                      <div className="font-medium">
                        {Math.round((stats.correct/stats.total) * 100)}%
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Error Topics */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Areas for Improvement</h2>
        <div className="space-y-6">
          {sortedTopics.map(topic => (
            <div key={topic.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{topic.name}</span>
                <span className="text-red-500">
                  {topic.total - topic.correct} errors
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500"
                  style={{ 
                    width: `${((topic.total - topic.correct) / topic.total) * 100}%` 
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incorrect Questions Review */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Questions to Review</h2>
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {incorrectQuestions.map((question, index) => (
              <div 
                key={question.id} 
                className="flex-none w-80 bg-gray-800 p-4 rounded-lg"
              >
                <div className="text-sm text-gray-400 mb-2">Question {index + 1}</div>
                <p className="font-medium mb-4">{question.text}</p>
                <div className="space-y-2">
                  {question.answers.map(answer => {
                    const isSelected = answers.find(
                      a => a.questionId === question.id
                    )?.answerId === answer.id;
                    return (
                      <div 
                        key={answer.id}
                        className={`p-2 rounded ${
                          answer.isCorrect 
                            ? 'bg-green-500/20 border-green-500' 
                            : isSelected 
                              ? 'bg-red-500/20 border-red-500'
                              : 'bg-gray-700'
                        } border`}
                      >
                        {answer.text}
                        {(answer.isCorrect || isSelected) && (
                          <p className="text-sm text-gray-400 mt-1">
                            {answer.explanation}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button 
          onClick={() => navigate('/quiz/random')}
          className="btn bg-primary hover:bg-primary-dark"
        >
          Try Another Quiz
        </button>
        <button 
          onClick={() => navigate('/subjects')}
          className="btn bg-gray-700 hover:bg-gray-600"
        >
          Study by Subject
        </button>
      </div>
    </div>
  );
} 