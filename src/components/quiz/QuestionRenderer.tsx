import React from 'react';
import { Question, MultipleChoiceQuestion, SimpleChoiceQuestion } from '@/types';
import SimpleChoiceQuestionComponent from '../questions/SimpleChoiceQuestionComponent';
import MultipleChoiceQuestionComponent from '../questions/MultipleChoiceQuestionComponent';

interface QuestionRendererProps {
  question: Question;
  selectedAnswers: string[];
  onAnswerSelect: (answerId: string) => void;
  showExplanation: boolean;
  isSubmitted: boolean;
}

/**
 * Renders the appropriate question component based on question type.
 */
const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  selectedAnswers,
  onAnswerSelect,
  showExplanation,
  isSubmitted
}) => {
  // Type guard to check if the question is a MultipleChoiceQuestion
  const isMultipleChoiceQuestion = (q: Question): q is MultipleChoiceQuestion => {
    return q.type === 'multiple-choice';
  };

  if (question.type === 'simple-choice') {
    return (
      <SimpleChoiceQuestionComponent
        question={question as SimpleChoiceQuestion}
        selectedAnswer={selectedAnswers[0] || ''}
        onAnswerSelect={(answerId) => onAnswerSelect(answerId)}
        showExplanation={showExplanation}
        isSubmitted={isSubmitted}
      />
    );
  } else if (isMultipleChoiceQuestion(question)) {
    return (
      <MultipleChoiceQuestionComponent
        question={question}
        selectedAnswers={selectedAnswers}
        onAnswerSelect={(answerIds) => onAnswerSelect(answerIds)}
        showExplanation={showExplanation}
        isSubmitted={isSubmitted}
      />
    );
  }

  return null;
};

export default QuestionRenderer; 