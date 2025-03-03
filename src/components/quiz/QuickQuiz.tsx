import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, UserAnswer, MultipleChoiceQuestion, QuizResult } from '@/types';
import SwipeableNavigation from '../navigation/SwipeableNavigation';
import AnswerFeedback from '../feedback/AnswerFeedback';
import SimpleChoiceQuestionComponent from '../questions/SimpleChoiceQuestionComponent';
import MultipleChoiceQuestionComponent from '../questions/MultipleChoiceQuestionComponent';
import { useQuizNavigation } from '../../hooks/useQuizNavigation';

interface QuickQuizProps {
  questions: Question[];
  onComplete: (result: QuizResult) => void;
  renderResult?: (score: number, totalQuestions: number) => React.ReactNode;
}

/**
 * QuickQuiz component for a simplified quiz experience.
 * It tracks submitted questions and prevents changing answers after submission.
 * 
 * @param questions - Array of questions for the quiz
 * @param onComplete - Callback function when the quiz is completed
 * @param renderResult - Optional function to render custom result UI
 */
const QuickQuiz: React.FC<QuickQuizProps> = ({ questions, onComplete, renderResult }) => {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const quizContainerRef = useRef<HTMLDivElement>(null);
  
  // Modify the useQuizNavigation hook to accept the new onComplete
  const navigation = useQuizNavigation(questions, (updatedAnswers: UserAnswer[]) => {
      const endTime = Date.now();
      const timeSpent = (endTime - startTime) / 1000;
      const finalScore = updatedAnswers.filter(a => a.isCorrect).length; // Calculate score here

      const result: QuizResult = {
          score: finalScore,
          totalQuestions: questions.length,
          userAnswers: updatedAnswers, // Use the passed-in answers
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          timeSpent
      };
      onComplete(result); // Call the onComplete prop with the complete result
  });

  // Reset the start time when the component mounts
  useEffect(() => {
    const now = Date.now();
    setStartTime(now);
  }, []);

  // Safety check for quiz data
  if (!questions || questions.length === 0) {
    return <div>No questions available</div>;
  }

  const currentQuestion = questions[navigation.currentIndex];
  
  // First, let's implement a checkIfCorrect function since it's missing
  const checkIfCorrect = (question: Question, selectedAnswers: string[]): boolean => {
    if (question.type === 'multiple-choice') {
      const correctAnswerIds = question.answers
        .filter(a => a.isCorrect)
        .map(a => a.id);
      
      return selectedAnswers.length === correctAnswerIds.length &&
        selectedAnswers.every(id => correctAnswerIds.includes(id));
    } else {
      // For simple-choice
      return question.answers.find(a => a.id === selectedAnswers[0])?.isCorrect || false;
    }
  };

  // Update handleSimpleChoiceAnswer to use our new navigation hook
  const handleSimpleChoiceAnswer = (questionId: string, answerId: string | null) => {
    if (navigation.isCurrentQuestionSubmitted) {
      // Don't allow changing answers for submitted questions
      return;
    }
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId || '' // Convert null to empty string
    }));
    
    // Mark the question as submitted when an answer is selected
    if (answerId !== null) {
      // Call handleSubmit with the selected answer
      handleSubmit([answerId]);
    }
  };

  // Update handleMultipleChoiceAnswer to use our new navigation hook
  const handleMultipleChoiceAnswer = (questionId: string, answerIds: string[]) => {
    if (navigation.isCurrentQuestionSubmitted) {
      // Don't allow changing answers for submitted questions
      return;
    }
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIds
    }));
    
    // For multiple choice, we need to check if the correct number of answers is selected
    const question = questions.find(q => q.id === questionId) as MultipleChoiceQuestion;
    if (!question) return;
    
    const correctAnswersCount = question.answers.filter(a => a.isCorrect).length;
    
    // Mark as submitted only if the correct number of answers is selected
    if (answerIds.length === correctAnswersCount) {
      // Call handleSubmit with the selected answers
      handleSubmit(answerIds);
    }
  };

  const handleSubmit = (selectedAnswers: string[]) => {
    if (navigation.isCurrentQuestionSubmitted) return;

    const isCorrect = checkIfCorrect(currentQuestion, selectedAnswers);
    const newScore = isCorrect ? score + 1 : score; // Calculate new score
    setScore(newScore); // Update the score immediately

    // Create new user answer
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answerIds: selectedAnswers,
      isCorrect,
      timeSpent: (Date.now() - startTime) / 1000,
    };

    // Construct the *new* userAnswers array
    const updatedAnswers = [...userAnswers, newAnswer];
    setUserAnswers(updatedAnswers); // Update local state

    // Pass the *updated* answers to markQuestionSubmitted
    navigation.markQuestionSubmitted(currentQuestion.id, updatedAnswers, true);
    
    // Show explanation
    setShowExplanation(true);
  };
  
  if (isComplete) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        {renderResult?.(score, questions.length)}
        
        <div className="mt-6">
          <button
            onClick={() => {
              navigation.setState({
                currentIndex: 0,
                furthestViewedIndex: 0,
                submittedQuestionIds: new Set(),
                isAutoAdvancing: false
              });
              setScore(0);
              setIsComplete(false);
              setAnswers({});
              setShowExplanation(false);
              setUserAnswers([]);
            }}
            className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/80"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={quizContainerRef} className="relative p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Question {navigation.currentIndex + 1}/{questions.length}</h2>
        <span className="text-gray-400">Score: {score}</span>
      </div>

      <div className="mb-6">
        {currentQuestion.type === 'simple-choice' ? (
          <SimpleChoiceQuestionComponent
            question={currentQuestion}
            selectedAnswer={answers[currentQuestion.id] as string | null}
            onAnswerSelect={(answerId) => handleSimpleChoiceAnswer(currentQuestion.id, answerId)}
            showExplanation={showExplanation || navigation.isCurrentQuestionSubmitted}
            isSubmitted={navigation.isCurrentQuestionSubmitted}
          />
        ) : (
          <MultipleChoiceQuestionComponent
            question={currentQuestion as MultipleChoiceQuestion}
            selectedAnswers={(answers[currentQuestion.id] as string[]) || []}
            onAnswerSelect={(answerIds) => handleMultipleChoiceAnswer(currentQuestion.id, answerIds)}
            showExplanation={showExplanation || navigation.isCurrentQuestionSubmitted}
            isSubmitted={navigation.isCurrentQuestionSubmitted}
          />
        )}
      </div>

      {showExplanation && currentQuestion && (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="font-bold mb-2">Explanation:</h3>
          {currentQuestion.answers
            .filter(answer => answer.isCorrect)
            .map(answer => (
              <p key={answer.id}>{answer.explanation}</p>
            ))}
        </div>
      )}

      <SwipeableNavigation
        onNext={navigation.goToNext}
        onPrevious={navigation.goToPrevious}
        showNext={navigation.shouldShowNextButton()}
        isNextEnabled={true}
        isLastQuestion={navigation.isLastQuestion}
        isFirstQuestion={navigation.isFirstQuestion}
        containerRef={quizContainerRef}
      />
    </div>
  );
};

export default QuickQuiz; 