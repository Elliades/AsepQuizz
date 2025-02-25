import { Subject, QuizSeries, Chapter } from '../types';
import subjects from '../data/subjects/index.json';

// Dynamic imports for quiz files
const quizModules = import.meta.glob('../data/quizzes/**/*.json', { eager: true });

const loadQuizzes = (): Record<string, QuizSeries[]> => {
  const quizzesBySubject: Record<string, QuizSeries[]> = {};
  
  Object.values(quizModules).forEach((module: any) => {
    const quiz = module.default as QuizSeries;
    if (!quizzesBySubject[quiz.subjectId]) {
      quizzesBySubject[quiz.subjectId] = [];
    }
    quizzesBySubject[quiz.subjectId].push(quiz);
  });
  
  return quizzesBySubject;
};

const quizzesBySubject = loadQuizzes();

export const getSubjects = (): Subject[] => {
  return subjects.subjects;
};

export const getChapters = (subjectId: string): Chapter[] => {
  const subject = subjects.subjects.find(s => s.id === subjectId);
  return subject?.chapters || [];
};

export const getQuizzesBySubject = (subjectId: string): QuizSeries[] => {
  return quizzesBySubject[subjectId] || [];
};

export const getQuizzesByChapter = (subjectId: string, chapterId: string): QuizSeries[] => {
  return getQuizzesBySubject(subjectId).filter(quiz => quiz.chapterId === chapterId);
};

export const getQuizById = (quizId: string): QuizSeries | null => {
  for (const subjectQuizzes of Object.values(quizzesBySubject)) {
    const quiz = subjectQuizzes.find(q => q.id === quizId);
    if (quiz) return quiz;
  }
  return null;
}; 