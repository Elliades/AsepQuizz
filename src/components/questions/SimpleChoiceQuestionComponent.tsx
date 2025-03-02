import React, { useRef, useState, useCallback } from 'react';
import { Question } from '../../types';
import QuestionLayout from './QuestionLayout';
import { motion } from 'framer-motion';
import AnswerFeedback from '../feedback/AnswerFeedback';

interface SimpleChoiceQuestionProps {
    question: Question;
    selectedAnswer: string | null;
    onAnswerSelect: (answerId: string | null) => void;
    showExplanation: boolean;
}

const SimpleChoiceQuestionComponent: React.FC<SimpleChoiceQuestionProps> = ({ question, selectedAnswer, onAnswerSelect, showExplanation }) => {
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

    const handleAnswerClick = (answerId: string) => {
        setSelectedAnswerId(answerId);
        
        const isAnswerCorrect = question.answers.find(a => a.id === answerId)?.isCorrect || false;
        setIsCorrect(isAnswerCorrect);
        
        // Only show feedback if the answer is correct
        if (isAnswerCorrect) {
            // Reset first to ensure re-render
            setShowFeedback(false);
            
            // Wait for the next render cycle with a longer delay
            setTimeout(() => {
                console.log('Setting showFeedback to true');
                console.log('Answer elements:', answerElements.current);
                console.log('Selected answer element:', answerElements.current[answerId]);
                setShowFeedback(true);
                
                // Hide feedback after a delay
                setTimeout(() => {
                    setShowFeedback(false);
                }, 2000);
            }, 200); // Longer delay to ensure DOM is updated
        }
        
        onAnswerSelect(answerId);
    };

    return (
        <QuestionLayout question={question}>
            {question.answers.map((answer, index) => (
                <motion.div
                    key={answer.id}
                    ref={(el) => setAnswerRef(el, answer.id)}
                    className={`
                        p-4 mb-2 rounded-lg cursor-pointer border
                        ${selectedAnswer === answer.id
                            ? answer.isCorrect && showExplanation
                                ? 'bg-green-500/20 border-green-500'
                                : !answer.isCorrect && showExplanation
                                    ? 'bg-red-500/20 border-red-500'
                                    : 'bg-primary/20 border-primary'
                            : 'bg-gray-800 hover:bg-gray-700 border-gray-700'
                        }
                    `}
                    onClick={() => handleAnswerClick(answer.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                    {answer.text}
                    {showExplanation && selectedAnswer === answer.id && (
                        <p className="mt-2 text-sm text-gray-400">{answer.explanation}</p>
                    )}
                </motion.div>
            ))}
            {showFeedback && isCorrect && selectedAnswerId && answerElements.current[selectedAnswerId] && (
                <AnswerFeedback 
                    isCorrect={true}
                    isVisible={showFeedback}
                    element={answerElements.current[selectedAnswerId]}
                />
            )}
        </QuestionLayout>
    )
};

export default SimpleChoiceQuestionComponent; 