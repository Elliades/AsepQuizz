import React from 'react';
import { Question, MultipleChoiceQuestion, SimpleChoiceQuestion } from '@/types'; // Assuming these types are imported from your types file
import MultipleChoiceQuestionComponent from './MultipleChoiceQuestionComponent';
import SimpleChoiceQuestionComponent from './SimpleChoiceQuestionComponent';

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
  let formattedSelectedAnswer: string | string[] | null;

  // Type guards to check question type
  const isMultipleChoiceQuestion = (question: Question): question is MultipleChoiceQuestion => {
    return question.type === 'multiple-Choice';
  };

  const isSimpleChoiceQuestion = (question: Question): question is SimpleChoiceQuestion => {
    return question.type === 'simple-Choice';
  };

  // Handle multiple-choice question
  const buildMultipleChoiceQuestion = (): string[] => {
    if (typeof selectedAnswer === 'string' && selectedAnswer) {
      return selectedAnswer.split(',').filter(id => id.trim() !== '');
    } else if (!Array.isArray(selectedAnswer)) {
      return [];
    }
    return selectedAnswer;
  };

  // Handle simple-choice question
  const buildSimpleChoiceQuestion = (): string => {
    return typeof selectedAnswer === 'string' ? selectedAnswer : '';
  };

  // Function to render multiple-choice question component
  const renderMultipleChoiceQuestion = (formattedSelectedAnswer: string[]) => {
    return (
        <MultipleChoiceQuestionComponent
            question={question as MultipleChoiceQuestion} // Type assertion
            selectedAnswers={formattedSelectedAnswer}
            onAnswerSelect={(answerIds) => onAnswerSelect(answerIds)}
            showExplanation={showExplanation}
        />
    );
  };

  // Function to render simple-choice question component
  const renderSimpleChoiceQuestion = (formattedSelectedAnswer: string) => {
    return (
        <SimpleChoiceQuestionComponent
            question={question as SimpleChoiceQuestion} // Type assertion
            selectedAnswer={formattedSelectedAnswer}
            onAnswerSelect={(answerId: string | null) => onAnswerSelect(answerId || '')}
            showExplanation={showExplanation}
        />
    );
  };

  if (isMultipleChoiceQuestion(question)) {
    formattedSelectedAnswer = buildMultipleChoiceQuestion();
    return renderMultipleChoiceQuestion(formattedSelectedAnswer);
  } else if (isSimpleChoiceQuestion(question)) {
    formattedSelectedAnswer = buildSimpleChoiceQuestion();
    return renderSimpleChoiceQuestion(formattedSelectedAnswer);
  }

  return null; // Return null if the question type is not recognized
};

export default QuizQuestion;
