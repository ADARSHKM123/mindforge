/**
 * Question generators for quiz-mode games.
 *
 * Every generator receives the player's adaptive difficulty level (1–10)
 * and scales its parameters: operand sizes, sequence complexity, content
 * tier, distractor closeness and question count.
 */

import {
  analogies,
  antonymPairs,
  contextClues,
  factCheckSets,
  mainIdeaPassages,
  oddOneOutSets,
  readingPassages,
  scrambleWords,
  sortBanks,
  synonymPairs,
} from '../data/content';
import { vocabularyBank } from '../data/vocabulary';
import { shuffleArray } from '../utils/helpers';

export type Stimulus =
  | { kind: 'stroop'; word: string; color: string }
  | { kind: 'flanker'; arrows: string }
  | { kind: 'grid'; rows: string[] }
  | { kind: 'compare'; left: string; right: string };

export interface QuizQuestion {
  prompt: string;
  passage?: string;
  stimulus?: Stimulus;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface QuizSpec {
  questions: QuizQuestion[];
  parMsPerQuestion: number;
}

// ===== helpers =====

const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

const tierFor = (level: number): 1 | 2 | 3 => (level <= 3 ? 1 : level <= 7 ? 2 : 3);

/** Pull items at or near the target tier, padding from neighbors if the bank is small. */
function byTier<T extends { tier: number }>(bank: T[], level: number, count: number): T[] {
  const t = tierFor(level);
  const exact = shuffleArray(bank.filter(x => x.tier === t));
  const near = shuffleArray(bank.filter(x => x.tier !== t));
  return [...exact, ...near].slice(0, count);
}

function numericOptions(answer: number, spread: number): { options: string[]; correctIndex: number } {
  const wrongs = new Set<number>();
  let guard = 0;
  while (wrongs.size < 3 && guard++ < 200) {
    const delta = randInt(1, Math.max(2, spread));
    const w = answer + (Math.random() < 0.5 ? -delta : delta);
    if (w !== answer && w >= 0) wrongs.add(w);
  }
  const all = shuffleArray([answer, ...Array.from(wrongs)]);
  return { options: all.map(String), correctIndex: all.indexOf(answer) };
}

// ===== Math =====

function mentalMath(level: number): QuizSpec {
  const count = 10;
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    let prompt: string;
    let answer: number;
    if (level <= 2) {
      const a = randInt(5, 20), b = randInt(3, 15);
      if (Math.random() < 0.5) { prompt = `${a} + ${b}`; answer = a + b; }
      else { prompt = `${a + b} − ${b}`; answer = a; }
    } else if (level <= 4) {
      const pick = Math.random();
      if (pick < 0.4) { const a = randInt(20, 90), b = randInt(10, 60); prompt = `${a} + ${b}`; answer = a + b; }
      else if (pick < 0.7) { const a = randInt(40, 99), b = randInt(10, 39); prompt = `${a} − ${b}`; answer = a - b; }
      else { const a = randInt(3, 10), b = randInt(3, 10); prompt = `${a} × ${b}`; answer = a * b; }
    } else if (level <= 7) {
      const pick = Math.random();
      if (pick < 0.35) { const a = randInt(6, 14), b = randInt(6, 14); prompt = `${a} × ${b}`; answer = a * b; }
      else if (pick < 0.6) { const b = randInt(3, 12); const q = randInt(4, 15); prompt = `${b * q} ÷ ${b}`; answer = q; }
      else { const a = randInt(10, 40), b = randInt(2, 9), c = randInt(2, 9); prompt = `${a} + ${b} × ${c}`; answer = a + b * c; }
    } else {
      const pick = Math.random();
      if (pick < 0.4) { const a = randInt(12, 29), b = randInt(11, 19); prompt = `${a} × ${b}`; answer = a * b; }
      else if (pick < 0.7) { const a = randInt(2, 9), b = randInt(2, 9), c = randInt(10, 60); prompt = `${a} × ${b} + ${c}`; answer = a * b + c; }
      else { const a = randInt(100, 400), b = randInt(50, 250); prompt = `${a} − ${b} + ${randInt(10, 90)}`; const parts = prompt.split(/ [−+] /).map(Number); answer = parts[0] - parts[1] + parts[2]; }
    }
    const spread = level <= 4 ? 6 : level <= 7 ? 8 : 14;
    const { options, correctIndex } = numericOptions(answer, spread);
    questions.push({ prompt: `${prompt} = ?`, options, correctIndex });
  }
  return { questions, parMsPerQuestion: 5500 - level * 150 };
}

function numberPatterns(level: number): QuizSpec {
  const count = 8;
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    let seq: number[] = [];
    let answer = 0;
    let rule = '';
    const kind = level <= 3 ? 0 : level <= 6 ? randInt(0, 2) : randInt(1, 4);
    switch (kind) {
      case 0: { const s = randInt(1, 12), d = randInt(2, 9); seq = [0, 1, 2, 3, 4].map(j => s + d * j); answer = s + d * 5; rule = `Add ${d} each time`; break; }
      case 1: { const s = randInt(1, 5), r = randInt(2, 3); seq = [0, 1, 2, 3].map(j => s * Math.pow(r, j)); answer = s * Math.pow(r, 4); rule = `Multiply by ${r}`; break; }
      case 2: { const s = randInt(10, 30), a = randInt(3, 8), b = randInt(1, Math.max(1, a - 2)); seq = [s, s + a, s + a - b, s + 2 * a - b, s + 2 * a - 2 * b]; answer = s + 3 * a - 2 * b; rule = `Alternating +${a}, −${b}`; break; }
      case 3: { const s = randInt(1, 6); seq = [s, s + 1, s + 2, s + 3].map(x => x * x); answer = (s + 4) * (s + 4); rule = 'Consecutive squares'; break; }
      default: { let a = randInt(1, 4), b = randInt(2, 5); seq = [a, b]; for (let j = 0; j < 3; j++) seq.push(seq[seq.length - 1] + seq[seq.length - 2]); answer = seq[seq.length - 1] + seq[seq.length - 2]; rule = 'Each term is the sum of the previous two'; break; }
    }
    const spread = level <= 5 ? 5 : 9;
    const { options, correctIndex } = numericOptions(answer, spread);
    questions.push({ prompt: `What comes next?\n${seq.join(',  ')},  ?`, options, correctIndex, explanation: rule });
  }
  return { questions, parMsPerQuestion: 8000 };
}

function percentages(level: number): QuizSpec {
  const count = 9;
  const questions: QuizQuestion[] = [];
  const easyP = [10, 25, 50, 100];
  const midP = [5, 15, 20, 75, 30];
  const hardP = [12.5, 35, 60, 85, 7.5];
  for (let i = 0; i < count; i++) {
    const pool = level <= 3 ? easyP : level <= 7 ? [...easyP, ...midP] : [...midP, ...hardP];
    const p = pool[randInt(0, pool.length - 1)];
    const base = level <= 3 ? randInt(2, 20) * 10 : level <= 7 ? randInt(4, 40) * 5 : randInt(8, 96) * 5;
    if (level >= 6 && Math.random() < 0.4) {
      const up = Math.random() < 0.5;
      const answer = Math.round(base * (1 + (up ? p : -p) / 100));
      const { options, correctIndex } = numericOptions(answer, Math.max(4, Math.round(base * 0.06)));
      questions.push({ prompt: `${base} ${up ? 'increased' : 'decreased'} by ${p}% = ?`, options, correctIndex });
    } else {
      const answer = Math.round((base * p) / 100);
      const { options, correctIndex } = numericOptions(answer, Math.max(3, Math.round(answer * 0.25)));
      questions.push({ prompt: `What is ${p}% of ${base}?`, options, correctIndex });
    }
  }
  return { questions, parMsPerQuestion: 6500 };
}

function estimation(level: number): QuizSpec {
  const count = 8;
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = randInt(13, 89), b = randInt(13, 89);
    const exact = a * b;
    // Options are spaced multiplicatively; spacing tightens as level rises
    const factor = level <= 3 ? 0.45 : level <= 7 ? 0.3 : 0.18;
    const round = (n: number) => Math.round(n / 50) * 50;
    const set = new Set<number>([round(exact)]);
    let k = 1;
    while (set.size < 4) {
      set.add(round(exact * (1 + factor * k)));
      if (set.size < 4) set.add(round(exact * (1 - factor * k)));
      k++;
    }
    const opts = shuffleArray(Array.from(set)).slice(0, 4);
    if (!opts.includes(round(exact))) opts[0] = round(exact);
    const shuffledOpts = shuffleArray(opts);
    // Correct answer = the option closest to the exact product
    let best = 0;
    shuffledOpts.forEach((o, idx) => { if (Math.abs(o - exact) < Math.abs(shuffledOpts[best] - exact)) best = idx; });
    questions.push({
      prompt: `Roughly, what is ${a} × ${b}?`,
      options: shuffledOpts.map(String),
      correctIndex: best,
      explanation: `Exact answer: ${exact.toLocaleString()}`,
    });
  }
  return { questions, parMsPerQuestion: 7000 };
}

// ===== Reading =====

function speedReader(level: number): QuizSpec {
  const picks = shuffleArray(readingPassages).slice(0, 5);
  return {
    questions: picks.map(p => ({ prompt: p.q, passage: p.text, options: p.options, correctIndex: p.correct })),
    parMsPerQuestion: Math.max(12000, 22000 - level * 1000),
  };
}

function contextCluesGame(level: number): QuizSpec {
  const picks = byTier(contextClues, level, 8);
  return {
    questions: picks.map(c => ({ prompt: c.sentence.replace('___', '＿＿＿'), options: c.options, correctIndex: c.correct })),
    parMsPerQuestion: 8000,
  };
}

function factCheck(level: number): QuizSpec {
  const sets = shuffleArray(factCheckSets).slice(0, 2);
  const questions: QuizQuestion[] = [];
  sets.forEach(set => {
    shuffleArray(set.statements).slice(0, 4).forEach(s => {
      questions.push({
        prompt: 'True or false?\n' + s.statement,
        passage: set.text,
        options: ['True', 'False'],
        correctIndex: s.isTrue ? 0 : 1,
      });
    });
  });
  return { questions, parMsPerQuestion: 10000 };
}

function mainIdea(level: number): QuizSpec {
  const picks = shuffleArray(mainIdeaPassages).slice(0, 5);
  return {
    questions: picks.map(p => ({ prompt: p.q, passage: p.text, options: p.options, correctIndex: p.correct })),
    parMsPerQuestion: 16000,
  };
}

// ===== Focus =====

const inkColors: { name: string; hex: string }[] = [
  { name: 'Red', hex: '#DC2626' },
  { name: 'Blue', hex: '#2563EB' },
  { name: 'Green', hex: '#059669' },
  { name: 'Yellow', hex: '#CA8A04' },
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Orange', hex: '#EA580C' },
];

function colorMatch(level: number): QuizSpec {
  const count = 12;
  const palette = inkColors.slice(0, level <= 4 ? 4 : 6);
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const word = palette[randInt(0, palette.length - 1)];
    let ink = palette[randInt(0, palette.length - 1)];
    if (Math.random() < 0.75) {
      while (ink.name === word.name) ink = palette[randInt(0, palette.length - 1)];
    }
    // At higher levels the task randomly switches between ink and word
    const askInk = level < 6 || Math.random() < 0.6;
    const answer = askInk ? ink.name : word.name;
    const options = shuffleArray(palette.map(c => c.name)).slice(0, 4);
    if (!options.includes(answer)) options[randInt(0, 3)] = answer;
    questions.push({
      prompt: askInk ? 'What COLOR is the ink?' : 'What does the word SAY?',
      stimulus: { kind: 'stroop', word: word.name.toUpperCase(), color: ink.hex },
      options,
      correctIndex: options.indexOf(answer),
    });
  }
  return { questions, parMsPerQuestion: 3200 - level * 80 };
}

function oddOneOut(level: number): QuizSpec {
  const picks = byTier(oddOneOutSets, level, 8);
  return {
    questions: picks.map(s => ({
      prompt: 'Which one does not belong?',
      options: s.items,
      correctIndex: s.odd,
      explanation: s.reason,
    })),
    parMsPerQuestion: 6000,
  };
}

function arrowFocus(level: number): QuizSpec {
  const count = 14;
  const len = level <= 3 ? 5 : level <= 7 ? 7 : 9;
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const center = Math.random() < 0.5 ? '←' : '→';
    const congruent = Math.random() < (level <= 3 ? 0.5 : 0.3);
    const flank = congruent ? center : center === '←' ? '→' : '←';
    const arrows: string[] = Array(len).fill(flank);
    arrows[Math.floor(len / 2)] = center;
    questions.push({
      prompt: 'Which way does the MIDDLE arrow point?',
      stimulus: { kind: 'flanker', arrows: arrows.join(' ') },
      options: ['← Left', '→ Right'],
      correctIndex: center === '←' ? 0 : 1,
    });
  }
  return { questions, parMsPerQuestion: 2500 - level * 60 };
}

function targetCount(level: number): QuizSpec {
  const count = 8;
  const size = level <= 3 ? 4 : level <= 7 ? 5 : 6;
  // Distractors get visually closer to the target at higher levels
  const sets = level <= 3
    ? [{ target: '7', distractors: ['3', '5'] }, { target: 'A', distractors: ['X', 'O'] }]
    : level <= 7
      ? [{ target: '6', distractors: ['9', '8'] }, { target: 'E', distractors: ['F', 'B'] }]
      : [{ target: 'b', distractors: ['d', 'p'] }, { target: 'M', distractors: ['W', 'N'] }];
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const { target, distractors } = sets[randInt(0, sets.length - 1)];
    const total = size * size;
    const n = randInt(3, Math.min(9, Math.floor(total / 3)));
    const cells = Array(total).fill('');
    const idxs = shuffleArray(Array.from({ length: total }, (_, j) => j));
    idxs.slice(0, n).forEach(j => { cells[j] = target; });
    idxs.slice(n).forEach(j => { cells[j] = distractors[randInt(0, distractors.length - 1)]; });
    const rows: string[] = [];
    for (let r = 0; r < size; r++) rows.push(cells.slice(r * size, (r + 1) * size).join(' '));
    const { options, correctIndex } = numericOptions(n, 2);
    questions.push({
      prompt: `How many "${target}" do you see?`,
      stimulus: { kind: 'grid', rows },
      options,
      correctIndex,
    });
  }
  return { questions, parMsPerQuestion: 8000 };
}

// ===== Speed =====

function rapidSort(level: number): QuizSpec {
  const count = 14;
  const banks = sortBanks.filter(b => (level <= 4 ? b.tier === 1 : true));
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const bank = banks[randInt(0, banks.length - 1)];
    const cats = Object.keys(bank.categories);
    const cat = cats[randInt(0, cats.length - 1)];
    const items = bank.categories[cat];
    const item = items[randInt(0, items.length - 1)];
    const options = shuffleArray([...cats]);
    questions.push({ prompt: item, options, correctIndex: options.indexOf(cat) });
  }
  return { questions, parMsPerQuestion: 2600 - level * 60 };
}

function quickCompare(level: number): QuizSpec {
  const count = 14;
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = randInt(2, level <= 4 ? 12 : 20);
    const b = randInt(2, level <= 4 ? 12 : 20);
    const op = Math.random() < 0.5 ? '+' : '×';
    const real = op === '+' ? a + b : a * b;
    const isTrue = Math.random() < 0.5;
    const offset = level <= 4 ? randInt(2, 5) : 1; // tighter lies are harder
    const shown = isTrue ? real : real + (Math.random() < 0.5 ? -offset : offset);
    questions.push({
      prompt: 'Correct or wrong?',
      stimulus: { kind: 'compare', left: `${a} ${op} ${b}`, right: String(shown) },
      options: ['Correct', 'Wrong'],
      correctIndex: isTrue ? 0 : 1,
    });
  }
  return { questions, parMsPerQuestion: 2600 - level * 70 };
}

function symbolMatch(level: number): QuizSpec {
  const count = 12;
  const glyphs = ['◇', '○', '△', '□', '☆', '✕', '◈', '⬡'];
  const len = level <= 3 ? 4 : level <= 7 ? 6 : 8;
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const left = Array.from({ length: len }, () => glyphs[randInt(0, glyphs.length - 1)]);
    const same = Math.random() < 0.5;
    const right = [...left];
    if (!same) {
      const j = randInt(0, len - 1);
      let g = glyphs[randInt(0, glyphs.length - 1)];
      while (g === right[j]) g = glyphs[randInt(0, glyphs.length - 1)];
      right[j] = g;
    }
    questions.push({
      prompt: 'Are the two patterns identical?',
      stimulus: { kind: 'compare', left: left.join(' '), right: right.join(' ') },
      options: ['Same', 'Different'],
      correctIndex: same ? 0 : 1,
    });
  }
  return { questions, parMsPerQuestion: 3500 - level * 80 };
}

function arithmeticSprint(level: number): QuizSpec {
  const count = 16;
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    const a = randInt(2, 9 + level), b = randInt(2, 9);
    const op = Math.random() < 0.6 ? '+' : '−';
    const answer = op === '+' ? a + b : Math.max(a, b) - Math.min(a, b);
    const prompt = op === '+' ? `${a} + ${b}` : `${Math.max(a, b)} − ${Math.min(a, b)}`;
    const { options, correctIndex } = numericOptions(answer, 3);
    questions.push({ prompt: `${prompt} = ?`, options, correctIndex });
  }
  return { questions, parMsPerQuestion: 2300 - level * 50 };
}

// ===== Verbal =====

function wordScramble(level: number): QuizSpec {
  const minLen = level <= 3 ? 4 : level <= 6 ? 5 : 6;
  const maxLen = level <= 3 ? 5 : level <= 6 ? 6 : 9;
  const pool = scrambleWords.filter(w => w.length >= minLen && w.length <= maxLen);
  const picks = shuffleArray(pool.length >= 8 ? pool : scrambleWords).slice(0, 8);
  const questions: QuizQuestion[] = picks.map(word => {
    let scrambled = word;
    let guard = 0;
    while (scrambled === word && guard++ < 20) {
      scrambled = shuffleArray(word.split('')).join('');
    }
    const wrongs = shuffleArray(scrambleWords.filter(w => w !== word && Math.abs(w.length - word.length) <= 1)).slice(0, 3);
    const options = shuffleArray([word, ...wrongs]);
    return {
      prompt: `Unscramble:\n${scrambled.split('').join(' ')}`,
      options,
      correctIndex: options.indexOf(word),
    };
  });
  return { questions, parMsPerQuestion: 7000 };
}

function pairGame(bank: typeof synonymPairs, label: string, level: number): QuizSpec {
  const picks = byTier(bank, level, 9);
  return {
    questions: picks.map(p => {
      const options = shuffleArray([p.answer, ...p.wrongs]);
      return {
        prompt: `${label} of "${p.word}"`,
        options,
        correctIndex: options.indexOf(p.answer),
      };
    }),
    parMsPerQuestion: 5500,
  };
}

function analogiesGame(level: number): QuizSpec {
  const picks = byTier(analogies, level, 7);
  return {
    questions: picks.map(a => ({ prompt: a.prompt, options: a.options, correctIndex: a.correct })),
    parMsPerQuestion: 9000,
  };
}

function wordDefinitions(level: number): QuizSpec {
  const diff = level <= 3 ? 'beginner' : level <= 7 ? 'intermediate' : 'advanced';
  let pool = vocabularyBank.filter(w => w.difficulty === diff);
  if (pool.length < 8) pool = vocabularyBank;
  const picks = shuffleArray(pool).slice(0, 8);
  return {
    questions: picks.map(w => {
      const wrongs = shuffleArray(vocabularyBank.filter(x => x.id !== w.id)).slice(0, 3).map(x => x.word);
      const options = shuffleArray([w.word, ...wrongs]);
      return {
        prompt: `"${w.definition}"\n\nWhich word matches this definition?`,
        options,
        correctIndex: options.indexOf(w.word),
      };
    }),
    parMsPerQuestion: 7500,
  };
}

// ===== Dispatch =====

export function buildQuiz(gameId: string, level: number): QuizSpec {
  switch (gameId) {
    case 'mental-math': return mentalMath(level);
    case 'number-patterns': return numberPatterns(level);
    case 'percentages': return percentages(level);
    case 'estimation': return estimation(level);
    case 'speed-reader': return speedReader(level);
    case 'context-clues': return contextCluesGame(level);
    case 'fact-check': return factCheck(level);
    case 'main-idea': return mainIdea(level);
    case 'color-match': return colorMatch(level);
    case 'odd-one-out': return oddOneOut(level);
    case 'arrow-focus': return arrowFocus(level);
    case 'target-count': return targetCount(level);
    case 'rapid-sort': return rapidSort(level);
    case 'quick-compare': return quickCompare(level);
    case 'symbol-match': return symbolMatch(level);
    case 'arithmetic-sprint': return arithmeticSprint(level);
    case 'word-scramble': return wordScramble(level);
    case 'synonym-match': return pairGame(synonymPairs, 'Synonym', level);
    case 'antonym-match': return pairGame(antonymPairs, 'Antonym', level);
    case 'analogies': return analogiesGame(level);
    case 'word-definitions': return wordDefinitions(level);
    default: return mentalMath(level);
  }
}
