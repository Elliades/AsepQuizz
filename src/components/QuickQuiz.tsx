import React, { useState, useEffect } from 'react';
import { loadAllQuestions, selectRandomQuestions } from '../utils/quizUtils';
import { Question } from '../types';

const QuickQuiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        setLoading(true);
        const allQuestions = await loadAllQuestions();
        const selectedQuestions = selectRandomQuestions(allQuestions, 10);
        setQuestions(selectedQuestions);
      } catch (err) {
        setError('Failed to load quiz questions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initializeQuiz();
  }, []);

  if (loading) return <div>Loading quiz questions...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="quick-quiz">
      {questions.map((question, index) => (
        <div key={question.id} className="question-container">
          <h3>Question {index + 1}</h3>
          <p>{question.text}</p>
          {/* Rest of your question rendering logic */}
        </div>
      ))}
    </div>
  );
};

export default QuickQuiz; 