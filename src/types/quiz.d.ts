
export type QuestionType = 'multiple-choice' | 'essay' | 'short-answer' | 'true-false' | 'one-liner';

export interface QuizQuestion {
  id: string;
  quizId: string;
  text: string;
  type: QuestionType;
  options?: { id: string; text: string }[];
  correctAnswer?: string;
  explanation?: string;
  points?: number;
  answers?: { id: string; text: string; isCorrect: boolean }[];
}

export interface Quiz {
  id: string | number;
  title: string;
  description?: string;
  createdBy: string;
  createdOn?: Date | string;
  deadline?: string;
  topic?: string;
  teacherId?: string;
  timeLimit?: number;
  hasAttempts?: boolean;
  questions: QuizQuestion[];
}

export interface Answer {
  questionId: string;
  answer?: string;
  selectedAnswerId?: string;
  isCorrect?: boolean;
  feedback?: string;
}

export interface Attempt {
  id: string;
  quizId: string | number;
  studentId: string;
  score: number;
  date: string;
  duration: number;
  feedback?: string;
  answers: Answer[];
}
