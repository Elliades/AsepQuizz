/**
 * SimpleChoiceQuestion Component
 * 
 * This component renders a simple choice question where the user can select only one answer.
 * It handles answer selection and showing explanations.
 */
import React from 'react';
import { Question } from '@/types';
import QuestionLayout from './QuestionLayout';

interface SimpleChoiceQuestionProps {
  question: Question;
  selectedAnswer: string;
  onAnswerSelect: (answerId: string) => void;
  showExplanation: boolean;
  onNext?: () => void;
  isAnswered?: boolean;
}

const SimpleChoiceQuestion: React.FC<SimpleChoiceQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showExplanation,
  onNext,
  isAnswered = false
}) => {
  // Get answer style based on selection, correctness, and explanation visibility
  const getAnswerStyle = (answerId: string, isCorrect: boolean) => {
    const isSelected = selectedAnswer === answerId;
    
    if (showExplanation) {
      if (isCorrect) {
        return "border-green-500 bg-green-900/20 text-green-300";
      } else if (isSelected) {
        return "border-red-500 bg-red-900/20 text-red-300";
      }
      return "border-gray-700 bg-gray-800/50 text-gray-400";
    }
    
    return isSelected
      ? "border-indigo-500 bg-indigo-900/20 text-indigo-300"
      : "border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600 hover:bg-gray-700/30";
  };

  return (
    <QuestionLayout 
      question={question}
      onNext={onNext}
      showNavigation={!!onNext}
      isAnswered={isAnswered}
    >
      {question.answers.map((answer) => (
        <div
          key={answer.id}
          className={`p-4 border rounded-md cursor-pointer transition-colors ${getAnswerStyle(
            answer.id,
            answer.isCorrect
          )}`}
          onClick={() => {
            if (!showExplanation) {
              onAnswerSelect(answer.id);
            }
          }}
        >
          <div className="flex items-start">
            <div className="flex-1">{answer.text}</div>
            {showExplanation && (
              <div className="ml-2">
                {answer.isCorrect ? (
                  <span className="text-green-500">✓</span>
                ) : selectedAnswer === answer.id ? (
                  <span className="text-red-500">✗</span>
                ) : null}
              </div>
            )}
          </div>
          
          {/* Explanation */}
          {showExplanation && answer.explanation && (
            <div className="mt-2 text-sm text-gray-400 border-t border-gray-700 pt-2">
              {answer.explanation}
            </div>
          )}
        </div>
      ))}
    </QuestionLayout>
  );
};

export default SimpleChoiceQuestion; 