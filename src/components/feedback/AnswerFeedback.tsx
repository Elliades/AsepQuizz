/**
 * AnswerFeedback Component
 * 
 * This component provides a shine effect for correct answers.
 * It creates a moving light that sweeps across the answer element,
 * giving the impression of a highlight moving from left to right.
 * 
 * The effect is applied directly to the element using CSS classes
 * rather than creating a separate overlay element.
 */
import React, { useEffect } from 'react';
import './AnswerFeedback.css';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  isVisible: boolean;
  element?: HTMLElement;
}

const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({ 
  isCorrect, 
  isVisible,
  element
}) => {
  // Don't render anything if not visible or not correct or no element
  if (!isVisible || !isCorrect || !element) {
    return null;
  }
  
  // Add the feedback class to the element itself
  useEffect(() => {
    if (!element) return;
    
    // Add the feedback class
    element.classList.add('answer-feedback-active');
    
    // Remove the class after animation completes
    const timer = setTimeout(() => {
      element.classList.remove('answer-feedback-active');
    }, 1500); // Reduced from 2000ms to 1500ms for quicker animation
    
    return () => {
      clearTimeout(timer);
      element.classList.remove('answer-feedback-active');
    };
  }, [element, isVisible]);
  
  // We don't need to render anything, as we're modifying the element directly
  return null;
};

export default AnswerFeedback; 