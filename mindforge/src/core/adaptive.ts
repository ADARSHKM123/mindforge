/**
 * Adaptive difficulty engine.
 *
 * Every game has a per-user rating: a continuous level from 1 to 10.
 * Question generators scale their parameters (operand sizes, sequence
 * lengths, distractor closeness, time pressure) from this level.
 *
 * After each session the rating moves with a staircase rule weighted by
 * accuracy and response speed, so difficulty converges to the band where
 * the player succeeds ~75–85% of the time — the zone where training is
 * most effective.
 */

import { GameRating, SkillCategory, SkillLevels } from '../types';
import { GameConfig } from '../types';
import { clamp, getToday } from '../utils/helpers';

export const MIN_LEVEL = 1;
export const MAX_LEVEL = 10;

export function newRating(seedLevel = 1): GameRating {
  return { level: seedLevel, plays: 0, lastPlayed: '', recentAccuracy: [] };
}

/**
 * Staircase update. Fast + accurate sessions push the level up,
 * struggling sessions bring it down. Speed only matters when accuracy
 * is already decent (we never reward fast guessing).
 */
export function updateRating(
  prev: GameRating | undefined,
  accuracy: number, // 0–1
  avgResponseMs: number,
  parTimeMs: number // generator's expected per-question time at this level
): GameRating {
  const r = prev ?? newRating();

  let delta: number;
  if (accuracy >= 0.9) delta = 0.7;
  else if (accuracy >= 0.8) delta = 0.45;
  else if (accuracy >= 0.65) delta = 0.15;
  else if (accuracy >= 0.5) delta = -0.25;
  else delta = -0.6;

  // Speed bonus/penalty, only when performing well
  if (accuracy >= 0.8 && avgResponseMs > 0) {
    const speedRatio = parTimeMs / avgResponseMs;
    if (speedRatio > 1.4) delta += 0.2;
    else if (speedRatio < 0.6) delta -= 0.1;
  }

  const recent = [...r.recentAccuracy, accuracy].slice(-5);

  return {
    level: clamp(r.level + delta, MIN_LEVEL, MAX_LEVEL),
    plays: r.plays + 1,
    lastPlayed: getToday(),
    recentAccuracy: recent,
  };
}

/** Integer level (1–10) handed to question generators. */
export function difficultyOf(rating: GameRating | undefined): number {
  return Math.round(clamp(rating?.level ?? 1, MIN_LEVEL, MAX_LEVEL));
}

/**
 * Skill score per category, 0–100.
 * Derived from the ratings of the games in that category; unplayed games
 * count at level 1 so scores start low and grow with real training.
 */
export function skillScores(
  games: GameConfig[],
  ratings: Record<string, GameRating>
): Record<SkillCategory, number> {
  const byCat: Record<string, { sum: number; n: number }> = {};
  games.forEach(g => {
    const level = ratings[g.id]?.level ?? 1;
    const entry = byCat[g.category] ?? { sum: 0, n: 0 };
    entry.sum += level;
    entry.n += 1;
    byCat[g.category] = entry;
  });
  const result = {} as Record<SkillCategory, number>;
  (Object.keys(byCat) as SkillCategory[]).forEach(cat => {
    const { sum, n } = byCat[cat];
    result[cat] = Math.round(((sum / n - 1) / (MAX_LEVEL - 1)) * 100);
  });
  return result;
}

/**
 * MindForge Quotient — composite cognitive score, 0–600 (100 per category).
 * The headline metric shown on the Progress page.
 */
export function mindforgeQuotient(scores: Record<SkillCategory, number>): number {
  const cats = Object.keys(scores) as SkillCategory[];
  if (cats.length === 0) return 0;
  return cats.reduce((sum, c) => sum + scores[c], 0);
}

/** Legacy-shaped skill levels (1–10 floats) kept for the profile display. */
export function toSkillLevels(scores: Record<SkillCategory, number>): SkillLevels {
  const lvl = (c: SkillCategory) => 1 + ((scores[c] ?? 0) / 100) * 9;
  return {
    reading: lvl('reading'),
    math: lvl('math'),
    memory: lvl('memory'),
    focus: lvl('focus'),
    speed: lvl('speed'),
    verbal: lvl('verbal'),
  };
}
