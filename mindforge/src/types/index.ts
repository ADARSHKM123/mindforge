// ===== User Types =====
export interface UserProfile {
  id: string;
  name: string;
  email: string;
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
  dailyGoal: number; // games per day
  onboardingComplete: boolean;
  isPro: boolean;
  focusAreas: SkillCategory[]; // chosen during onboarding
  gameRatings: Record<string, GameRating>;
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

// Adaptive difficulty rating for a single game (level 1–10, continuous)
export interface GameRating {
  level: number;
  plays: number;
  lastPlayed: string;
  recentAccuracy: number[]; // last few accuracy values, 0–1
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
  requirement: number;
  type: 'games_played' | 'streak' | 'level' | 'perfect_score' | 'category_master';
}

// ===== Game Types =====
export type GameMode = 'quiz' | 'memory-board' | 'sequence';

export interface GameConfig {
  id: string;
  title: string;
  description: string;
  benefit: string; // what cognitive skill it trains, shown on intro
  category: SkillCategory;
  mode: GameMode;
  duration: number; // seconds
  proOnly: boolean;
}

export interface GameResult {
  gameId: string;
  category: SkillCategory;
  score: number;
  maxScore: number;
  accuracy: number; // 0–100
  timeSpent: number; // seconds
  avgResponseMs: number;
  date: string;
  xpEarned: number;
}

// Summary passed from a game engine to the host on completion
export interface SessionSummary {
  score: number;
  maxScore: number;
  accuracy: number; // 0–1
  avgResponseMs: number;
  timeSpent: number; // seconds
}

// ===== Workout Types =====
export interface DailyWorkout {
  date: string;
  gameIds: string[];
  completed: string[];
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
  easeFactor: number; // for spaced repetition
  interval: number; // days until next review
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
  improvement: number; // percentage
  strongestSkill: SkillCategory;
  weakestSkill: SkillCategory;
}

// ===== Theme Types =====
export type ThemeMode = 'light' | 'dark';
