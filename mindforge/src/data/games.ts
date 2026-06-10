import { Achievement, GameConfig, SkillCategory } from '../types';

/**
 * Game catalog — 25 games across 6 categories.
 * `mode` selects the interaction engine; `proOnly` drives the freemium gate.
 */
export const gameConfigs: GameConfig[] = [
  // ===== Reading =====
  { id: 'speed-reader', title: 'Speed Reader', description: 'Read passages under time pressure and answer comprehension questions.', benefit: 'Improves reading speed and retention', category: 'reading', mode: 'quiz', duration: 90, proOnly: false },
  { id: 'context-clues', title: 'Context Clues', description: 'Infer the missing word from the meaning of the sentence.', benefit: 'Strengthens inference and vocabulary in context', category: 'reading', mode: 'quiz', duration: 60, proOnly: false },
  { id: 'fact-check', title: 'Fact Check', description: 'Read a passage, then judge statements about it as true or false.', benefit: 'Builds careful, detail-oriented reading', category: 'reading', mode: 'quiz', duration: 90, proOnly: true },
  { id: 'main-idea', title: 'Main Idea', description: 'Identify the central point of a short passage.', benefit: 'Trains summarization and comprehension', category: 'reading', mode: 'quiz', duration: 90, proOnly: true },

  // ===== Math =====
  { id: 'mental-math', title: 'Mental Math', description: 'Solve arithmetic problems in your head, fast.', benefit: 'Sharpens calculation fluency', category: 'math', mode: 'quiz', duration: 60, proOnly: false },
  { id: 'number-patterns', title: 'Number Patterns', description: 'Find the rule behind a sequence and predict the next number.', benefit: 'Develops pattern recognition and logic', category: 'math', mode: 'quiz', duration: 75, proOnly: false },
  { id: 'percentages', title: 'Percent Power', description: 'Work out percentages, discounts and tips without a calculator.', benefit: 'Practical everyday math fluency', category: 'math', mode: 'quiz', duration: 60, proOnly: true },
  { id: 'estimation', title: 'Estimation', description: 'Judge approximate results of large calculations quickly.', benefit: 'Trains numerical intuition', category: 'math', mode: 'quiz', duration: 60, proOnly: true },

  // ===== Memory =====
  { id: 'card-pairs', title: 'Card Pairs', description: 'Flip cards and find all matching pairs from memory.', benefit: 'Exercises visual working memory', category: 'memory', mode: 'memory-board', duration: 90, proOnly: false },
  { id: 'sequence-recall', title: 'Sequence Recall', description: 'Watch the pattern light up, then reproduce it.', benefit: 'Expands short-term memory span', category: 'memory', mode: 'sequence', duration: 90, proOnly: false },
  { id: 'symbol-pairs', title: 'Symbol Pairs', description: 'A harder pairs board with abstract symbols.', benefit: 'Pushes visual memory capacity further', category: 'memory', mode: 'memory-board', duration: 105, proOnly: true },
  { id: 'pattern-recall', title: 'Pattern Recall', description: 'Longer, faster light sequences on a bigger grid.', benefit: 'Advanced sequence memory training', category: 'memory', mode: 'sequence', duration: 90, proOnly: true },

  // ===== Focus =====
  { id: 'color-match', title: 'Color Match', description: 'Name the ink color, not the word — the classic Stroop task.', benefit: 'Builds interference control', category: 'focus', mode: 'quiz', duration: 45, proOnly: false },
  { id: 'odd-one-out', title: 'Odd One Out', description: 'Spot the item that does not belong in the group.', benefit: 'Sharpens categorical attention', category: 'focus', mode: 'quiz', duration: 60, proOnly: false },
  { id: 'arrow-focus', title: 'Arrow Focus', description: 'Report the direction of the middle arrow, ignoring the flankers.', benefit: 'Trains selective attention', category: 'focus', mode: 'quiz', duration: 45, proOnly: true },
  { id: 'target-count', title: 'Target Count', description: 'Count how many targets are hidden in a field of distractors.', benefit: 'Improves visual search and sustained focus', category: 'focus', mode: 'quiz', duration: 60, proOnly: true },

  // ===== Speed =====
  { id: 'rapid-sort', title: 'Rapid Sort', description: 'Sort items into the right category as fast as possible.', benefit: 'Raises decision-making speed', category: 'speed', mode: 'quiz', duration: 45, proOnly: false },
  { id: 'quick-compare', title: 'Quick Compare', description: 'Is the equation right or wrong? Decide instantly.', benefit: 'Boosts processing speed under pressure', category: 'speed', mode: 'quiz', duration: 45, proOnly: false },
  { id: 'symbol-match', title: 'Symbol Match', description: 'Decide whether two symbol strings are identical.', benefit: 'Speeds up visual comparison', category: 'speed', mode: 'quiz', duration: 45, proOnly: true },
  { id: 'arithmetic-sprint', title: 'Arithmetic Sprint', description: 'A rapid-fire burst of tiny calculations.', benefit: 'Automates basic number facts', category: 'speed', mode: 'quiz', duration: 45, proOnly: true },

  // ===== Verbal =====
  { id: 'word-scramble', title: 'Word Scramble', description: 'Unscramble the letters to reveal the hidden word.', benefit: 'Strengthens word retrieval', category: 'verbal', mode: 'quiz', duration: 75, proOnly: false },
  { id: 'synonym-match', title: 'Synonym Match', description: 'Pick the word closest in meaning.', benefit: 'Deepens vocabulary connections', category: 'verbal', mode: 'quiz', duration: 60, proOnly: false },
  { id: 'antonym-match', title: 'Antonym Match', description: 'Pick the word opposite in meaning.', benefit: 'Builds precise word knowledge', category: 'verbal', mode: 'quiz', duration: 60, proOnly: true },
  { id: 'analogies', title: 'Analogies', description: 'Complete the relationship: A is to B as C is to …', benefit: 'Trains abstract verbal reasoning', category: 'verbal', mode: 'quiz', duration: 75, proOnly: true },
  { id: 'word-definitions', title: 'Definitions', description: 'Match definitions to words from your vocabulary program.', benefit: 'Reinforces words you are learning', category: 'verbal', mode: 'quiz', duration: 60, proOnly: true },
];

export const categoryInfo: Record<
  SkillCategory,
  { name: string; cssVar: string; description: string }
> = {
  reading: { name: 'Reading', cssVar: 'var(--cat-reading)', description: 'Comprehension and reading speed' },
  math: { name: 'Math', cssVar: 'var(--cat-math)', description: 'Calculation and number sense' },
  memory: { name: 'Memory', cssVar: 'var(--cat-memory)', description: 'Working and short-term memory' },
  focus: { name: 'Focus', cssVar: 'var(--cat-focus)', description: 'Attention and interference control' },
  speed: { name: 'Speed', cssVar: 'var(--cat-speed)', description: 'Processing and reaction speed' },
  verbal: { name: 'Verbal', cssVar: 'var(--cat-verbal)', description: 'Vocabulary and word reasoning' },
};

export const achievements: Achievement[] = [
  { id: 'first-game', title: 'First Steps', description: 'Complete your first session', requirement: 1, type: 'games_played' },
  { id: 'ten-games', title: 'Warming Up', description: 'Complete 10 sessions', requirement: 10, type: 'games_played' },
  { id: 'fifty-games', title: 'Dedicated', description: 'Complete 50 sessions', requirement: 50, type: 'games_played' },
  { id: 'hundred-games', title: 'Brain Athlete', description: 'Complete 100 sessions', requirement: 100, type: 'games_played' },
  { id: 'streak-3', title: 'Consistent', description: 'Train 3 days in a row', requirement: 3, type: 'streak' },
  { id: 'streak-7', title: 'Week Strong', description: 'Train 7 days in a row', requirement: 7, type: 'streak' },
  { id: 'streak-30', title: 'Unstoppable', description: 'Train 30 days in a row', requirement: 30, type: 'streak' },
  { id: 'level-5', title: 'Climbing', description: 'Reach level 5', requirement: 5, type: 'level' },
  { id: 'level-10', title: 'Elevated', description: 'Reach level 10', requirement: 10, type: 'level' },
  { id: 'perfect', title: 'Flawless', description: 'Finish a session with a perfect score', requirement: 1, type: 'perfect_score' },
];
