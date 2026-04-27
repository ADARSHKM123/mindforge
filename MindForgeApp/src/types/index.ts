// ===== User Types =====
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  longestStreak: number;
  totalGamesPlayed: number;
  totalTrainingMinutes: number;
  skillLevels: SkillLevels;
  achievements: Achievement[];
  dailyGoal: number;
  onboardingComplete: boolean;
}

export interface SkillLevels {
  reading: number;
  math: number;
  memory: number;
  focus: number;
  speed: number;
  verbal: number;
}

export type SkillCategory = keyof SkillLevels;

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: number;
  type: 'games_played' | 'streak' | 'level' | 'perfect_score' | 'category_master';
}

// ===== Game Types =====
export interface GameConfig {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  icon: string;
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  color: string;
}

export interface GameResult {
  gameId: string;
  category: SkillCategory;
  score: number;
  maxScore: number;
  accuracy: number;
  timeSpent: number;
  date: string;
  xpEarned: number;
}

export interface GameState {
  status: 'idle' | 'playing' | 'paused' | 'completed';
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  timeRemaining: number;
  answers: { correct: boolean; timeSpent: number }[];
}

// ===== Vocabulary Types =====
export interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  partOfSpeech: string;
  pronunciation: string;
  exampleSentences: string[];
  synonyms: string[];
  antonyms: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dateAdded: string;
  isPinned: boolean;
  reviewCount: number;
  nextReviewDate: string;
  easeFactor: number;
  interval: number;
}

export interface DailyVocabulary {
  date: string;
  words: VocabularyWord[];
}

// ===== Progress Types =====
export interface DailyProgress {
  date: string;
  gamesPlayed: number;
  totalScore: number;
  totalXP: number;
  timeSpent: number;
  categories: Partial<Record<SkillCategory, { played: number; avgScore: number }>>;
}

export interface WeeklyStats {
  weekStart: string;
  avgScore: number;
  totalGames: number;
  totalXP: number;
  improvement: number;
  strongestSkill: SkillCategory;
  weakestSkill: SkillCategory;
}

// ===== Theme Types =====
export type ThemeMode = 'light' | 'dark';
