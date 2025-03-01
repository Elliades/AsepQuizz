import { Subject, QuizSeries, Chapter, Question } from '@/types';
import subjects from '../data/subjects/index.json';
import path from 'path';
import fs from 'fs';

// Dynamic imports for quiz files
const quizModules = import.meta.glob('../data/quizzes/**/*.json', { eager: true });

const loadQuizzes = (): Record<string, QuizSeries[]> => {
  console.log('Starting quiz loading...');
  console.log('Available quiz modules:', Object.keys(quizModules));
  console.log('Subjects_Pages from index:', subjects.subjects);

  const quizzesBySubject: Record<string, QuizSeries[]> = {};
  
  // Initialize arrays for each subject
  subjects.subjects.forEach(subject => {
    console.log(`Initializing subject: ${subject.id}`);
    quizzesBySubject[subject.id] = [];
  });

  // Use a Set to track used question IDs
  const usedQuestionIds = new Set<string>();

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
        // Ensure question IDs are unique *across all quizzes*
        const uniqueQuestions: Question[] = quiz.questions.map(question => {
          let uniqueId = question.id;
          let counter = 1;
          // If ID already exists, generate a new unique ID
          while (usedQuestionIds.has(uniqueId)) {
            uniqueId = `${question.id}-${counter}`;
            counter++;
          }
          usedQuestionIds.add(uniqueId);
          return { ...question, id: uniqueId, topic: question.topic || "General" }; // Ensure topic is set
        });

        quizzesBySubject[quiz.subjectId].push({ ...quiz, questions: uniqueQuestions }); // Use unique questions
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
    setTimeout(() => reject(new Error('Quiz_Page loading timed out')), QUIZ_LOAD_TIMEOUT);
  });

  try {
    const result = await Promise.race([
      Promise.resolve(loadQuizzes()),
      timeoutPromise
    ]);
    return result as Record<string, QuizSeries[]>;
  } catch (error) {
    console.error('Quiz_Page loading failed:', error);
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

/**
 * Gets random questions from all quizzes
 * 
 * @param count Number of questions to fetch (default: 10)
 * @returns Array of random questions
 */
export function getRandomQuestions(count: number = 10): Question[] {
  try {
    // Get all quizzes from all subjects
    const allQuizzes = Object.values(quizzesBySubject).flat();
    
    // Extract all questions from all quizzes
    const allQuestions = allQuizzes.flatMap(quiz => quiz.questions);
    
    // Shuffle the questions (Fisher-Yates algorithm)
    const shuffledQuestions = [...allQuestions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    
    // Take the requested number of questions
    return shuffledQuestions.slice(0, Math.min(count, shuffledQuestions.length));
  } catch (error) {
    console.error('Error fetching random questions:', error);
    return [];
  }
}

/**
 * Gets detailed information about a subject from sources.json
 * @param subjectId Subject ID
 * @returns Detailed subject information or null if not found
 */
export const getSubjectDetails = (subjectId: string) => {
  try {
    const sourcesPath = path.join(__dirname, '../data/subjects/sources.json');
    const sourcesData = JSON.parse(fs.readFileSync(sourcesPath, 'utf8'));
    return sourcesData.sources.find(source => source.id === subjectId) || null;
  } catch (error) {
    console.error('Error loading subject details:', error);
    return null;
  }
}; 