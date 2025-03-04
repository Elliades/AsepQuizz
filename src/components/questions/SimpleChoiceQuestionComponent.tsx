import React, { useRef, useState, useCallback, useMemo } from 'react';
import { Question } from '../../types';
import QuestionLayout from './QuestionLayout';
import { motion } from 'framer-motion';
import AnswerFeedback from '../feedback/AnswerFeedback';

interface SimpleChoiceQuestionProps {
    question: Question;
    selectedAnswer: string | null;
    onAnswerSelect: (answerId: string | null) => void;
    showExplanation: boolean;
    isSubmitted?: boolean; // New prop to indicate if the question has been submitted
}

/**
 * SimpleChoiceQuestionComponent renders a single-choice question where users can select only one answer.
 * It provides visual feedback for correct/incorrect answers and prevents changing answers after submission.
 * 
 * @param question - The question object containing text, answers, and other properties
 * @param selectedAnswer - The currently selected answer ID
 * @param onAnswerSelect - Callback function when an answer is selected
 * @param showExplanation - Whether to show the explanation for answers
 * @param isSubmitted - Whether the question has been submitted and answers should be locked
 */
const SimpleChoiceQuestionComponent: React.FC<SimpleChoiceQuestionProps> = ({ 
    question, 
    selectedAnswer, 
    onAnswerSelect, 
    showExplanation,
    isSubmitted = false // Default to false for backward compatibility
}) => {
    const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
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

    // Randomize answers order on initial render only
    const randomizedAnswers = useMemo(() => {
        return [...question.answers].sort(() => Math.random() - 0.5);
    }, [question.id]);

    const handleAnswerClick = (answerId: string) => {
        // If the question is already submitted, don't allow changing the answer
        if (isSubmitted) {
            return;
        }
        
        setSelectedAnswerId(answerId);
        
        const isAnswerCorrect = question.answers.find(a => a.id === answerId)?.isCorrect || false;
        setIsCorrect(isAnswerCorrect);
        
        // Reset first to ensure re-render
        setShowFeedback(false);
        
        // Wait for the next render cycle with a longer delay
        setTimeout(() => {
            console.log('Answer elements:', answerElements.current);
            console.log('Selected answer element:', answerElements.current[answerId]);
            setShowFeedback(true);
            
            // Hide feedback after a delay
            setTimeout(() => {
                setShowFeedback(false);
            }, 2000);
        }, 200); // Longer delay to ensure DOM is updated
        
        onAnswerSelect(answerId);
    };

    return (
        <QuestionLayout question={question}>
            {randomizedAnswers.map((answer, index) => (
                <motion.div
                    key={answer.id}
                    ref={(el) => setAnswerRef(el, answer.id)}
                    className={`
                        p-4 mb-2 rounded-lg border
                        ${selectedAnswer === answer.id
                            ? answer.isCorrect && isSubmitted
                                ? 'bg-green-500/20 border-green-500'
                                : !answer.isCorrect && isSubmitted
                                    ? 'bg-red-500/20 border-red-500'
                                    : 'bg-primary/20 border-primary'
                            : isSubmitted && answer.isCorrect && showExplanation
                                ? 'bg-green-500/20 border-green-500 opacity-80'
                                : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
                        }
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
                    {isSubmitted && showExplanation && (answer.isCorrect || selectedAnswer === answer.id) && (
                        <p className="mt-2 text-sm text-gray-400">{answer.explanation}</p>
                    )}
                </motion.div>
            ))}
            {showFeedback && selectedAnswerId && answerElements.current[selectedAnswerId] && (
                <AnswerFeedback 
                    isCorrect={isCorrect}
                    isVisible={showFeedback}
                    element={answerElements.current[selectedAnswerId]}
                />
            )}
        </QuestionLayout>
    )
};

export default SimpleChoiceQuestionComponent; 