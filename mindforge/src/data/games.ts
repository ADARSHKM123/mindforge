import { GameConfig, Achievement } from '../types';

export const gameConfigs: GameConfig[] = [
  // Reading
  { id: 'reading-comprehension', title: 'Speed Reader', description: 'Read passages and answer comprehension questions', category: 'reading', icon: '📖', difficulty: 'medium', duration: 60, color: '#6C5CE7' },
  { id: 'word-context', title: 'Context Clues', description: 'Determine word meaning from context', category: 'reading', icon: '🔍', difficulty: 'medium', duration: 45, color: '#6C5CE7' },
  // Math
  { id: 'mental-math', title: 'Mental Math', description: 'Solve arithmetic problems quickly', category: 'math', icon: '🧮', difficulty: 'medium', duration: 60, color: '#00B894' },
  { id: 'number-patterns', title: 'Number Patterns', description: 'Find the pattern in number sequences', category: 'math', icon: '🔢', difficulty: 'hard', duration: 45, color: '#00B894' },
  // Memory
  { id: 'card-match', title: 'Card Match', description: 'Match pairs of cards from memory', category: 'memory', icon: '🃏', difficulty: 'easy', duration: 90, color: '#E17055' },
  { id: 'sequence-recall', title: 'Sequence Recall', description: 'Remember and reproduce sequences', category: 'memory', icon: '🧩', difficulty: 'medium', duration: 60, color: '#E17055' },
  // Focus
  { id: 'color-match', title: 'Color Match', description: 'Match the color, not the word (Stroop test)', category: 'focus', icon: '🎯', difficulty: 'medium', duration: 45, color: '#FDCB6E' },
  { id: 'odd-one-out', title: 'Odd One Out', description: 'Find the item that doesn\'t belong', category: 'focus', icon: '👁️', difficulty: 'easy', duration: 60, color: '#FDCB6E' },
  // Speed
  { id: 'rapid-sort', title: 'Rapid Sort', description: 'Sort items into categories as fast as possible', category: 'speed', icon: '⚡', difficulty: 'medium', duration: 30, color: '#E84393' },
  { id: 'quick-tap', title: 'Quick Tap', description: 'Tap targets as fast as they appear', category: 'speed', icon: '👆', difficulty: 'easy', duration: 30, color: '#E84393' },
  // Verbal
  { id: 'word-scramble', title: 'Word Scramble', description: 'Unscramble letters to form words', category: 'verbal', icon: '🔤', difficulty: 'medium', duration: 60, color: '#0984E3' },
  { id: 'synonym-match', title: 'Synonym Match', description: 'Match words with their synonyms', category: 'verbal', icon: '📝', difficulty: 'easy', duration: 45, color: '#0984E3' },
];

export const achievements: Achievement[] = [
  { id: 'first-game', title: 'First Steps', description: 'Complete your first game', icon: '🌟', requirement: 1, type: 'games_played' },
  { id: 'ten-games', title: 'Getting Started', description: 'Complete 10 games', icon: '🔥', requirement: 10, type: 'games_played' },
  { id: 'fifty-games', title: 'Dedicated Learner', description: 'Complete 50 games', icon: '💪', requirement: 50, type: 'games_played' },
  { id: 'hundred-games', title: 'Brain Athlete', description: 'Complete 100 games', icon: '🏆', requirement: 100, type: 'games_played' },
  { id: 'streak-3', title: 'Consistent', description: '3-day streak', icon: '📅', requirement: 3, type: 'streak' },
  { id: 'streak-7', title: 'Week Warrior', description: '7-day streak', icon: '🗓️', requirement: 7, type: 'streak' },
  { id: 'streak-30', title: 'Monthly Master', description: '30-day streak', icon: '👑', requirement: 30, type: 'streak' },
  { id: 'level-5', title: 'Rising Star', description: 'Reach level 5', icon: '⭐', requirement: 5, type: 'level' },
  { id: 'level-10', title: 'Shining Bright', description: 'Reach level 10', icon: '🌠', requirement: 10, type: 'level' },
  { id: 'perfect', title: 'Perfectionist', description: 'Get a perfect score', icon: '💯', requirement: 1, type: 'perfect_score' },
];

export const categoryInfo: Record<string, { name: string; color: string; icon: string; description: string }> = {
  reading: { name: 'Reading', color: '#6C5CE7', icon: '📖', description: 'Improve comprehension and reading speed' },
  math: { name: 'Mathematics', color: '#00B894', icon: '🧮', description: 'Sharpen calculation and number skills' },
  memory: { name: 'Memory', color: '#E17055', icon: '🧠', description: 'Enhance short and long-term memory' },
  focus: { name: 'Focus', color: '#FDCB6E', icon: '🎯', description: 'Build concentration and attention' },
  speed: { name: 'Speed', color: '#E84393', icon: '⚡', description: 'Increase processing speed' },
  verbal: { name: 'Verbal', color: '#0984E3', icon: '📝', description: 'Strengthen language and vocabulary' },
};
