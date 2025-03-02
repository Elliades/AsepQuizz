/**
 * Random Quiz Page
 * 
 * This page displays a quiz with randomly selected questions from all available quizzes.
 * It allows users to test their knowledge across different topics and difficulty levels.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import QuickQuiz from '../components/quiz/QuickQuiz';
import { useRandomQuestions } from '../hooks/useRandomQuestions';

interface RandomQuizPageProps {
  questionCount?: number;
}

const RandomQuizPage: React.FC<RandomQuizPageProps> = ({ questionCount = 10 }) => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    topics: [] as string[],
    difficulty: [] as string[]
  });
  
  const { questions, loading, error } = useRandomQuestions({
    count: questionCount,
    topics: filters.topics,
    difficulty: filters.difficulty
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="p-6 bg-red-900/20 border border-red-500 rounded-lg">
          <h2 className="text-xl font-bold text-red-500 mb-2">Error Loading Questions</h2>
          <p>{error.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary rounded-lg"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  if (questions.length === 0) {
    return (
      <Layout>
        <div className="p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4">No Questions Available</h2>
          <p>
            There are no questions matching your criteria. Try adjusting your filters or come back later.
          </p>
          <button 
            onClick={() => navigate('/subjects')}
            className="mt-4 px-4 py-2 bg-primary rounded-lg"
          >
            Browse Subjects
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-6">Random Quiz</h1>
      <p className="mb-6 text-gray-400">
        This quiz contains {questions.length} randomly selected questions from various topics.
      </p>
      
      <QuickQuiz questions={questions} />
    </Layout>
  );
};

export default RandomQuizPage; 