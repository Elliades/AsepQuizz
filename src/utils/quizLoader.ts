import { Subject, QuizSeries, Chapter } from '../types';
import subjects from '../data/subjects/index.json';

// Dynamic imports for quiz files
const quizModules = import.meta.glob('../data/quizzes/**/*.json', { eager: true });

const loadQuizzes = (): Record<string, QuizSeries[]> => {
  console.log('Starting quiz loading...');
  console.log('Available quiz modules:', Object.keys(quizModules));
  console.log('Subjects from index:', subjects.subjects);

  const quizzesBySubject: Record<string, QuizSeries[]> = {};
  
  // Initialize arrays for each subject
  subjects.subjects.forEach(subject => {
    console.log(`Initializing subject: ${subject.id}`);
    quizzesBySubject[subject.id] = [];
  });

  // Load quiz data
  Object.values(quizModules).forEach((module: any) => {
    try {
      console.log('Processing module:', module);
      const quiz = module.default as QuizSeries;
      if (!quiz?.subjectId || !subjects.subjects.find(s => s.id === quiz.subjectId)) {
        console.warn(`Invalid subject ID in quiz: ${quiz?.id}. Valid subjects are: ${subjects.subjects.map(s => s.id).join(', ')}`);
        return;
      }
      if (quiz?.subjectId && quizzesBySubject[quiz.subjectId]) {
        quizzesBySubject[quiz.subjectId].push(quiz);
        console.log(`Added quiz to subject ${quiz.subjectId}`);
      } else {
        console.warn('Invalid quiz data:', quiz);
        console.warn('Available subjects:', Object.keys(quizzesBySubject));
      }
    } catch (error) {
      console.error('Error processing quiz module:', error);
    }
  });
  
  console.log('Final quizzes by subject:', quizzesBySubject);
  return quizzesBySubject;
};

// Add timeout handling to quiz loading
const QUIZ_LOAD_TIMEOUT = 5000; // 5 seconds

export const loadQuizzesWithTimeout = async (): Promise<Record<string, QuizSeries[]>> => {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Quiz loading timed out')), QUIZ_LOAD_TIMEOUT);
  });

  try {
    const result = await Promise.race([
      Promise.resolve(loadQuizzes()),
      timeoutPromise
    ]);
    return result as Record<string, QuizSeries[]>;
  } catch (error) {
    console.error('Quiz loading failed:', error);
    return {}; // Return empty object on timeout/error
  }
};

const quizzesBySubject = loadQuizzes();

// Add this temporarily to debug
console.log('Available subjects:', Object.keys(quizzesBySubject));

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