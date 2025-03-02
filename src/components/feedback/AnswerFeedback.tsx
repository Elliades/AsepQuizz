/**
 * AnswerFeedback Component
 * 
 * This component provides visual feedback for answer selection.
 * For correct answers: a shine effect sweeps across the element
 * For incorrect answers: a shake effect with red glow
 * 
 * The effect is applied directly to the element using CSS classes.
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
  // Don't render anything if not visible or no element
  if (!isVisible || !element) {
    return null;
  }
  
  // Add the feedback class to the element itself
  useEffect(() => {
    if (!element) return;
    
    // Store the original background color and border color
    const originalBgColor = window.getComputedStyle(element).backgroundColor;
    const originalBorderColor = window.getComputedStyle(element).borderColor;
    
    // Add the appropriate feedback class based on correctness
    if (isCorrect) {
      element.classList.add('answer-feedback-correct');
    } else {
      element.classList.add('answer-feedback-incorrect');
    }
    
    // Remove the class after animation completes
    const timer = setTimeout(() => {
      // Instead of just removing the class, transition smoothly
      element.style.transition = 'background-color 0.8s ease-out, box-shadow 0.8s ease-out, border-color 0.8s ease-out';
      
      if (isCorrect) {
        // If the element has a green background (correct answer), keep it
        if (element.classList.contains('bg-green-500/20')) {
          element.style.backgroundColor = 'rgba(74, 222, 128, 0.2)';
          element.style.borderColor = 'rgb(74, 222, 128)';
          element.style.boxShadow = 'none';
        } else {
          // Otherwise, return to original colors
          element.style.backgroundColor = originalBgColor;
          element.style.borderColor = originalBorderColor;
          element.style.boxShadow = 'none';
        }
      } else {
        // For incorrect answers, transition to red background if it has the class
        if (element.classList.contains('bg-red-500/20')) {
          element.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
          element.style.borderColor = 'rgb(239, 68, 68)';
          element.style.boxShadow = 'none';
        } else {
          // Otherwise, return to original colors
          element.style.backgroundColor = originalBgColor;
          element.style.borderColor = originalBorderColor;
          element.style.boxShadow = 'none';
        }
      }
      
      // Remove the class after the transition
      setTimeout(() => {
        element.classList.remove(isCorrect ? 'answer-feedback-correct' : 'answer-feedback-incorrect');
      }, 800);
    }, 1200); // Reduced to match animation duration
    
    return () => {
      clearTimeout(timer);
      element.classList.remove('answer-feedback-correct');
      element.classList.remove('answer-feedback-incorrect');
    };
  }, [element, isVisible, isCorrect]);
  
  // We don't need to render anything, as we're modifying the element directly
  return null;
};

export default AnswerFeedback; 