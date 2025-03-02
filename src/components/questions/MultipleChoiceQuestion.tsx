/**
 * MultipleChoiceQuestion Component
 * 
 * This component renders a multiple choice question where the user can select multiple answers.
 * It handles answer selection, auto-submission, and showing explanations.
 */
import React, { useEffect } from 'react';
import { Question } from '@/types';
import QuestionLayout from './QuestionLayout';

interface MultipleChoiceQuestionProps {
  question: Question;
  selectedAnswers: string[];
  onAnswerSelect: (answerIds: string[]) => void;
  showExplanation: boolean;
  onNext?: () => void;
  isAnswered?: boolean;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  showExplanation,
  onNext,
  isAnswered = false
}) => {
  // Count correct answers to determine how many should be selected
  const correctAnswersCount = question.answers.filter(a => a.isCorrect).length;
  
  // Handle answer click - toggle selection
  const handleAnswerClick = (answerId: string) => {
    if (showExplanation) return; // Don't allow changes after explanation is shown
    
    const isSelected = selectedAnswers.includes(answerId);
    let newSelectedAnswers: string[];
    
    if (isSelected) {
      // Remove from selection
      newSelectedAnswers = selectedAnswers.filter(id => id !== answerId);
    } else {
      // Add to selection, but limit to correctAnswersCount
      if (selectedAnswers.length < correctAnswersCount) {
        newSelectedAnswers = [...selectedAnswers, answerId];
      } else {
        // Replace the first selected answer with the new one
        newSelectedAnswers = [...selectedAnswers.slice(1), answerId];
      }
    }
    
    onAnswerSelect(newSelectedAnswers);
  };
  
  // Get answer style based on selection, correctness, and explanation visibility
  const getAnswerStyle = (answerId: string, isCorrect: boolean) => {
    const isSelected = selectedAnswers.includes(answerId);
    
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
  
  // Auto-submit when the correct number of answers are selected
  useEffect(() => {
    if (selectedAnswers.length === correctAnswersCount && !showExplanation) {
      // Trigger auto-submission logic here if needed
    }
  }, [selectedAnswers, correctAnswersCount, showExplanation]);

  return (
    <QuestionLayout 
      question={question}
      onNext={onNext}
      showNavigation={!!onNext}
      isAnswered={isAnswered}
    >
      <div className="mb-2 text-sm text-gray-400">
        Select {correctAnswersCount} answer{correctAnswersCount !== 1 ? 's' : ''}
      </div>
      
      {question.answers.map((answer) => (
        <div
          key={answer.id}
          className={`p-4 border rounded-md cursor-pointer transition-colors ${getAnswerStyle(
            answer.id,
            answer.isCorrect
          )}`}
          onClick={() => handleAnswerClick(answer.id)}
        >
          <div className="flex items-start">
            <div className="flex-1">{answer.text}</div>
            {showExplanation ? (
              <div className="ml-2">
                {answer.isCorrect ? (
                  <span className="text-green-500">✓</span>
                ) : selectedAnswers.includes(answer.id) ? (
                  <span className="text-red-500">✗</span>
                ) : null}
              </div>
            ) : (
              <div className="ml-2 w-5 h-5 border border-gray-600 rounded flex items-center justify-center">
                {selectedAnswers.includes(answer.id) && (
                  <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
                )}
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

export default MultipleChoiceQuestion; 