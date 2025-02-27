import React from 'react';
import { MultipleChoiceQuestion } from '../../types';
import QuestionLayout from './QuestionLayout';

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestion;
  selectedAnswers: string[];
  onAnswerSelect: (answerIds: string[]) => void;
  showExplanation: boolean;
}

const MultipleChoiceQuestionComponent: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  showExplanation,
}) => {
  const correctAnswersCount = question.answers.filter(answer => answer.isCorrect).length;
  
  const handleAnswerClick = (answerId: string) => {
    if (!answerId || answerId.trim() === '') return; // Skip empty IDs
    
    // Create a new array to avoid direct state mutation
    const newSelectedAnswers = [...selectedAnswers];
    
    // Toggle the answer selection
    const index = newSelectedAnswers.indexOf(answerId);
    if (index > -1) {
      // If already selected, remove it
      newSelectedAnswers.splice(index, 1);
    } else {
      // If not selected, add it
      newSelectedAnswers.push(answerId);
    }
    
    // Pass the updated selection to the parent
    onAnswerSelect(newSelectedAnswers.filter(id => id.trim() !== '')); // Extra safety filter
  };

  // Determine if an answer should show as correct or incorrect
  const getAnswerStyle = (answer: { id: string; isCorrect: boolean }) => {
    if (!showExplanation) {
      // Only show selection state, not correctness
      return selectedAnswers.includes(answer.id)
        ? 'bg-primary/20 border-primary'
        : 'bg-gray-800 hover:bg-gray-700 border-gray-700';
    }
    
    // Show correctness when explanation is visible
    if (selectedAnswers.includes(answer.id)) {
      return answer.isCorrect
        ? 'bg-green-500/20 border-green-500'
        : 'bg-red-500/20 border-red-500';
    } else {
      // Highlight correct answers that weren't selected
      return answer.isCorrect
        ? 'bg-gray-800 border-green-500'
        : 'bg-gray-800 hover:bg-gray-700 border-gray-700';
    }
  };

  return (
    <QuestionLayout question={question}>
      <div className="mb-2 text-sm text-gray-400">
        Select {correctAnswersCount} correct answer{correctAnswersCount > 1 ? 's' : ''}
      </div>
      <div className="space-y-3">
        {question.answers.map((answer) => (
          <button
            key={answer.id}
            onClick={() => handleAnswerClick(answer.id)}
            className={`w-full text-left p-4 rounded-lg transition-colors border ${getAnswerStyle(answer)}`}
          >
            {answer.text}
            {showExplanation && answer.isCorrect && (
              <p className="mt-2 text-sm text-green-400">{answer.explanation}</p>
            )}
          </button>
        ))}
      </div>
    </QuestionLayout>
  );
};

export default MultipleChoiceQuestionComponent; 