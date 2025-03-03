import { useState, useEffect, useCallback, useRef } from 'react';
import { Question, UserAnswer } from '../types';

/**
 * Interface for tracking quiz navigation state
 */
interface QuizNavigationState {
  currentIndex: number;
  furthestViewedIndex: number;
  submittedQuestionIds: Set<string>;
  isAutoAdvancing: boolean;
}

/**
 * Hook that centralizes quiz navigation logic across the application.
 * 
 * This hook manages:
 * - Current question index
 * - Furthest viewed question index
 * - Tracking of submitted questions
 * - Auto-advancing behavior
 * - Navigation visibility rules
 * 
 * @param questions Array of quiz questions
 * @param onComplete Callback to execute when the quiz is completed
 * @returns Navigation state and control functions
 */
export function useQuizNavigation(questions: Question[], onComplete?: (answers: UserAnswer[]) => void) {
  // Navigation state
  const [state, setState] = useState<QuizNavigationState>({
    currentIndex: 0,
    furthestViewedIndex: 0,
    submittedQuestionIds: new Set<string>(),
    isAutoAdvancing: false
  });
  
  // Use refs to track auto-advance timer and prevent race conditions
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const currentIndexRef = useRef<number>(0);
  
  // Keep the ref in sync with state
  useEffect(() => {
    currentIndexRef.current = state.currentIndex;
  }, [state.currentIndex]);
  
  // Update furthestViewedIndex whenever currentIndex changes
  useEffect(() => {
    if (state.currentIndex > state.furthestViewedIndex) {
      setState(prev => ({
        ...prev,
        furthestViewedIndex: state.currentIndex
      }));
    }
  }, [state.currentIndex]);
  
  // Clear auto-advance timer - separate function for reuse
  const clearAutoAdvanceTimer = useCallback(() => {
    if (autoAdvanceTimerRef.current !== null) {
      window.clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);
  
  // Navigation control functions
  const goToNext = useCallback(() => {
    // Always clear any pending auto-advance when manually navigating
    clearAutoAdvanceTimer();
    
    if (currentIndexRef.current < questions.length - 1) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        isAutoAdvancing: false
      }));
    }
  }, [questions.length, clearAutoAdvanceTimer]);
  
  const goToPrevious = useCallback(() => {
    // Always clear any pending auto-advance when manually navigating
    clearAutoAdvanceTimer();
    
    if (currentIndexRef.current > 0) {
      setState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex - 1,
        isAutoAdvancing: false
      }));
    }
  }, [clearAutoAdvanceTimer]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return clearAutoAdvanceTimer;
  }, [clearAutoAdvanceTimer]);
  
  // Mark a question as submitted
  const markQuestionSubmitted = useCallback((questionId: string, updatedAnswers: UserAnswer[], autoAdvance = true) => {
    // First, clear any existing timer
    clearAutoAdvanceTimer();
    
    setState(prev => {
      // Create new set with the submitted question ID
      const newSubmittedIds = new Set(prev.submittedQuestionIds);
      newSubmittedIds.add(questionId);
      
      // Calculate new furthestViewedIndex
      const newFurthestViewedIndex = autoAdvance && prev.currentIndex < questions.length - 1 
        ? Math.max(prev.furthestViewedIndex, prev.currentIndex + 1) 
        : prev.furthestViewedIndex;
      
      // Determine if we should auto-advance
      let isAutoAdvancing = false;
      if (autoAdvance && prev.currentIndex < questions.length - 1) {
        isAutoAdvancing = true;
        
        // Use setImmediate-like approach to avoid closure issues
        setTimeout(() => {
          // Double-check that we're still on the same question before auto-advancing
          if (currentIndexRef.current === prev.currentIndex) {
            autoAdvanceTimerRef.current = window.setTimeout(() => {
              // Clear timer ref
              autoAdvanceTimerRef.current = null;
              
              // IMPORTANT: Check current index again to prevent race conditions
              setState(currentState => {
                // Only advance if we're still on the same question
                if (currentState.currentIndex === prev.currentIndex) {
                  console.log(`Auto-advancing from question ${currentState.currentIndex} to ${currentState.currentIndex + 1}`);
                  return {
                    ...currentState,
                    currentIndex: currentState.currentIndex + 1,
                    isAutoAdvancing: false
                  };
                }
                return currentState;
              });
            }, 1500);
          }
        }, 0);
      } else if (autoAdvance && prev.currentIndex === questions.length - 1) {
        // Last question completion
        autoAdvanceTimerRef.current = window.setTimeout(() => {
          autoAdvanceTimerRef.current = null;
          console.log("Calling onComplete from useQuizNavigation");
          onComplete?.(updatedAnswers);
        }, 2000);
      }
      
      // Return updated state
      return {
        ...prev,
        submittedQuestionIds: newSubmittedIds,
        isAutoAdvancing,
        furthestViewedIndex: newFurthestViewedIndex
      };
    });
  }, [questions.length, onComplete, clearAutoAdvanceTimer]);
  
  // Navigation visibility rules - centralized in one place
  const shouldShowNextButton = useCallback(() => {
    // Rule 1: Never show on last question
    if (state.currentIndex === questions.length - 1) return false;
    
    // Rule 2: Only show when navigating backwards to review previously viewed questions
    if (state.currentIndex >= state.furthestViewedIndex) return false;
    
    // Rule 3: Don't show during auto-advancing
    if (state.isAutoAdvancing) return false;
    
    // Otherwise, show the button
    return true;
  }, [state.currentIndex, state.furthestViewedIndex, state.isAutoAdvancing, questions.length]);
  
  const isNextButtonEnabled = useCallback(() => {
    const currentQuestionId = questions[state.currentIndex]?.id;
    return currentQuestionId && state.submittedQuestionIds.has(currentQuestionId);
  }, [questions, state.currentIndex, state.submittedQuestionIds]);
  
  // Modify the isCurrentQuestionSubmitted computation to be more strict
  const isCurrentQuestionSubmitted = useCallback(() => {
    if (!questions[state.currentIndex]) return false;
    
    const currentQuestionId = questions[state.currentIndex].id;
    const isSubmitted = state.submittedQuestionIds.has(currentQuestionId);
    
    console.log(`Question ${currentQuestionId} submission status:`, isSubmitted);
    console.log('All submitted questions:', Array.from(state.submittedQuestionIds));
    
    return isSubmitted;
  }, [questions, state.currentIndex, state.submittedQuestionIds]);
  
  // At the start of the hook function
  console.log('Navigation hook state:', state);
  
  return {
    // Current state
    currentIndex: state.currentIndex,
    furthestViewedIndex: state.furthestViewedIndex,
    submittedQuestionIds: state.submittedQuestionIds,
    isAutoAdvancing: state.isAutoAdvancing,
    
    // Navigation functions
    goToNext,
    goToPrevious,
    markQuestionSubmitted,
    clearAutoAdvanceTimer,
    
    // Navigation visibility functions
    shouldShowNextButton,
    isNextButtonEnabled,
    
    // Helper properties
    isCurrentQuestionSubmitted: isCurrentQuestionSubmitted(),
    isFirstQuestion: state.currentIndex === 0,
    isLastQuestion: state.currentIndex === questions.length - 1,
    
    // Allow direct state updates (for more complex scenarios)
    setState
  };
} 