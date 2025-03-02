import React from 'react';
import QuickQuiz from '../../components/quiz/QuickQuiz';
import sampleQuizData from '../../data/samples/OneSimpleChoiceQuestion-Quizz.json';
import { SimpleChoiceQuestion, QuizResult } from '../../types';

const SimpleChoiceSample = () => {
  // Transform the question to match required format
  const question: SimpleChoiceQuestion = {
    ...sampleQuizData.questions[0],
    type: 'simple-choice',
    subjectId: sampleQuizData.subjectId,
    comments: [],
    tags: [],
    notations: [],
    difficulty: sampleQuizData.questions[0].difficulty as "beginner" | "intermediate" | "advanced"
  };

  const handleQuizComplete = (result: QuizResult) => {
    console.log(`Quiz completed with score: ${result.score}`);
  };

  const renderResult = (score: number, totalQuestions: number) => (
    <>
      <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
      <p className="text-xl">Your score: {score}/{totalQuestions}</p>
    </>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Simple Choice Sample</h1>
      <QuickQuiz
        questions={[question]}
        onComplete={handleQuizComplete}
        renderResult={renderResult}
      />
    </div>
  );
};

export default SimpleChoiceSample; 