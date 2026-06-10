/**
 * Daily Workout builder.
 *
 * Generates a personalized session for the day: weakest skills first,
 * then variety across categories not trained recently. Deterministic for
 * a given date + profile so the workout doesn't reshuffle on refresh.
 *
 * Free tier: 3 games (free games only). Pro: 5 games, full library.
 */

import { DailyWorkout, GameRating, SkillCategory } from '../types';
import { GameConfig } from '../types';
import { skillScores } from './adaptive';

export const FREE_WORKOUT_SIZE = 3;
export const PRO_WORKOUT_SIZE = 5;

// Small deterministic PRNG seeded from a string (mulberry32 over a hash)
function seededRandom(seed: string): () => number {
  let h = 1779033703;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildWorkout(
  date: string,
  games: GameConfig[],
  ratings: Record<string, GameRating>,
  isPro: boolean,
  focusAreas: SkillCategory[]
): DailyWorkout {
  const rand = seededRandom(date + (isPro ? '-pro' : '-free'));
  const pool = isPro ? games : games.filter(g => !g.proOnly);
  const size = isPro ? PRO_WORKOUT_SIZE : FREE_WORKOUT_SIZE;

  const scores = skillScores(games, ratings);

  // Order categories: weakest first, with a nudge toward the user's chosen focus areas
  const cats = Array.from(new Set(pool.map(g => g.category)));
  const catPriority = (c: SkillCategory) =>
    (scores[c] ?? 0) - (focusAreas.includes(c) ? 8 : 0);
  cats.sort((a, b) => catPriority(a) - catPriority(b));

  const chosen: GameConfig[] = [];
  const usedCats = new Set<SkillCategory>();

  // One game per category, weakest categories first
  for (const cat of cats) {
    if (chosen.length >= size) break;
    const candidates = pool.filter(g => g.category === cat);
    if (candidates.length === 0) continue;
    // Prefer least-played game in the category for variety
    candidates.sort(
      (a, b) =>
        (ratings[a.id]?.plays ?? 0) - (ratings[b.id]?.plays ?? 0) || (rand() < 0.5 ? -1 : 1)
    );
    chosen.push(candidates[0]);
    usedCats.add(cat);
  }

  // If still short (few categories), fill with any remaining games
  if (chosen.length < size) {
    const remaining = pool.filter(g => !chosen.includes(g));
    remaining.sort(() => rand() - 0.5);
    chosen.push(...remaining.slice(0, size - chosen.length));
  }

  return { date, gameIds: chosen.slice(0, size).map(g => g.id), completed: [] };
}
