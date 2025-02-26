import { Question } from '../types';

interface QuizData {
  [key: string]: Array<{
    id: string;
    questions: Question[];
  }>;
}

/**
 * Loads all questions from all quiz files
 * @returns Promise<Question[]> Array of all available questions
 */
export const loadAllQuestions = async (): Promise<Question[]> => {
  const quizzes = await loadQuizzesWithTimeout();
  
  const allQuestions: Question[] = [];
  
  Object.entries(quizzes as QuizData).forEach(([subjectId, quizSeries]) => {
    quizSeries.forEach(quiz => {
      const questionsWithUniqueIds = quiz.questions.map(question => ({
        ...question,
        id: `${quiz.id}_${question.id}`,
        subjectId
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

// Simulates loading delay for development/testing
export const loadQuizzesWithTimeout = async (): Promise<QuizData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a properly structured mock quiz data
      resolve({
        'sample': [{
          id: 'sample-quiz',
          questions: [
            {
              id: '1',
              text: 'Sample Question',
              type: 'multipleChoice',
              subjectId: 'sample',
              topic: 'sample',
              difficulty: 'beginner',
              answers: [],
              comments: [],
              tags: [],
              notations: []
            }
          ]
        }]
      });
    }, 500);
  });
};

