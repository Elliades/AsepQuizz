export interface User {
  id: string;
  username: string;
  email: string;
  progress?: UserProgress;
}

export interface Question {
  id: string;
  text: string;
  subjectId: string;
  important?: boolean;
  source?: string;
  sourceQuestion?: string;
  answers: Answer[];
  comments: Comment[];
  tags: QuestionTag[];
  notations: Notation[];
  explanation?: string;
  imageUrl?: string;
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  parentId?: string;
  votes: number;
  createdAt: Date;
}

export interface QuestionTag {
  id: string;
  type: 'favorite' | 'confusing' | 'need-to-review' | 'irrelevant';
  userId: string;
  createdAt: Date;
}

export interface Notation {
  id: string;
  text: string;
  userId: string;
  createdAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  chapters?: Chapter[];
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  quizzes: QuizSeries[];
}

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

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  completedAt: Date;
  answers: UserAnswer[];
  timeSpent: number; // in seconds
}

export interface UserAnswer {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}

export interface UserProgress {
  completedQuizzes: string[];
  favoriteQuestions: string[];
  reviewQuestions: string[];
  averageScore: number;
  totalQuizzesTaken: number;
  totalTimeSpent: number; // in seconds
} 