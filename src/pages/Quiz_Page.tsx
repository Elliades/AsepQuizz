import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question } from '../types';
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
          ? 'multiple-Choice' as const 
          : 'simple-Choice' as const,
        topic: question.topic || "General", // Ensure topic is set
      }));
      
      setQuestions(processedQuestions);
    }
  }, [seriesId]);

  const handleQuizComplete = (score: number) => {
    navigate('/results', { 
      state: { 
        score,
        total: questions.length,
        timeSpent: Math.floor((new Date().getTime() - quizStartTime.getTime()) / 1000),
        questions
      }
    });
  };

  const renderResult = (score: number, totalQuestions: number) => (
    <>
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-xl">Your score: {score}/{totalQuestions}</p>
    </>
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