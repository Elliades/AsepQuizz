import React from 'react';
import { Question, Answer } from '../types';

interface QuizQuestionProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect: (answerId: string) => void;
  showExplanation?: boolean;
}

export default function QuizQuestion({ 
  question, 
  selectedAnswer,
  onAnswerSelect,
  showExplanation = false
}: QuizQuestionProps) {
  return (
    <div className="space-y-6">
      <div className="card relative">
        {/* Question Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold flex items-start gap-2">
            {question.important && (
              <span className="text-yellow-500 font-bold" title="Important Question">!</span>
            )}
            {question.text}
          </h2>
          
          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {question.tags.map(tag => (
                <span 
                  key={tag.id}
                  className="px-2 py-0.5 text-xs bg-gray-700/50 text-gray-400 rounded-full"
                >
                  {tag.type}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Answers */}
        <div className="space-y-3 mb-8">
          {question.answers.map((answer) => (
            <button
              key={answer.id}
              onClick={() => onAnswerSelect(answer.id)}
              className={`w-full text-left p-4 rounded-lg transition-colors ${
                selectedAnswer === answer.id
                  ? answer.isCorrect && showExplanation
                    ? 'bg-green-500/20 border-green-500'
                    : !answer.isCorrect && showExplanation
                    ? 'bg-red-500/20 border-red-500'
                    : 'bg-primary/20 border-primary'
                  : 'bg-gray-800 hover:bg-gray-700'
              } border`}
            >
              {answer.text}
              {showExplanation && selectedAnswer === answer.id && (
                <p className="mt-2 text-sm text-gray-400">{answer.explanation}</p>
              )}
            </button>
          ))}
        </div>

        {/* Updated Footer with Source and Source Question - Bottom Right */}
        <div className="absolute bottom-4 right-4 text-xs">
          {question.source && (
            <span className="text-gray-400">
              Source: {question.source}
              {question.sourceQuestion && (
                <span className="text-gray-500 ml-1">
                  - by: {question.sourceQuestion}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 