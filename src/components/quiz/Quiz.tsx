import React, { useReducer, useEffect, useRef, useState } from 'react';
import { QuizSeries, UserAnswer, Question } from '../../types';
import { useNavigate } from 'react-router-dom';
import QuestionRenderer from './QuestionRenderer';
import NavigationControls from './NavigationControls';
import { useQuizNavigation } from '../../hooks/useQuizNavigation';

/**
 * Quiz component for displaying and managing quiz questions.
 * 
 * This component handles:
 * - Displaying questions one at a time
 * - Tracking user answers and scores
 * - Navigation between questions
 * - Auto-advancing after answering
 * - Showing explanations for answers
 */
const Quiz: React.FC<{
  quizSeries: QuizSeries;
  onComplete: (score: number, answers: UserAnswer[], timeSpent: number) => void;
}> = ({ quizSeries, onComplete }) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef(Date.now());
  
  // Local state 
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Use the centralized navigation hook
  const navigation = useQuizNavigation(
    quizSeries.questions, 
    () => {
      const endTime = Date.now();
      const timeSpent = (endTime - startTimeRef.current) / 1000;
      const score = userAnswers.filter(a => a.isCorrect).length;
      onComplete(score, userAnswers, timeSpent);
    }
  );
  
  // Safety check for quiz data
  if (!quizSeries || !quizSeries.questions || quizSeries.questions.length === 0) {
    return <div>No questions available</div>;
  }
  
  const currentQuestion = quizSeries.questions[navigation.currentIndex];
  
  /**
   * Handles answer selection for both simple and multiple choice questions.
   */
  const handleAnswerSelect = (answerId: string) => {
    if (navigation.isCurrentQuestionSubmitted) {
      return; // Don't allow changing answers for submitted questions
    }
    
    if (currentQuestion.type === 'multiple-choice') {
      // For multiple choice questions
      if (selectedAnswers.includes(answerId)) {
        // Remove if already selected
        setSelectedAnswers(prev => prev.filter(id => id !== answerId));
      } else {
        // Get the number of correct answers for this question
        const correctAnswersCount = currentQuestion.answers.filter(a => a.isCorrect).length;
        const newSelectedAnswers = [...selectedAnswers, answerId];
        setSelectedAnswers(newSelectedAnswers);
        
        // Auto-submit if the correct number of answers is selected
        if (newSelectedAnswers.length === correctAnswersCount) {
          handleSubmit(newSelectedAnswers);
        }
      }
    } else {
      // For simple choice questions
      setSelectedAnswers([answerId]);
      handleSubmit([answerId]);
    }
  };
  
  /**
   * Handles submitting an answer and advancing to the next question.
   */
  const handleSubmit = (answerIds: string[]) => {
    if (navigation.isCurrentQuestionSubmitted) return;
    
    const isCorrect = checkIfAnswersCorrect(currentQuestion, answerIds);
    
    // Create new user answer
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answerIds,
      isCorrect,
      timeSpent: (Date.now() - startTimeRef.current) / 1000
    };
    
    // Add to user answers
    setUserAnswers(prev => [...prev, newAnswer]);
    
    // Mark the question as submitted and auto-advance
    navigation.markQuestionSubmitted(currentQuestion.id, true);
    
    // Show explanation
    setShowExplanation(true);
    
    // Reset start time for next question
    startTimeRef.current = Date.now();
  };
  
  /**
   * Toggles the explanation visibility.
   */
  const toggleExplanation = () => {
    setShowExplanation(prev => !prev);
  };
  
  /**
   * Check if the selected answers are correct for the given question.
   */
  const checkIfAnswersCorrect = (question: Question, selectedIds: string[]): boolean => {
    if (question.type === 'multiple-choice') {
      const correctAnswerIds = question.answers.filter(a => a.isCorrect).map(a => a.id);
      return selectedIds.length === correctAnswerIds.length &&
        selectedIds.every(id => correctAnswerIds.includes(id));
    } else {
      // For simple choice questions
      return question.answers.find(a => a.id === selectedIds[0])?.isCorrect || false;
    }
  };
  
  /**
   * Calculates the total score from user answers.
   */
  const calculateScore = (answers: UserAnswer[]): number => {
    return answers.filter(a => a.isCorrect).length;
  };
  
  // Ensure we're properly resetting all state when navigating
  useEffect(() => {
    // Reset ALL question-related state when changing questions
    setSelectedAnswers([]);
    setShowExplanation(false);
    
    // Log for debugging
    console.log('Navigated to question', navigation.currentIndex);
    console.log('Question is submitted:', navigation.isCurrentQuestionSubmitted);
  }, [navigation.currentIndex]);
  
  return (
    <div className="max-w-3xl mx-auto p-4" ref={containerRef}>
      {/* Quiz Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">
            Question {navigation.currentIndex + 1} of {quizSeries.questions.length}
          </span>
          
          {navigation.isLastQuestion && navigation.isCurrentQuestionSubmitted && (
            <button
              onClick={() => {
                const endTime = Date.now();
                const timeSpent = (endTime - startTimeRef.current) / 1000;
                onComplete(calculateScore(userAnswers), userAnswers, timeSpent);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Finish Quiz
            </button>
          )}
        </div>
        
        {/* Progress Indicators */}
        <div className="flex justify-center mb-4">
          <div className="flex space-x-1">
            {quizSeries.questions.map((q, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === navigation.currentIndex
                    ? 'bg-primary'
                    : navigation.submittedQuestionIds.has(q.id)
                      ? 'bg-green-500'
                      : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question Display */}
      <QuestionRenderer
        question={currentQuestion}
        selectedAnswers={selectedAnswers}
        onAnswerSelect={handleAnswerSelect}
        showExplanation={showExplanation}
        isSubmitted={navigation.isCurrentQuestionSubmitted}
      />

      {/* Navigation Controls */}
      <NavigationControls
        onNext={navigation.goToNext}
        onPrevious={navigation.goToPrevious}
        showNext={navigation.shouldShowNextButton()}
        isNextEnabled={navigation.isCurrentQuestionSubmitted}
        isFirstQuestion={navigation.isFirstQuestion}
        isLastQuestion={navigation.isLastQuestion}
        containerRef={containerRef}
      />

      {/* Footer Controls */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          Exit Quiz
        </button>
        {navigation.isCurrentQuestionSubmitted && (
          <button
            onClick={toggleExplanation}
            className={`px-4 py-2 rounded-lg ${
              showExplanation
                ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                : 'bg-yellow-700 text-white hover:bg-yellow-600'
            }`}
          >
            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz; 