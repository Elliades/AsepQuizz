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
  errors: number;
  byDifficulty: {
    beginner: { total: number; correct: number };
    intermediate: { total: number; correct: number };
    advanced: { total: number; correct: number };
  };
}

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  
  if (!location.state) {
    return <div>No results available</div>;
  }
  
  const { score, total, answers, timeSpent, questions } = location.state as ResultsState;

  if (!questions || !answers) {
    return <div>No results available</div>;
  }

  if (total === 0) {
    return <div>No questions answered</div>;
  }

  // Data Integrity Check 8: Ensure questions and answers have the same length
  if (answers.length !== questions.length) {
    console.error("Results: Answer count doesn't match question count!", answers.length, questions.length);
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const scorePercentage = Math.round((score / total) * 100);
  const averageTimePerQuestion = Math.round(timeSpent / total);

  const getScoreColor = (percentage: number): string => {
    if (percentage >= 80) return 'text-green-500';
    if (percentage >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  // Calculate topic statistics
  const topicStats = questions.reduce((acc: Record<string, TopicStats>, question, index) => {
    // Ensure topic is never undefined
    const topic = question.topic || "General";
    
    // Log for debugging
    console.log(`Processing question ${index}, topic: ${topic}, id: ${question.id}`);
    
    if (!acc[topic]) {
      acc[topic] = {
        name: topic,
        total: 0,
        correct: 0,
        errors: 0,
        byDifficulty: {
          beginner: { total: 0, correct: 0 },
          intermediate: { total: 0, correct: 0 },
          advanced: { total: 0, correct: 0 }
        }
      };
    }

    const answer = answers.find(a => a.questionId === question.id);
    // Log the answer details
    console.log(`Answer for question ${question.id}:`, answer);
    // Data Integrity Check 9: Ensure answer.isCorrect is a boolean
    if (answer && typeof answer.isCorrect !== 'boolean')
    {
      console.error(`Answer for question ${question.id} has non-boolean isCorrect!`, answer)
    }
    
    const difficulty = (question.difficulty || 'intermediate') as 'beginner' | 'intermediate' | 'advanced';
    
    acc[topic].total++;
    
    // Make sure we check if answer exists at all
    if (answer) {
      if (answer.isCorrect === false) {
        acc[topic].errors++;
      }
      
      if (acc[topic].byDifficulty[difficulty]) {
        acc[topic].byDifficulty[difficulty].total++;
        
        if (answer.isCorrect === true) {
          acc[topic].correct++;
          acc[topic].byDifficulty[difficulty].correct++;
          console.log(`Incremented correct count for ${topic}`);
        }
      }
    } else {
      console.warn(`No answer found for question ID: ${question.id}`);
    }

    return acc;
  }, {});

  // Sort topics by actual error count instead of rate
  const sortedTopics = Object.values(topicStats)
    .sort((a, b) => b.errors - a.errors)
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
              {scorePercentage}%
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

      {/* Topic Performance Overview */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Topic Performance Overview</h2>
        <div className="flex text-sm text-gray-400 mb-4 px-4">
          <div className="w-48">Subject</div>
          <div className="flex-1 text-right pr-16">Success Rate</div>
        </div>
        
        <div className="space-y-6">
  {Object.values(topicStats).map(topic => (
    <div key={topic.name} className="space-y-2 px-4">
      <span className="font-medium block mb-2">{topic.name}</span>
      <div className="flex items-center gap-4">
        {/* Bar chart with difficulty breakdown */}
        <div className="relative h-8 bg-gray-700 rounded-lg overflow-hidden flex-1">
          {/* Progress bar with topic name and score */}
          <div 
            className="absolute inset-y-0 left-0 bg-green-500/50 flex items-center px-2"
            style={{ width: `${(topic.correct / topic.total) * 100}%`, minWidth: '3rem' }}
          >
            <span className="text-white text-sm font-medium whitespace-nowrap">
              {topic.name}
            </span>
          </div>

          {/* Fallback text if the progress bar is too small */}
          <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
           {topic.correct}/{topic.total}
          </div>
 

                  {/* Difficulty markers */}
                  <div className="absolute inset-0 flex">
                    {['beginner', 'intermediate', 'advanced'].map((diff, idx) => {
                      const stats = topic.byDifficulty[diff as keyof typeof topic.byDifficulty];
                      const width = `${(stats.total/topic.total) * 100}%`;
                      return stats.total > 0 && (
                        <div
                          className="relative"
                          style={{ width }}
                        >
                          <div
                            key={diff}
                            className="absolute inset-0 border-r border-gray-600 flex items-center justify-center"
                            style={{
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            }}
                          >
                            <span className="text-xs text-gray-400">
                              {stats.correct}/{stats.total}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <span className={`text-sm w-16 ${getScoreColor(Math.round((topic.correct/topic.total) * 100))}`}>
                  {Math.round((topic.correct/topic.total) * 100)}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {['Beginner', 'Intermediate', 'Advanced'].map((diff, idx) => (
                  <span key={diff} className="px-2" style={{ width: '33.33%', textAlign: 'center' }}>{diff}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Areas for Improvement */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Top 3 Areas for Improvement</h2>
        <div className="space-y-4">
          {sortedTopics.slice(0, 3).map((topic, index) => (
            <div key={topic.name} className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-4 mb-3">
                <div className="text-2xl font-bold text-gray-500">#{index + 1}</div>
                <div>
                  <h4 className="font-medium">{topic.name}</h4>
                  <div className="text-sm text-red-500">
                    Success Rate: {Math.round((topic.correct/topic.total) * 100)}%
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <div className="font-medium mb-1">Review Materials:</div>
                <ul className="space-y-1 ml-4">
                  <li>• INCOSE Handbook Ch. 4.3: {topic.name}</li>
                  <li>• ISO/IEC 15288 §6.4.3: Technical Processes</li>
                  <li>• SE Practice Guide: Section {topic.name}</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Questions to Review */}
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