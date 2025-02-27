import React, { useState, useEffect } from 'react';
import { QuizSeries, UserAnswer, Question } from '../../types';

interface QuizProps {
  quizSeries: QuizSeries;
  onComplete: (score: number, answers: UserAnswer[], timeSpent: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ quizSeries, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [startTime] = useState(Date.now());

  // Safety check for quiz data
  if (!quizSeries || !quizSeries.questions || quizSeries.questions.length === 0) {
    return <div>No questions available</div>;
  }

  const currentQuestion = quizSeries.questions[currentQuestionIndex];

  const handleAnswerSelect = (answerId: string) => {
    if (currentQuestion.type === 'multiple-Choice') {
      // For multiple choice questions
      if (selectedAnswers.includes(answerId)) {
        // Remove if already selected
        setSelectedAnswers(prev => prev.filter(id => id !== answerId));
      } else if (selectedAnswers.length < 3) {
        // Add if less than 3 selected
        const newSelected = [...selectedAnswers, answerId];
        setSelectedAnswers(newSelected);
        
        // Auto-submit if 3 answers are selected
        if (newSelected.length === 3) {
          handleSubmit(newSelected);
        }
      }
    } else {
      // For simple-choice questions
      setSelectedAnswers([answerId]);
      handleSubmit([answerId]);
    }
  };

  const handleSubmit = (answers: string[]) => {
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answerIds: answers,
      isCorrect: checkIfCorrect(currentQuestion, answers),
      timeSpent: (Date.now() - startTime) / 1000,
    };

    setUserAnswers(prev => [...prev, newAnswer]);
    setSelectedAnswers([]);

    if (currentQuestionIndex < quizSeries.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      const endTime = Date.now();
      const timeSpent = (endTime - startTime) / 1000; // Convert milliseconds to seconds
      onComplete(calculateScore(userAnswers), userAnswers, timeSpent);
    }
  };

  const checkIfCorrect = (question: Question, selectedIds: string[]): boolean => {
    if (question.type === 'multiple-Choice') {
      // All selected answers must be correct and must have selected all correct answers
      const correctAnswerIds = question.answers
        .filter(a => a.isCorrect)
        .map(a => a.id);
      
      return selectedIds.length === correctAnswerIds.length &&
        selectedIds.every(id => correctAnswerIds.includes(id));
    } else {
      // For simple-choice, just check if the selected answer is correct
      return question.answers.find(a => a.id === selectedIds[0])?.isCorrect || false;
    }
  };

  const calculateScore = (answers: UserAnswer[]): number => {
    // Implement your scoring logic here
    return answers.filter(a => a.isCorrect).length;
  };

  return (
    <div className="quiz-container">
      <div className="question">
        <h3>{currentQuestion.text}</h3>
        <div className="answers-grid">
          {currentQuestion.answers.map(answer => (
            <button
              key={answer.id}
              onClick={() => handleAnswerSelect(answer.id)}
              className={`answer-button ${
                selectedAnswers.includes(answer.id) ? 'selected' : ''
              }`}
              disabled={
                currentQuestion.type === 'multiple-Choice' &&
                selectedAnswers.length >= 3 &&
                !selectedAnswers.includes(answer.id)
              }
            >
              {answer.text}
            </button>
          ))}
        </div>
        {currentQuestion.type === 'multiple-Choice' && (
          <div className="text-sm text-gray-400">
            Select up to 3 answers ({selectedAnswers.length}/3)
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz; 