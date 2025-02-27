import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question } from '../types';
import { getQuizzesBySubject } from '../utils/quizLoader';
import QuickQuiz from '../components/QuickQuiz';

const QUESTIONS_PER_QUIZ = 10;

export default function Quiz() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [quizStartTime] = useState<Date>(new Date());

  useEffect(() => {
    if (seriesId === 'random') {
      const allQuizzes = Object.values(getQuizzesBySubject('se-fundamentals'))
        .concat(getQuizzesBySubject('iso-15288'));
      
      const allQuestions = allQuizzes.flatMap(quiz => quiz.questions);
      
      const shuffledQuestions = allQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, QUESTIONS_PER_QUIZ)
        .map(question => ({
          ...question,
          type: question.answers.filter(a => a.isCorrect).length > 1 
            ? 'multipleChoice' as const 
            : 'simpleChoice' as const
        }));
      
      setQuestions(shuffledQuestions);
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