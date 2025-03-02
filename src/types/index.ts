/**
 * Question type
 * Question type is the type of question that is used to store question data.
 * 
 * Question type interface is used to create a question type object that is used to store question data.
 * Only the types defined in the enum are allowed.
 * Currently, only multiple choice and simple choice are supported.
 */
export type QuestionType = 'multiple-choice' | 'simple-choice' | 'trueFalse' | 'fillInBlank';

/**
 * User interface
 * User is the user of the application, they have a username, email, and progress.
 * They can have a progress object that tracks their progress through the application.
 * TODO: User can have favorite questions, and review questions.
 * TODO: User can have a profile picture.
 * 
 * User interface is used to create a user object that is used to store user data.
 */
export interface User {
  id: string;
  username: string;
  email: string;
  progress?: UserProgress;
}

/**
 * Base question interface
 * Base question is the base question object that is used to create a question object.
 * It is used to store question data.
 * 
 * Base question are never used directly, they are used to create a question object.
 * Base question interface is used to create a base question object that is used to store question data.
 */
export interface BaseQuestion {
  id: string;
  text: string;
  subjectId: string;
  topic: string;
  type: QuestionType;
  difficulty: "beginner" | "intermediate" | "advanced" | undefined;
  important?: boolean;
  source?: string;
  sourceQuestion?: string;
  comments: Comment[];
  tags: QuestionTag[];
  notations: Notation[];
  explanation?: string;
  imageUrl?: string;
}

/**
 * Multiple choice question interface
 * Multiple choice question is a question that has multiple choice answers.
 * It is used to store multiple choice question data.
 * 
 * Multiple choice question interface is used to create a multiple choice question object that is used to store question data.
 */
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  answers: Answer[];
  numberToChoose?: number;
}

/**
 * Simple choice question interface
 * Simple choice question is a question that has a single choice answer.
 * It is used to store simple choice question data.
 * 
 * Simple choice question interface is used to create a simple choice question object that is used to store question data.
 */
export interface SimpleChoiceQuestion extends BaseQuestion {
  type: 'simple-choice';
  answers: Answer[];
}

/**
 * Question interface
 * Question is a question object that is used to store question data.
 * 
 * Question interface is used to create a question object that is used to store question data.
 */
export type Question = MultipleChoiceQuestion | SimpleChoiceQuestion;

/**
 * Answer interface
 * Answer is an answer object that is used to store answer data.
 * 
 * Answer interface is used to create an answer object that is used to store answer data.
 */
export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

/**
 * Comment interface
 * Comment is a comment object that is used to store comment data.
 * 
 */

export interface Comment {
  id: string;
  text: string;
  userId: string;
  parentId?: string;
  votes: number;
  createdAt: Date;
}

/**
 * Question tag interface
 * Question tag is a tag object that is used to store tag data.
 * 
 * Question tag interface is used to create a question tag object that is used to store tag data.
 */
export interface QuestionTag {
  id: string;
  type: 'favorite' | 'confusing' | 'need-to-review' | 'irrelevant';
  userId: string;
  createdAt: Date;
}

/**
 * Notation interface
 * Notation is a notation object that is used to store notation data.
 * 
 * Notation interface is used to create a notation object that is used to store notation data.
 */
export interface Notation {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
}

/**
 * Subject interface
 * Subject is a subject object that is used to store subject data.
 * 
 * Subject interface is used to create a subject object that is used to store subject data.
 */ 
export interface Subject {
  id: string;
  name: string;
  description: string;
  chapters: Chapter[];
}

/**
 * Chapter interface
 * Chapter is a chapter object that is used to store chapter data.
 * 
 * Chapter interface is used to create a chapter object that is used to store chapter data.
 */
export interface Chapter {
  id: string;
  name: string;
  description: string;
  quizzes?: Quiz[];
}

/**
 * Quiz series interface
 * Quiz series is a quiz series object that is used to store quiz series data.
 * 
 * Quiz series interface is used to create a quiz series object that is used to store quiz series data.
 */
export interface QuizSeries {
  id: string;
  name: string;
  subjectId: string;
  chapterId?: string;
  description?: string;
  questions: Question[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  timeLimit?: number; // in minutes
}

/**
 * Quiz attempt interface
 * Quiz attempt is a quiz attempt object that is used to store quiz attempt data.
 * 
 * Quiz attempt interface is used to create a quiz attempt object that is used to store quiz attempt data.
 */
export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  completedAt: Date;
  answers: UserAnswer[];
  timeSpent: number; // in seconds
}

/**
 * User answer interface
 * User answer is a user answer object that is used to store user answer data.
 * 
 * User answer interface is used to create a user answer object that is used to store user answer data.
 */
export interface UserAnswer {
  questionId: string;
  answerIds: string[];
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

/**
 * User progress interface
 * User progress is a user progress object that is used to store user progress data.
 * 
 * User progress interface is used to create a user progress object that is used to store user progress data.
 */ 
export interface UserProgress {
  completedQuizzes: string[];
  favoriteQuestions: string[];
  reviewQuestions: string[];
  averageScore: number;
  totalQuizzesTaken: number;
  totalTimeSpent: number; // in seconds
}

/**
 * Quiz interface
 * Quiz is a quiz object that is used to store quiz data.
 * 
 * Quiz interface is used to create a quiz object that is used to store quiz data.
 */ 
export interface Quiz {
  id: string;
  name: string;
  description?: string;
  questions: Question[]; // Assuming a quiz contains questions
  // Add any other properties relevant to a Quiz_Page
}

// Define the QuizResult type
export interface QuizResult {
  score: number;
  totalQuestions: number;
  userAnswers: UserAnswer[];
  startTime: Date;
  endTime: Date;
  timeSpent: number; // in seconds
}
