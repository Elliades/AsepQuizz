import React from 'react';
import { Question } from '@/types';

interface QuestionLayoutProps {
  question: Question;
  children: React.ReactNode;
}

const QuestionLayout: React.FC<QuestionLayoutProps> = ({ question, children }) => {
  return (
    <div className="space-y-6">
      <div className="card relative">
        {/* Question Header */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold flex items-start gap-2">
            {question.important && (
              <span className="text-yellow-500 font-bold" title="Important Question">!</span>
            )}
            {question.text}
          </h2>
          
          {/* Tags */}
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {question.tags.map((tag, index) => (
                <span
                  key={`${tag.type}-${index}`}
                  className="px-2 py-0.5 text-xs bg-gray-700/50 text-gray-400 rounded-full"
                >
                  {tag.type}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Answers */}
        <div className="space-y-3 mb-8">
          {children}
        </div>

        {/* Footer with Source and Source Question */}
        <div className="absolute bottom-4 right-4 text-xs">
          {question.source && (
            <span className="text-gray-400">
              Source: {question.source}
              {question.sourceQuestion && (
                <span className="text-gray-500 ml-1">
                  - by: {question.sourceQuestion}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionLayout; 