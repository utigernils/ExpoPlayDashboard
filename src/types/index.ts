export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Console {
  id: string;
  name: string;
  currentExpo: string;
  currentQuiz: string;
}

export interface Expo {
  id: string;
  name: string;
  startsOn: string;
  endsOn: string;
  location: string;
  isActive: boolean;
  welcomeTitle: string;
  welcomeSubtitle: string;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  joinLink: string;
  wantsNewsletter: boolean;
  playedQuizzes?: number;
}

export interface Quiz {
  id: string;
  name: string;
  totalPoints: number;
}

export interface Question {
  id: string;
  quizId: string;
  question: string;
  questionType: string;
  answerPossibilities?: any;
  pointMultiplier?: number;
}

export interface TextAnswerOption {
  Text: string;
  isCorrect: boolean;
}

export interface ImageAnswerOption {
  img_url: string;
  isCorrect: boolean;
}

export interface MultipleChoiceAnswers {
  AnswerOptions: TextAnswerOption[];
}

export interface ImageChoiceAnswers {
  AnswerOptions: ImageAnswerOption[];
}

export interface TrueFalseAnswer {
  Answer: boolean;
}

export interface PlayedQuiz {
  id: string;
  player: string;
  quiz: string;
  startedOn: string;
  quizName: string;
  expo: string;
  endedOn: string;
  correctAnswers: number;
  wrongAnswers: number;
  expoName: string;
  totalPoints: number;
}

export interface AuthState {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
