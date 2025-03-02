import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, QuizResult } from '../types';
import { getQuizzesBySubject, getRandomQuestions } from '../utils/quizLoader';
import QuickQuiz from '../components/quiz/QuickQuiz';

const QUESTIONS_PER_QUIZ = 10;

export default function Quiz_Page() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizStartTime] = useState<Date>(new Date());

  useEffect(() => {
    if (seriesId === 'random') {
      // Use the getRandomQuestions function directly
      const randomQuestions = getRandomQuestions(QUESTIONS_PER_QUIZ);
      
      // Ensure all questions have the correct type
      const processedQuestions = randomQuestions.map(question => ({
        ...question,
        type: question.answers.filter(a => a.isCorrect).length > 1 
          ? 'multiple-choice' as const 
          : 'simple-choice' as const,
        topic: question.topic || "General", // Ensure topic is set
      }));
      
      setQuestions(processedQuestions);
    }
  }, [seriesId]);

  const handleQuizComplete = (result: QuizResult) => {
    navigate('/results', { 
      state: { 
        score: result.score,
        total: questions.length,
        timeSpent: result.timeSpent,
        questions,
        userAnswers: result.userAnswers
      }
    });
  };

  const renderResult = (score: number, totalQuestions: number) => (
    <div className="text-center p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-xl mb-4">Your score: {score}/{totalQuestions}</p>
      <p className="text-lg">
        {score === totalQuestions 
          ? 'Perfect score! Great job!' 
          : score > totalQuestions / 2 
            ? 'Good work! Keep practicing to improve.' 
            : 'Keep studying and try again!'}
      </p>
    </div>
  );

  if (!questions.length) {
    return <div className="text-center">Loading quiz...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quick Quiz</h1>
      </div>

      <QuickQuiz
        questions={questions}
        onComplete={handleQuizComplete}
        renderResult={renderResult}
      />
    </div>
  );
} 