/**
 * SwipeableNavigation Component
 * 
 * This component provides a swipeable navigation arrow for moving to the next question.
 * It supports both click/tap and swipe gestures for better mobile experience.
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SwipeableNavigationProps {
  onNext: () => void;
  disabled?: boolean;
}

const SwipeableNavigation: React.FC<SwipeableNavigationProps> = ({ 
  onNext, 
  disabled = false 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Handle swipe gesture
  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false);
    
    // If swiped left with enough velocity or distance, trigger next
    if (info.offset.x < -50 || info.velocity.x < -0.5) {
      if (!disabled) {
        onNext();
      }
    }
  };
  
  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10">
      <motion.div
        className={`flex items-center justify-center w-12 h-12 rounded-full 
                   ${disabled 
                     ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' 
                     : 'bg-indigo-600/80 text-white cursor-pointer hover:bg-indigo-500 active:bg-indigo-700'
                   } shadow-lg transition-colors`}
        whileHover={disabled ? {} : { scale: 1.1 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (!isDragging && !disabled) {
            onNext();
          }
        }}
        title={disabled ? "Answer the question to continue" : "Next question"}
        aria-label={disabled ? "Answer the question to continue" : "Next question"}
        role="button"
        tabIndex={disabled ? -1 : 0}
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
            d="M9 5l7 7-7 7" 
          />
        </svg>
      </motion.div>
      
      {/* Mobile hint */}
      <div className="hidden sm:block absolute -bottom-8 right-0 text-xs text-gray-500 whitespace-nowrap">
        Swipe left to continue
      </div>
    </div>
  );
};

export default SwipeableNavigation; 