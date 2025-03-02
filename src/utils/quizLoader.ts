import { Subject, QuizSeries, Chapter, Question } from '@/types';
import subjects from '../data/subjects/index.json';
import path from 'path';
import fs from 'fs';
import sourcesUtils from './sourcesUtilsBrowser';
import topicUtils from './topicUtilsBrowser';
import quizTopicMapper from './quizTopicMapper';
import subjectMapper from './subjectMapper';

// Dynamic imports for quiz files
const quizModules = import.meta.glob('../data/quizzes/**/*.json', { eager: true });

const loadQuizzes = (): Record<string, QuizSeries[]> => {
  console.log('Starting quiz loading...');
  console.log('Available quiz modules:', Object.keys(quizModules));
  console.log('Subjects from index:', subjects.subjects);
  console.log('Valid subject IDs:', subjectMapper.getAllSubjectIds());

  const quizzesBySubject: Record<string, QuizSeries[]> = {};
  
  // Initialize arrays for all valid subject IDs
  subjectMapper.getAllSubjectIds().forEach(subjectId => {
    console.log(`Initializing subject: ${subjectId}`);
    quizzesBySubject[subjectId] = [];
  });

  // Use a Set to track used question IDs
  const usedQuestionIds = new Set<string>();

  // Load quiz data
  Object.values(quizModules).forEach((module: any) => {
    try {
      console.log('Processing module:', module);
      const quiz = module.default as QuizSeries;
      
      if (!quiz?.subjectId) {
        console.warn(`Quiz is missing a subject ID: ${quiz?.id}`);
        return;
      }
      
      // Try to register the subject ID if it's not already valid
      if (!subjectMapper.isValidSubjectId(quiz.subjectId)) {
        console.warn(`Unrecognized subject ID in quiz: ${quiz?.id}. Subject ID: ${quiz.subjectId}`);
        console.warn(`Attempting to register as a new subject ID...`);
        
        // Register the new subject ID with a default mapping to INCOSE_SEHB5
        subjectMapper.registerSubjectId(quiz.subjectId);
        
        // Initialize an array for this subject ID if it doesn't exist
        if (!quizzesBySubject[quiz.subjectId]) {
          console.log(`Initializing newly registered subject: ${quiz.subjectId}`);
          quizzesBySubject[quiz.subjectId] = [];
        }
      }
      
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
        
        // Map the question's chapter/topic to a standardized topic from the index
        const standardizedTopic = quizTopicMapper.findTopicForQuestion(question);
        
        return { 
          ...question, 
          id: uniqueId, 
          topic: standardizedTopic 
        };
      });

      quizzesBySubject[quiz.subjectId].push({ ...quiz, questions: uniqueQuestions });
      console.log(`Added quiz to subject ${quiz.subjectId}`);
      
      // If this quiz subject maps to an index subject, also add it there
      const standardizedSubjectId = subjectMapper.getStandardizedSubjectId(quiz.subjectId);
      if (standardizedSubjectId !== quiz.subjectId) {
        quizzesBySubject[standardizedSubjectId].push({ ...quiz, questions: uniqueQuestions });
        console.log(`Also added quiz to standardized subject ${standardizedSubjectId}`);
      }
    } catch (error) {
      console.error('Error processing quiz module:', error);
    }
  });
  
  console.log('Final quizzes by subject:', Object.keys(quizzesBySubject));
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
  return sourcesUtils.getSourceById(subjectId);
};

// Add this function to get quizzes by topic
export const getQuizzesByTopic = (topicName: string): QuizSeries[] => {
  const allQuizzes = Object.values(quizzesBySubject).flat();
  
  // Filter quizzes that have questions with the specified topic
  return allQuizzes.filter(quiz => 
    quiz.questions.some(question => question.topic === topicName)
  );
};

// Add this function to get questions by topic
export const getQuestionsByTopic = (topicName: string): Question[] => {
  const allQuizzes = Object.values(quizzesBySubject).flat();
  
  // Extract all questions with the specified topic
  return allQuizzes.flatMap(quiz => 
    quiz.questions.filter(question => question.topic === topicName)
  );
};

// Add this function to get related questions for a topic
export const getRelatedQuestions = (topicName: string): Question[] => {
  // Get related topics
  const relatedTopics = topicUtils.getRelatedTopics(topicName);
  const relatedTopicNames = relatedTopics.map(topic => topic.name);
  
  // Get questions for all related topics
  const allQuizzes = Object.values(quizzesBySubject).flat();
  return allQuizzes.flatMap(quiz => 
    quiz.questions.filter(question => 
      relatedTopicNames.includes(question.topic)
    )
  );
}; 