import React from 'react';
import { Question, MultipleChoiceQuestion } from '../types';
import MultipleChoiceQuestionComponent from './questions/MultipleChoiceQuestionComponent';
import SimpleChoiceQuestionComponent from './questions/SimpleChoiceQuestionComponent';

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: string | null | string[];
  onAnswerSelect: (answerId: string | null | string[]) => void;
  showExplanation: boolean;
}

export default function QuizQuestion({ 
  question,
  selectedAnswer,
  onAnswerSelect,
  showExplanation
}: QuizQuestionProps) {
  // Count correct answers to determine question type
  const correctAnswersCount = question.answers.filter(answer => answer.isCorrect).length;

  // If there's more than one correct answer, treat as multiple choice
  if (correctAnswersCount > 1) {
    return (
      <MultipleChoiceQuestionComponent
        question={question as MultipleChoiceQuestion}
        selectedAnswers={Array.isArray(selectedAnswer) ? selectedAnswer : []}
        onAnswerSelect={(answerIds) => onAnswerSelect(answerIds)}
        showExplanation={showExplanation}
      />
    );
  }

  // Otherwise, treat as simple choice
  return (
    <SimpleChoiceQuestionComponent
      question={question}
      selectedAnswer={selectedAnswer as string | null}
      onAnswerSelect={(answerId) => onAnswerSelect(answerId)}
      showExplanation={showExplanation}
    />
  );
} 