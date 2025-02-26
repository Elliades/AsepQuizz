import { Question } from '../types';

/**
 * Loads all questions from all quiz files
 * @returns Promise<Question[]> Array of all available questions
 */
export const loadAllQuestions = async (): Promise<Question[]> => {
  const quizzes = await loadQuizzesWithTimeout();
  
  const allQuestions: Question[] = [];
  
  Object.entries(quizzes).forEach(([subjectId, quizSeries]) => {
    quizSeries.forEach((quiz) => {
      // Add quiz identifier to each question ID
      const questionsWithUniqueIds = quiz.questions.map(question => ({
        ...question,
        id: `${quiz.id}_${question.id}` // Make IDs unique across quizzes
      }));
      
      allQuestions.push(...questionsWithUniqueIds);
    });
  });
  
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