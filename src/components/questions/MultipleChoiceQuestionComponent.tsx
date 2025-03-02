import React, { useRef, useState, useCallback } from 'react';
import { MultipleChoiceQuestion } from '../../types';
import QuestionLayout from './QuestionLayout';
import { motion } from 'framer-motion';
import AnswerFeedback from '../feedback/AnswerFeedback';

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
  
  const [lastSelectedAnswerId, setLastSelectedAnswerId] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Store DOM elements directly instead of React.RefObject
  const answerElements = useRef<Record<string, HTMLDivElement>>({});
  
  // Create a callback ref that will store the DOM element
  const setAnswerRef = useCallback((element: HTMLDivElement | null, answerId: string) => {
    if (element) {
      answerElements.current[answerId] = element;
      console.log(`Ref set for answer ${answerId}`, element);
    }
  }, []);

  const handleAnswerClick = (answerId: string) => {
    setLastSelectedAnswerId(answerId);
    
    // Toggle the answer selection
    let newSelectedAnswers: string[];
    if (selectedAnswers.includes(answerId)) {
      newSelectedAnswers = selectedAnswers.filter(id => id !== answerId);
    } else {
      newSelectedAnswers = [...selectedAnswers, answerId];
    }
    
    // Check if we've selected the correct number of answers
    if (newSelectedAnswers.length === correctAnswersCount) {
      // Determine if all selected answers are correct
      const correctAnswerIds = question.answers
        .filter(answer => answer.isCorrect)
        .map(answer => answer.id);
      
      const allCorrect = 
        newSelectedAnswers.length === correctAnswerIds.length &&
        newSelectedAnswers.every(id => correctAnswerIds.includes(id)) &&
        correctAnswerIds.every(id => newSelectedAnswers.includes(id));
      
      setIsCorrect(allCorrect);
      
      // Only show feedback if all answers are correct
      if (allCorrect) {
        // Reset first to ensure re-render
        setShowFeedback(false);
        
        // Wait for the next render cycle with a longer delay
        setTimeout(() => {
          console.log('Setting showFeedback to true');
          console.log('Answer elements:', answerElements.current);
          setShowFeedback(true);
          
          // Hide feedback after a delay
          setTimeout(() => {
            setShowFeedback(false);
          }, 2000);
        }, 200); // Longer delay to ensure DOM is updated
      }
    }
    
    // Call the parent's onAnswerSelect
    onAnswerSelect(newSelectedAnswers);
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
        {question.answers.map((answer, index) => (
          <motion.div
            key={answer.id}
            ref={(el) => setAnswerRef(el, answer.id)}
            className={`
              p-4 mb-2 rounded-lg cursor-pointer border
              ${getAnswerStyle(answer)}
            `}
            onClick={() => handleAnswerClick(answer.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            {answer.text}
            {showExplanation && answer.isCorrect && (
              <p className="mt-2 text-sm text-green-400">{answer.explanation}</p>
            )}
          </motion.div>
        ))}
      </div>
      {showFeedback && isCorrect && (
        <>
          {question.answers
            .filter(answer => answer.isCorrect)
            .map(answer => (
              answerElements.current[answer.id] ? (
                <AnswerFeedback 
                  key={answer.id}
                  isCorrect={true}
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