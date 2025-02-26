import React, { useState } from 'react';
import { Question, MultipleChoiceQuestion } from '../types';
import MultipleChoiceQuestionComponent from './questions/MultipleChoiceQuestionComponent';
import SimpleChoiceQuestionComponent from './questions/SimpleChoiceQuestionComponent';
import QuizQuestion from './QuizQuestion';

interface QuickQuizProps {
  questions: Question[];
  onComplete?: (score: number) => void;
  renderResult: (score: number, totalQuestions: number) => React.ReactNode;
}

const QuickQuiz: React.FC<QuickQuizProps> = ({ questions, onComplete, renderResult }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<(string|null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (questionIndex: number, answerId: string | null) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerId;
    setAnswers(newAnswers);
  };

  const handleMultipleChoiceAnswerSelect = (questionIndex: number, answerIds: string[]) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIds.join(',');
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers[currentQuestionIndex] === undefined || answers[currentQuestionIndex] === null) return;

    let currentScore = 0;
    if (currentQuestion.type === 'multipleChoice') {
      const selectedAnswerIds = (answers[currentQuestionIndex] || '').split(',');
      const correctAnswers = currentQuestion.answers
        .filter(answer => answer.isCorrect)
        .map(answer => answer.id);

      const isCorrect =
        selectedAnswerIds.length === correctAnswers.length &&
        selectedAnswerIds.every(id => correctAnswers.includes(id));

      if (isCorrect) {
        currentScore = 1;
      }
    }

    setScore(prevScore => prevScore + currentScore);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsComplete(true);
      onComplete?.(score);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    }
  };

  const renderQuestion = (question: Question, index: number) => {
    return (
      <QuizQuestion
        key={question.id}
        question={question}
        selectedAnswer={question.type === 'multipleChoice' 
          ? (answers[index] || '').split(',')
          : answers[index]}
        onAnswerSelect={(answer) => {
          if (Array.isArray(answer)) {
            handleMultipleChoiceAnswerSelect(index, answer);
          } else {
            handleAnswerSelect(index, answer);
          }
        }}
        showExplanation={showExplanation}
      />
    );
  };

  if (isComplete) {
    return (
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
        {renderResult(score, questions.length)}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">Question {currentQuestionIndex + 1}/{questions.length}</h2>
        <span className="text-gray-400">Score: {score}</span>
      </div>

      <div className="mb-6">
        {renderQuestion(currentQuestion, currentQuestionIndex)}
      </div>

      {showExplanation && (
        <div className="mb-4 p-4 bg-gray-700 rounded-lg">
          <h3 className="font-bold mb-2">Explanation:</h3>
          {currentQuestion.answers
            .filter(answer => answer.isCorrect)
            .map(answer => (
              <p key={answer.id}>{answer.explanation}</p>
            ))}
        </div>
      )}

      <div className="flex justify-end">
        {!showExplanation ? (
          <button
            onClick={handleSubmit}
            disabled={answers[currentQuestionIndex] === undefined || answers[currentQuestionIndex] === null}
            className="px-4 py-2 bg-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-green-600 rounded-lg"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuickQuiz; 