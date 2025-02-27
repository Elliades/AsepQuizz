import React from 'react';
import { Question } from '../types';
import MultipleChoiceQuestionComponent from './questions/MultipleChoiceQuestionComponent';
import SimpleChoiceQuestionComponent from './questions/SimpleChoiceQuestionComponent';

interface QuizQuestionProps {
  question: Question;
  selectedAnswer: string | string[];
  onAnswerSelect: (answer: string | string[]) => void;
  showExplanation: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  showExplanation,
}) => {
  // Ensure selectedAnswer is properly formatted for multiple choice questions
  const formattedSelectedAnswer = 
    question.type === 'multipleChoice' && typeof selectedAnswer === 'string' && selectedAnswer
      ? selectedAnswer.split(',').filter(id => id.trim() !== '')
      : question.type === 'multipleChoice' && !Array.isArray(selectedAnswer)
      ? []
      : selectedAnswer;

  switch (question.type) {
    case 'multipleChoice':
      return (
        <MultipleChoiceQuestionComponent
          question={question}
          selectedAnswers={Array.isArray(formattedSelectedAnswer) ? formattedSelectedAnswer : []}
          onAnswerSelect={(answerIds) => onAnswerSelect(answerIds)}
          showExplanation={showExplanation}
        />
      );
    default:
      return (
        <SimpleChoiceQuestionComponent
          question={question}
          selectedAnswer={typeof formattedSelectedAnswer === 'string' ? formattedSelectedAnswer : null}
          onAnswerSelect={(answerId) => onAnswerSelect(answerId)}
          showExplanation={showExplanation}
        />
      );
  }
};

export default QuizQuestion; 