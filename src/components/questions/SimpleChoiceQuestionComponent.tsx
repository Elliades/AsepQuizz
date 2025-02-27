import React from 'react';
import { Question } from '../../types';
import QuestionLayout from './QuestionLayout';

interface SimpleChoiceQuestionProps {
    question: Question;
    selectedAnswer: string | null;
    onAnswerSelect: (answerId: string | null) => void;
    showExplanation: boolean;
}

const SimpleChoiceQuestionComponent: React.FC<SimpleChoiceQuestionProps> = ({ question, selectedAnswer, onAnswerSelect, showExplanation }) => {
    return (
        <QuestionLayout question={question}>
            {question.answers.map(answer => (
                <button
                    key={answer.id}
                    onClick={() => onAnswerSelect(answer.id)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${selectedAnswer === answer.id
                        ? answer.isCorrect && showExplanation
                            ? 'bg-green-500/20 border-green-500'
                            : !answer.isCorrect && showExplanation
                                ? 'bg-red-500/20 border-red-500'
                                : 'bg-primary/20 border-primary'
                        : 'bg-gray-800 hover:bg-gray-700'
                        } border`}
                >
                    {answer.text}
                    {showExplanation && selectedAnswer === answer.id && (
                        <p className="mt-2 text-sm text-gray-400">{answer.explanation}</p>
                    )}
                </button>
            ))}
        </QuestionLayout>
    )
};

export default SimpleChoiceQuestionComponent; 