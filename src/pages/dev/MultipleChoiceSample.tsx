import React from 'react';
import QuickQuiz from '../../components/quiz/QuickQuiz';
import sampleQuizData from '../../data/samples/OneMultipleChoiceQuestion-Quizz.json';
import { MultipleChoiceQuestion, QuizResult } from '../../types';

const MultipleChoiceSample = () => {
  // Transform the question to match required format
  const questions = sampleQuizData.questions.map(q => ({
    ...q,
    type: 'multiple-choice',
    subjectId: sampleQuizData.subjectId,
    comments: [],
    tags: [],
    notations: [],
    difficulty: q.difficulty as "beginner" | "intermediate" | "advanced"
  })) as MultipleChoiceQuestion[];

  const handleQuizComplete = (result: QuizResult) => {
    console.log(`Quiz completed with score: ${result.score}`);
  };

  const renderResult = (score: number, totalQuestions: number) => (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-xl mb-2">Your score: {score}/{totalQuestions}</p>
      <p className="text-lg">
        {score === totalQuestions 
          ? 'Perfect score! Great job!' 
          : score > totalQuestions / 2 
            ? 'Good work! Keep practicing to improve.' 
            : 'Keep studying and try again!'}
      </p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Multiple Choice Sample</h1>
      <QuickQuiz
        questions={questions}
        onComplete={handleQuizComplete}
        renderResult={renderResult}
      />
    </div>
  );
};

export default MultipleChoiceSample; 