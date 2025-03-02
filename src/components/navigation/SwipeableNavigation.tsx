/**
 * SwipeableNavigation Component
 * 
 * This component provides bidirectional swipeable navigation arrows for moving between questions.
 * It supports both click/tap and swipe gestures for better mobile experience.
 * 
 * Navigation rules:
 * - Grey left arrow for going back (always available except on first question)
 * - Grey right arrow for going forward to already answered questions
 * - Green right arrow for going forward after submitting the current question
 * - No right arrow for unanswered questions
 */
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SwipeableNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  showNext: boolean;
  isNextEnabled: boolean;
  isLastQuestion?: boolean;
  isFirstQuestion?: boolean;
  containerRef?: React.RefObject<HTMLElement>;
}

const SwipeableNavigation: React.FC<SwipeableNavigationProps> = ({ 
  onNext, 
  onPrevious,
  showNext,
  isNextEnabled,
  isLastQuestion = false,
  isFirstQuestion = false,
  containerRef
}) => {
  // Set up swipe detection on the entire container
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    };
    
    const handleSwipeGesture = () => {
      const swipeThreshold = 50;
      if (touchStartX - touchEndX > swipeThreshold) {
        // Swiped left (go forward)
        if (showNext) {
          onNext();
        }
      } else if (touchEndX - touchStartX > swipeThreshold) {
        // Swiped right (go back)
        if (!isFirstQuestion) {
          onPrevious();
        }
      }
    };
    
    // Get the element to attach listeners to
    const element = containerRef?.current || document.body;
    
    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Clean up
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onNext, onPrevious, showNext, isFirstQuestion, containerRef]);

  // Determine the next arrow color class based on isNextEnabled
  const nextArrowColorClass = isNextEnabled 
    ? 'bg-green-600 text-white hover:bg-green-500' 
    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50';

  return (
    <>
      {/* Navigation container with fixed positioning */}
      <div className="fixed inset-x-0 top-1/2 transform -translate-y-1/2 pointer-events-none z-20 px-4 max-w-4xl mx-auto left-0 right-0">
        <div className="relative w-full flex justify-between">
          {/* Previous (Left) Arrow - Visible except on first question */}
          {!isFirstQuestion && (
            <motion.div
              className={`
                pointer-events-auto
                p-3 rounded-full cursor-pointer flex items-center justify-center
                bg-gray-700/50 text-gray-300 hover:bg-gray-600/50
                transition-colors shadow-lg
              `}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={onPrevious}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </motion.div>
          )}

          {/* Spacer when no back arrow */}
          {isFirstQuestion && <div></div>}

          {/* Next (Right) Arrow - Only visible when needed 
          - showNext is true when the current question has been answered
          - isNextEnabled is true when the current question has been answered and the next question is not the last question
          - isLastQuestion is true when the current question is the last question
          */}
          {showNext  ? (
            <motion.div
              className={`
                pointer-events-auto
                p-3 rounded-full cursor-pointer flex items-center justify-center
                ${nextArrowColorClass}
                transition-colors shadow-lg
              `}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={onNext}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={isLastQuestion ? "M5 13l4 4L19 7" : "M9 5l7 7-7 7"} 
                />
              </svg>
            </motion.div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
};

export default SwipeableNavigation; 