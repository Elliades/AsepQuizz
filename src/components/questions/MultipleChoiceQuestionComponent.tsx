import React, { useState, useRef, useEffect } from 'react';
import { MultipleChoiceQuestion } from '@/types';
import { motion } from 'framer-motion';
import AnswerFeedback from '../feedback/AnswerFeedback';
import QuestionLayout from './QuestionLayout';

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestion;
  selectedAnswers: string[];
  onAnswerSelect: (answerIds: string[]) => void;
  showExplanation: boolean;
  isSubmitted?: boolean;
}

/**
 * Component for rendering multiple choice questions.
 * 
 * @param question - The multiple choice question to display
 * @param selectedAnswers - Array of IDs of the currently selected answers
 * @param onAnswerSelect - Callback when answers are selected/deselected
 * @param showExplanation - Whether to show answer explanations
 * @param isSubmitted - Whether the question has been submitted
 */
const MultipleChoiceQuestionComponent: React.FC<MultipleChoiceQuestionProps> = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  showExplanation,
  isSubmitted = false
}) => {
  const [showFeedback, setShowFeedback] = useState(false);
  const answerElements = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Count correct answers for instructions
  const correctAnswersCount = question.answers.filter(a => a.isCorrect).length;
  
  // Set answer element refs for feedback animations
  const setAnswerRef = (el: HTMLDivElement | null, answerId: string) => {
    if (el) {
      answerElements.current[answerId] = el;
    }
  };
  
  // Handle answer selection/deselection with proper validation
  const handleAnswerClick = (answerId: string) => {
    if (isSubmitted) return; // Don't allow changes to submitted questions
    
    let newSelectedAnswers;
    
    if (selectedAnswers.includes(answerId)) {
      // Deselect if already selected
      newSelectedAnswers = selectedAnswers.filter(id => id !== answerId);
    } else {
      // Select if not already at the limit
      if (selectedAnswers.length < correctAnswersCount) {
        newSelectedAnswers = [...selectedAnswers, answerId];
      } else {
        // At limit, replace oldest selection
        newSelectedAnswers = [...selectedAnswers.slice(1), answerId];
      }
    }
    
    // Show feedback briefly when selection changes
    setShowFeedback(false);
    setTimeout(() => setShowFeedback(isSubmitted), 50);
    
    onAnswerSelect(newSelectedAnswers);
  };
  
  // Determine styling for answer elements based on selection state and submission status
  const getAnswerStyle = (answer: { id: string; isCorrect: boolean }) => {
    const isSelected = selectedAnswers.includes(answer.id);
    
    // ONLY show correctness styling when explicitly submitted
    if (isSubmitted) {
      if (isSelected) {
        // For selected answers, show green/red based on correctness
        return answer.isCorrect
          ? 'bg-green-500/20 border-green-500'
          : 'bg-red-500/20 border-red-500';
      } else if (showExplanation && answer.isCorrect) {
        // ONLY when explanation is visible, highlight unselected correct answers
        return 'bg-gray-800 border-green-500';
      }
    }
    
    // Default styling based just on selection state
    return isSelected
      ? 'bg-primary/20 border-primary'
      : 'bg-gray-800 hover:bg-gray-700 border-gray-700';
  };
  
  // Show feedback when a question is submitted
  useEffect(() => {
    if (isSubmitted) {
      setShowFeedback(true);
    }
  }, [isSubmitted]);
  
  return (
    <QuestionLayout question={question}>
      <div className="mb-2 text-sm text-gray-400">
        Select {correctAnswersCount} correct answer{correctAnswersCount > 1 ? 's' : ''}
      </div>
      <div className="space-y-3">
        {question.answers.map((answer, index) => (
          <motion.div
            key={answer.id}
            ref={(el) => setAnswerRef(el, answer.id)}
            className={`
              p-4 mb-2 rounded-lg border
              ${getAnswerStyle(answer)}
              ${isSubmitted ? 'opacity-80' : 'cursor-pointer'}
            `}
            onClick={() => handleAnswerClick(answer.id)}
            whileHover={isSubmitted ? {} : { scale: 1.02 }}
            whileTap={isSubmitted ? {} : { scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            {answer.text}
            {/* ONLY show explanation when both submitted AND explanation enabled */}
            {isSubmitted && showExplanation && answer.isCorrect && (
              <p className="mt-2 text-sm text-green-400">{answer.explanation}</p>
            )}
          </motion.div>
        ))}
      </div>
      {showFeedback && (
        <>
          {question.answers
            .filter(answer => selectedAnswers.includes(answer.id))
            .map(answer => (
              answerElements.current[answer.id] ? (
                <AnswerFeedback 
                  key={answer.id}
                  isCorrect={answer.isCorrect}
                  isVisible={showFeedback}
                  element={answerElements.current[answer.id]}
                />
              ) : null
            ))}
        </>
      )}
    </QuestionLayout>
  );
};

export default MultipleChoiceQuestionComponent; 