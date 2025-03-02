/**
 * Custom hook to fetch random questions from multiple quizzes
 * 
 * This hook retrieves a specified number of random questions from all available quizzes.
 * It ensures questions are unique and properly distributed across different topics and difficulty levels.
 */
import { useState, useEffect, useRef } from 'react';
import { Question } from '../types';
import { getRandomQuestions } from '../utils/quizLoader';

interface UseRandomQuestionsOptions {
  count?: number;          // Number of questions to fetch (default: 10)
  topics?: string[];       // Optional filter by topics
  difficulty?: string[];   // Optional filter by difficulty
  excludeIds?: string[];   // Question IDs to exclude
}

export function useRandomQuestions({
  count = 10,
  topics = [],
  difficulty = [],
  excludeIds = []
}: UseRandomQuestionsOptions = {}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use a ref to track if we've already loaded questions
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Only fetch questions once to prevent infinite loops
    if (hasLoaded.current) return;
    
    try {
      setLoading(true);
      
      // Get random questions directly
      let randomQuestions = getRandomQuestions(count);
      
      // Ensure questions are unique by ID
      const uniqueQuestions: Question[] = [];
      const seenIds = new Set<string>();
      
      for (const question of randomQuestions) {
        if (!seenIds.has(question.id)) {
          seenIds.add(question.id);
          uniqueQuestions.push(question);
          
          // Break if we have enough unique questions
          if (uniqueQuestions.length >= count) {
            break;
          }
        }
      }
      
      // Apply filters if provided
      let filteredQuestions = [...uniqueQuestions];
      
      if (topics.length > 0) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.topic && topics.includes(q.topic)
        );
      }
      
      if (difficulty.length > 0) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.difficulty && difficulty.includes(q.difficulty)
        );
      }
      
      // Exclude specific question IDs
      if (excludeIds.length > 0) {
        filteredQuestions = filteredQuestions.filter(q => !excludeIds.includes(q.id));
      }
      
      setQuestions(filteredQuestions);
      hasLoaded.current = true;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch random questions'));
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array to run only once

  return { questions, loading, error };
} 