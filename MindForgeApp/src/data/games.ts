import { GameConfig, Achievement } from '../types';

export const gameConfigs: GameConfig[] = [
  { id: 'reading-comprehension', title: 'Speed Reader', description: 'Read passages and answer comprehension questions', category: 'reading', icon: '\u{1F4D6}', difficulty: 'medium', duration: 60, color: '#6C5CE7' },
  { id: 'word-context', title: 'Context Clues', description: 'Determine word meaning from context', category: 'reading', icon: '\u{1F50D}', difficulty: 'medium', duration: 45, color: '#6C5CE7' },
  { id: 'mental-math', title: 'Mental Math', description: 'Solve arithmetic problems quickly', category: 'math', icon: '\u{1F9EE}', difficulty: 'medium', duration: 60, color: '#00B894' },
  { id: 'number-patterns', title: 'Number Patterns', description: 'Find the pattern in number sequences', category: 'math', icon: '\u{1F522}', difficulty: 'hard', duration: 45, color: '#00B894' },
  { id: 'card-match', title: 'Card Match', description: 'Match pairs of cards from memory', category: 'memory', icon: '\u{1F0CF}', difficulty: 'easy', duration: 90, color: '#E17055' },
  { id: 'sequence-recall', title: 'Sequence Recall', description: 'Remember and reproduce sequences', category: 'memory', icon: '\u{1F9E9}', difficulty: 'medium', duration: 60, color: '#E17055' },
  { id: 'color-match', title: 'Color Match', description: 'Match the color, not the word (Stroop test)', category: 'focus', icon: '\u{1F3AF}', difficulty: 'medium', duration: 45, color: '#FDCB6E' },
  { id: 'odd-one-out', title: 'Odd One Out', description: 'Find the item that doesn\'t belong', category: 'focus', icon: '\u{1F441}', difficulty: 'easy', duration: 60, color: '#FDCB6E' },
  { id: 'rapid-sort', title: 'Rapid Sort', description: 'Sort items into categories as fast as possible', category: 'speed', icon: '\u{26A1}', difficulty: 'medium', duration: 30, color: '#E84393' },
  { id: 'quick-tap', title: 'Quick Tap', description: 'Tap targets as fast as they appear', category: 'speed', icon: '\u{1F446}', difficulty: 'easy', duration: 30, color: '#E84393' },
  { id: 'word-scramble', title: 'Word Scramble', description: 'Unscramble letters to form words', category: 'verbal', icon: '\u{1F524}', difficulty: 'medium', duration: 60, color: '#0984E3' },
  { id: 'synonym-match', title: 'Synonym Match', description: 'Match words with their synonyms', category: 'verbal', icon: '\u{1F4DD}', difficulty: 'easy', duration: 45, color: '#0984E3' },
];

export const achievements: Achievement[] = [
  { id: 'first-game', title: 'First Steps', description: 'Complete your first game', icon: '\u{1F31F}', requirement: 1, type: 'games_played' },
  { id: 'ten-games', title: 'Getting Started', description: 'Complete 10 games', icon: '\u{1F525}', requirement: 10, type: 'games_played' },
  { id: 'fifty-games', title: 'Dedicated Learner', description: 'Complete 50 games', icon: '\u{1F4AA}', requirement: 50, type: 'games_played' },
  { id: 'hundred-games', title: 'Brain Athlete', description: 'Complete 100 games', icon: '\u{1F3C6}', requirement: 100, type: 'games_played' },
  { id: 'streak-3', title: 'Consistent', description: '3-day streak', icon: '\u{1F4C5}', requirement: 3, type: 'streak' },
  { id: 'streak-7', title: 'Week Warrior', description: '7-day streak', icon: '\u{1F5D3}', requirement: 7, type: 'streak' },
  { id: 'streak-30', title: 'Monthly Master', description: '30-day streak', icon: '\u{1F451}', requirement: 30, type: 'streak' },
  { id: 'level-5', title: 'Rising Star', description: 'Reach level 5', icon: '\u{2B50}', requirement: 5, type: 'level' },
  { id: 'level-10', title: 'Shining Bright', description: 'Reach level 10', icon: '\u{1F320}', requirement: 10, type: 'level' },
  { id: 'perfect', title: 'Perfectionist', description: 'Get a perfect score', icon: '\u{1F4AF}', requirement: 1, type: 'perfect_score' },
];

export const categoryInfo: Record<string, { name: string; color: string; icon: string; description: string }> = {
  reading: { name: 'Reading', color: '#6C5CE7', icon: '\u{1F4D6}', description: 'Improve comprehension and reading speed' },
  math: { name: 'Mathematics', color: '#00B894', icon: '\u{1F9EE}', description: 'Sharpen calculation and number skills' },
  memory: { name: 'Memory', color: '#E17055', icon: '\u{1F9E0}', description: 'Enhance short and long-term memory' },
  focus: { name: 'Focus', color: '#FDCB6E', icon: '\u{1F3AF}', description: 'Build concentration and attention' },
  speed: { name: 'Speed', color: '#E84393', icon: '\u{26A1}', description: 'Increase processing speed' },
  verbal: { name: 'Verbal', color: '#0984E3', icon: '\u{1F4DD}', description: 'Strengthen language and vocabulary' },
};
