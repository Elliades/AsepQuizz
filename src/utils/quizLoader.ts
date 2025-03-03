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

/**
 * Get all available subjects
 * @returns Promise<Subject[]> Array of all subjects
 */
export const getAllSubjects = async (): Promise<Subject[]> => {
  // This would normally fetch from an API
  // For now, we'll return mock data
  return [
    {
      id: 'any',
      name: 'Any Subject',
      description: 'Topics from all subjects',
      topicCount: 30, // This will be the sum of all topics
      icon: 'all'
    },
    {
      id: 'systems-thinking',
      name: 'Systems Thinking',
      description: 'Understanding systems concepts and thinking holistically',
      topicCount: 5,
      icon: 'diagram'
    },
    {
      id: 'lifecycle-processes',
      name: 'Lifecycle Processes',
      description: 'Understanding the various stages of system development',
      topicCount: 8,
      icon: 'cycle'
    },
    {
      id: 'technical-processes',
      name: 'Technical Processes',
      description: 'Core technical activities in systems engineering',
      topicCount: 12,
      icon: 'tools'
    },
    {
      id: 'management-processes',
      name: 'Management Processes',
      description: 'Planning, assessment, and control of systems engineering',
      topicCount: 7,
      icon: 'chart'
    },
    {
      id: 'agreement-processes',
      name: 'Agreement Processes',
      description: 'Acquisition and supply processes',
      topicCount: 3,
      icon: 'handshake'
    },
    {
      id: 'organizational-processes',
      name: 'Organizational Processes',
      description: 'Infrastructure, portfolio, and human resource management',
      topicCount: 6,
      icon: 'organization'
    }
  ];
};

/**
 * Get topics for a specific subject
 * @param subjectId ID of the subject to get topics for
 * @returns Promise<Topic[]> Array of topics for the subject
 */
export const getTopicsBySubject = async (subjectId: string): Promise<Topic[]> => {
  // Special case for "any" subject - return all topics from all subjects
  if (subjectId === 'any') {
    // Get all subjects except "any"
    const subjects = await getAllSubjects();
    const regularSubjects = subjects.filter(s => s.id !== 'any');
    
    // Fetch topics for each subject and combine them
    const allTopicsPromises = regularSubjects.map(subject => 
      getTopicsBySubject(subject.id)
    );
    
    const allTopicsArrays = await Promise.all(allTopicsPromises);
    return allTopicsArrays.flat();
  }
  
  // For regular subjects, return the topics as before
  const topicsBySubject: Record<string, Topic[]> = {
    'systems-thinking': [
      {
        id: 'st-concepts',
        name: 'Systems Concepts',
        subjectId: 'systems-thinking',
        questionCount: 15,
        difficulty: 'beginner'
      },
      {
        id: 'st-emergence',
        name: 'Emergence and Complexity',
        subjectId: 'systems-thinking',
        questionCount: 12,
        difficulty: 'intermediate'
      },
      {
        id: 'st-modeling',
        name: 'Systems Modeling',
        subjectId: 'systems-thinking',
        questionCount: 18,
        difficulty: 'advanced'
      },
      {
        id: 'st-boundaries',
        name: 'System Boundaries',
        subjectId: 'systems-thinking',
        questionCount: 10,
        difficulty: 'beginner'
      },
      {
        id: 'st-holistic',
        name: 'Holistic Thinking',
        subjectId: 'systems-thinking',
        questionCount: 8,
        difficulty: 'intermediate'
      }
    ],
    'lifecycle-processes': [
      {
        id: 'lc-concept',
        name: 'Concept Stage',
        subjectId: 'lifecycle-processes',
        questionCount: 14,
        difficulty: 'beginner'
      },
      {
        id: 'lc-development',
        name: 'Development Stage',
        subjectId: 'lifecycle-processes',
        questionCount: 20,
        difficulty: 'intermediate'
      },
      {
        id: 'lc-production',
        name: 'Production Stage',
        subjectId: 'lifecycle-processes',
        questionCount: 16,
        difficulty: 'intermediate'
      },
      {
        id: 'lc-utilization',
        name: 'Utilization Stage',
        subjectId: 'lifecycle-processes',
        questionCount: 12,
        difficulty: 'beginner'
      },
      {
        id: 'lc-support',
        name: 'Support Stage',
        subjectId: 'lifecycle-processes',
        questionCount: 10,
        difficulty: 'intermediate'
      },
      {
        id: 'lc-retirement',
        name: 'Retirement Stage',
        subjectId: 'lifecycle-processes',
        questionCount: 8,
        difficulty: 'beginner'
      },
      {
        id: 'lc-models',
        name: 'Lifecycle Models',
        subjectId: 'lifecycle-processes',
        questionCount: 15,
        difficulty: 'advanced'
      },
      {
        id: 'lc-tailoring',
        name: 'Lifecycle Tailoring',
        subjectId: 'lifecycle-processes',
        questionCount: 10,
        difficulty: 'advanced'
      }
    ],
    'technical-processes': [
      {
        id: 'tp-stakeholder',
        name: 'Stakeholder Requirements',
        subjectId: 'technical-processes',
        questionCount: 18,
        difficulty: 'beginner'
      },
      {
        id: 'tp-requirements',
        name: 'Requirements Analysis',
        subjectId: 'technical-processes',
        questionCount: 25,
        difficulty: 'intermediate'
      },
      {
        id: 'tp-architecture',
        name: 'Architectural Design',
        subjectId: 'technical-processes',
        questionCount: 22,
        difficulty: 'advanced'
      },
      // Add more topics as needed
    ],
    'management-processes': [
      {
        id: 'mp-planning',
        name: 'Project Planning',
        subjectId: 'management-processes',
        questionCount: 20,
        difficulty: 'intermediate'
      },
      {
        id: 'mp-assessment',
        name: 'Project Assessment',
        subjectId: 'management-processes',
        questionCount: 15,
        difficulty: 'intermediate'
      },
      {
        id: 'mp-control',
        name: 'Project Control',
        subjectId: 'management-processes',
        questionCount: 18,
        difficulty: 'advanced'
      },
      {
        id: 'mp-decision',
        name: 'Decision Management',
        subjectId: 'management-processes',
        questionCount: 12,
        difficulty: 'advanced'
      },
      {
        id: 'mp-risk',
        name: 'Risk Management',
        subjectId: 'management-processes',
        questionCount: 22,
        difficulty: 'intermediate'
      },
      {
        id: 'mp-configuration',
        name: 'Configuration Management',
        subjectId: 'management-processes',
        questionCount: 16,
        difficulty: 'beginner'
      },
      {
        id: 'mp-information',
        name: 'Information Management',
        subjectId: 'management-processes',
        questionCount: 14,
        difficulty: 'beginner'
      }
    ],
    'agreement-processes': [
      {
        id: 'ap-acquisition',
        name: 'Acquisition Process',
        subjectId: 'agreement-processes',
        questionCount: 14,
        difficulty: 'intermediate'
      },
      {
        id: 'ap-supply',
        name: 'Supply Process',
        subjectId: 'agreement-processes',
        questionCount: 12,
        difficulty: 'intermediate'
      },
      {
        id: 'ap-contracts',
        name: 'Contract Management',
        subjectId: 'agreement-processes',
        questionCount: 18,
        difficulty: 'advanced'
      }
    ],
    'organizational-processes': [
      {
        id: 'op-lifecycle',
        name: 'Lifecycle Model Management',
        subjectId: 'organizational-processes',
        questionCount: 10,
        difficulty: 'advanced'
      },
      {
        id: 'op-infrastructure',
        name: 'Infrastructure Management',
        subjectId: 'organizational-processes',
        questionCount: 8,
        difficulty: 'beginner'
      },
      {
        id: 'op-portfolio',
        name: 'Portfolio Management',
        subjectId: 'organizational-processes',
        questionCount: 12,
        difficulty: 'intermediate'
      },
      {
        id: 'op-human',
        name: 'Human Resource Management',
        subjectId: 'organizational-processes',
        questionCount: 9,
        difficulty: 'beginner'
      },
      {
        id: 'op-quality',
        name: 'Quality Management',
        subjectId: 'organizational-processes',
        questionCount: 15,
        difficulty: 'intermediate'
      },
      {
        id: 'op-knowledge',
        name: 'Knowledge Management',
        subjectId: 'organizational-processes',
        questionCount: 11,
        difficulty: 'intermediate'
      }
    ],
  };
  
  return topicsBySubject[subjectId] || [];
};

/**
 * Process quiz data to ensure all questions have valid topics and difficulties
 * @param quiz The quiz to process
 * @returns Processed quiz with validated data
 */
export const processQuizData = (quiz: QuizSeries): QuizSeries => {
  // Create a deep copy to avoid modifying the original
  const processedQuiz = {...quiz};
  
  // Process each question to ensure it has valid topic and difficulty
  processedQuiz.questions = quiz.questions.map(question => {
    const processedQuestion = {...question};
    
    // Ensure question has a topic, default to the quiz's subject if missing
    if (!processedQuestion.topic) {
      console.warn(`Question ${processedQuestion.id} has no topic, defaulting to ${quiz.subjectId}`);
      processedQuestion.topic = quiz.subjectId;
    }
    
    // Ensure question has a valid difficulty
    if (!processedQuestion.difficulty || 
        !['beginner', 'intermediate', 'advanced'].includes(processedQuestion.difficulty)) {
      console.warn(`Question ${processedQuestion.id} has invalid difficulty, defaulting to intermediate`);
      processedQuestion.difficulty = 'intermediate';
    }
    
    return processedQuestion;
  });
  
  return processedQuiz;
};

// Use this function when loading quizzes:
// const processedQuiz = processQuizData(quiz); 