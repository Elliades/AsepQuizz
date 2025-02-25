import { Question } from '../types';

/**
 * Loads all questions from all quiz files
 * @returns Promise<Question[]> Array of all available questions
 */
export const loadAllQuestions = async (): Promise<Question[]> => {
  // Get all quiz files from the quizzes directory
  const quizModules = import.meta.glob('../data/quizzes/**/*.json');
  
  const allQuestions: Question[] = [];
  
  // Load and combine questions from all quiz files
  for (const path in quizModules) {
    const module = await quizModules[path]();
    if (module.questions && Array.isArray(module.questions)) {
      allQuestions.push(...module.questions);
    }
  }
  
  return allQuestions;
};

/**
 * Selects random questions from the question pool
 * @param questions Array of all available questions
 * @param count Number of questions to select
 * @returns Question[] Array of randomly selected questions
 */
export const selectRandomQuestions = (questions: Question[], count: number): Question[] => {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}; 