import React from 'react';
import QuickQuiz from '../../components/quiz/QuickQuiz';
import sampleQuizData from '../../data/samples/OneSimpleChoiceQuestion-Quizz.json';
import { SimpleChoiceQuestion } from '../../types';

const SimpleChoiceSample = () => {
  // Transform the question to match required format
  const question: SimpleChoiceQuestion = {
    ...sampleQuizData.questions[0],
    type: 'simpleChoice',
    subjectId: sampleQuizData.subjectId,
    comments: [],
    tags: [],
    notations: [],
    difficulty: sampleQuizData.questions[0].difficulty as "beginner" | "intermediate" | "advanced"
  };

  const handleQuizComplete = (score: number) => {
    console.log(`Quiz completed with score: ${score}`);
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