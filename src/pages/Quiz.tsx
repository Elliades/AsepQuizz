import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, UserAnswer } from '../types';
import { getQuizzesBySubject } from '../utils/quizLoader';
import QuizQuestion from '../components/QuizQuestion';
import ScoreTracker from '../components/ScoreTracker';

const QUESTIONS_PER_QUIZ = 10;

export default function Quiz() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizStartTime] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (seriesId === 'random') {
      // Get all questions from all quizzes
      const allQuizzes = Object.values(getQuizzesBySubject('se-fundamentals'))
        .concat(getQuizzesBySubject('iso-15288'));
      
      const allQuestions = allQuizzes.flatMap(quiz => quiz.questions);
      
      // Shuffle and take first QUESTIONS_PER_QUIZ questions
      const shuffledQuestions = allQuestions
        .sort(() => Math.random() - 0.5)
        .slice(0, QUESTIONS_PER_QUIZ);
      
      setQuestions(shuffledQuestions);
    }
  }, [seriesId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Math.floor((new Date().getTime() - quizStartTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStartTime]);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = userAnswers.find(
    answer => answer.questionId === currentQuestion?.id
  );

  const handleAnswerSelect = (answerId: string) => {
    if (currentAnswer) return; // Prevent changing answer

    const answer = currentQuestion.answers.find(a => a.id === answerId);
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answerId,
      isCorrect: answer?.isCorrect || false,
      timeSpent: Math.floor((new Date().getTime() - quizStartTime.getTime()) / 1000)
    };

    setUserAnswers([...userAnswers, newAnswer]);
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (userAnswers.length === questions.length) {
      // Quiz completed, calculate score
      const score = userAnswers.filter(answer => answer.isCorrect).length;
      navigate('/results', { 
        state: { 
          score,
          total: questions.length,
          answers: userAnswers,
          timeSpent: Math.floor((new Date().getTime() - quizStartTime.getTime()) / 1000),
          questions
        }
      });
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentQuestion) {
    return <div className="text-center">Loading quiz...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quick Quiz</h1>
        <div className="text-gray-400">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <ScoreTracker
        userAnswers={userAnswers}
        totalQuestions={questions.length}
        currentTime={currentTime}
      />

      <div className="mt-6">
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={currentAnswer?.answerId || null}
          onAnswerSelect={handleAnswerSelect as (answerId: string | string[] | null) => void}
          showExplanation={!!currentAnswer}
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="btn disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={goToNext}
          disabled={!currentAnswer}
          className="btn disabled:opacity-50"
        >
          {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
} 