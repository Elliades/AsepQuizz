import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Question, MultipleChoiceQuestion, UserAnswer } from '../types';
import MultipleChoiceQuestionComponent from './questions/MultipleChoiceQuestionComponent';
import SimpleChoiceQuestionComponent from './questions/SimpleChoiceQuestionComponent';
import QuizQuestion from './QuizQuestion';

interface QuickQuizProps {
  questions: Question[];
  onComplete?: (score: number) => void;
  renderResult?: (score: number, totalQuestions: number) => React.ReactNode;
}

const QuickQuiz: React.FC<QuickQuizProps> = ({ questions, onComplete, renderResult }) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<(string|null)[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestionIndex]);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (questionIndex: number, answerId: string | null) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerId;
    setAnswers(newAnswers);
    
    // Auto submit for simple choice questions
    if (currentQuestion.type !== 'multipleChoice') {
      handleSubmit(newAnswers[questionIndex]);
    }
  };

  const handleMultipleChoiceAnswerSelect = (questionIndex: number, answerIds: string[]) => {
    // Make sure we're working with a clean array and filter out empty strings
    const cleanAnswerIds = Array.isArray(answerIds) 
      ? answerIds.filter(id => id.trim() !== '')
      : [];
    
    // Store the answer IDs as a comma-separated string
    const newAnswers = [...answers];
    newAnswers[questionIndex] = cleanAnswerIds.join(',');
    setAnswers(newAnswers);
    
    // Auto submit when correct number of answers are selected
    if (currentQuestion.type === 'multipleChoice') {
      const correctAnswersCount = currentQuestion.answers.filter(answer => answer.isCorrect).length;
      
      console.log('Selected answers:', cleanAnswerIds.length);
      console.log('Expected answers:', correctAnswersCount);
      console.log('Selected answer IDs:', cleanAnswerIds);
      
      // Only submit when the exact number of correct answers are selected
      if (cleanAnswerIds.length === correctAnswersCount) {
        handleSubmit(newAnswers[questionIndex]);
      }
    }
  };

  const handleSubmit = (answer: string | null) => {
    if (!answer) {
      console.warn("handleSubmit called with null answer"); // Debugging
      return;
    }

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    let currentScore = 0;
    let isCorrect = false;

    if (currentQuestion.type === 'multipleChoice') {
      const selectedAnswerIds = answer.split(',').filter(id => id.trim() !== '');
      const correctAnswers = currentQuestion.answers
        .filter(answer => answer.isCorrect)
        .map(answer => answer.id);

      isCorrect =
        selectedAnswerIds.length === correctAnswers.length &&
        selectedAnswerIds.every(id => correctAnswers.includes(id)) &&
        correctAnswers.every(id => selectedAnswerIds.includes(id));

      if (isCorrect) {
        currentScore = 1;
      }
    } else {
      isCorrect = currentQuestion.answers.find(a => a.id === answer)?.isCorrect || false;
      if (isCorrect) {
        currentScore = 1;
      }
    }

    // Data Integrity Check 3: Ensure isCorrect is a boolean
    if (typeof isCorrect !== 'boolean') {
      console.error("isCorrect is not a boolean!", isCorrect);
    }

    // Track user answer
    setUserAnswers(prev => [...prev, {
      questionId: currentQuestion.id,
      answerId: answer,
      isCorrect: isCorrect, // Ensure isCorrect is always set
      timeSpent
    }]);

    setScore(prevScore => prevScore + currentScore);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      // First collect all user answers
      const allUserAnswers = [...userAnswers];

      // Use the ORIGINAL question IDs, and ensure topic is always defined
      const questionsWithTopics = questions.map((q) => ({
        ...q,
        topic: q.topic || "General",
      }));

      // NO NEED to create new IDs.  Use the original question.id
      const updatedAnswers = allUserAnswers.map((answer) => ({
        ...answer,
        isCorrect: !!answer.isCorrect, // Ensure isCorrect is boolean
      }));

      // Data Integrity Check: Ensure questions and answers have the same length
      if (updatedAnswers.length !== questionsWithTopics.length) {
        console.error("Answer count doesn't match question count!", updatedAnswers.length, questionsWithTopics.length);
      }

      // Debug data - now using original IDs
      console.log("Questions:", questionsWithTopics);
      console.log("Answers:", updatedAnswers);

      // Navigate with correctly aligned data
      navigate('/results', {
        state: {
          score: updatedAnswers.filter(answer => answer.isCorrect).length,
          total: questionsWithTopics.length,
          answers: updatedAnswers,
          timeSpent: updatedAnswers.reduce((total, answer) => total + (answer.timeSpent || 0), 0),
          questions: questionsWithTopics, // Pass questions with original IDs
        },
      });
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
          : answers[index] || ''}
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
        {renderResult?.(score, questions.length)}
        
        <div className="mt-6">
          <button
            onClick={() => {
              setCurrentQuestionIndex(0);
              setScore(0);
              setIsComplete(false);
              setAnswers([]);
              setShowExplanation(false);
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
        {showExplanation && (
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