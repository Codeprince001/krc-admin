// Bible Games Admin Types

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  EXPERT = 'EXPERT',
}

export enum BadgeCategory {
  STREAK = 'STREAK',
  SCORE = 'SCORE',
  COMPLETION = 'COMPLETION',
  SPECIAL = 'SPECIAL',
  LEADERBOARD = 'LEADERBOARD',
}

export enum GameType {
  DAILY_QUIZ = 'DAILY_QUIZ',
  VERSE_SCRAMBLE = 'VERSE_SCRAMBLE',
  CHARACTER_GUESS = 'CHARACTER_GUESS',
  TRIVIA = 'TRIVIA',
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty: DifficultyLevel;
  bibleReference?: string;
  points: number;
  timeLimit?: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateQuizQuestionDto {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: string;
  difficulty?: DifficultyLevel;
  bibleReference?: string;
  points?: number;
  timeLimit?: number;
}

export interface UpdateQuizQuestionDto extends Partial<CreateQuizQuestionDto> {
  isActive?: boolean;
}

export interface VerseScramble {
  id: string;
  verse: string;
  scrambledWords: string[];
  correctOrder: number[];
  reference: string;
  difficulty: DifficultyLevel;
  hint?: string;
  category?: string;
  points: number;
  timeLimit: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVerseScrambleDto {
  verse: string;
  reference: string;
  difficulty?: DifficultyLevel;
  hint?: string;
  category?: string;
  points?: number;
  timeLimit?: number;
}

export interface UpdateVerseScrambleDto extends Partial<CreateVerseScrambleDto> {
  isActive?: boolean;
}

export interface CharacterGuess {
  id: string;
  characterName: string;
  clues: string[];
  easyHints: string[];
  mediumHints: string[];
  hardHints: string[];
  category: string;
  testament: string;
  difficulty: DifficultyLevel;
  alternateNames: string[];
  maxPoints: number;
  pointsPerHint: number;
  timeLimit: number;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCharacterGuessDto {
  characterName: string;
  clues: string[];
  easyHints: string[];
  mediumHints: string[];
  hardHints: string[];
  category: string;
  testament: string;
  difficulty?: DifficultyLevel;
  alternateNames?: string[];
  maxPoints?: number;
  pointsPerHint?: number;
  timeLimit?: number;
}

export interface UpdateCharacterGuessDto extends Partial<CreateCharacterGuessDto> {
  isActive?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
  color?: string;
  requirement: string;
  streakDays?: number;
  pointsRequired?: number;
  gamesRequired?: number;
  isSpecial: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBadgeDto {
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
  color?: string;
  requirement: string;
  streakDays?: number;
  pointsRequired?: number;
  gamesRequired?: number;
  isSpecial?: boolean;
}

export interface UpdateBadgeDto extends Partial<CreateBadgeDto> {}

export interface GamesStats {
  totalQuestions: number;
  totalVerses: number;
  totalCharacters: number;
  totalBadges: number;
  totalSessions: number;
  activeUsers: number;
  averageScore: number;
  popularCategories: Array<{
    category: string;
    count: number;
  }>;
}

export interface PaginatedResponse<T> {
  questions?: T[];
  verses?: T[];
  characters?: T[];
  badges?: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

