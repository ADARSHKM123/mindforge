export function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function calculateXP(score: number, maxScore: number, difficulty: string): number {
  const base = Math.round((score / maxScore) * 100);
  const multiplier = difficulty === 'hard' ? 1.5 : difficulty === 'medium' ? 1.2 : 1;
  return Math.round(base * multiplier);
}

export function getLevel(xp: number): { level: number; xpInLevel: number; xpToNext: number } {
  let level = 1;
  let xpNeeded = 100;
  let totalXP = 0;
  while (totalXP + xpNeeded <= xp) {
    totalXP += xpNeeded;
    level++;
    xpNeeded = Math.round(xpNeeded * 1.3);
  }
  return { level, xpInLevel: xp - totalXP, xpToNext: xpNeeded };
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getStreakDays(progressHistory: { date: string }[]): number {
  if (progressHistory.length === 0) return 0;
  const dates = progressHistory.map(p => p.date).sort().reverse();
  const today = getToday();
  if (dates[0] !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (dates[0] !== yesterday.toISOString().split('T')[0]) return 0;
  }
  let streak = 1;
  for (let i = 1; i < dates.length; i++) {
    const curr = new Date(dates[i - 1]);
    const prev = new Date(dates[i]);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

// Spaced repetition - SM-2 algorithm
export function calculateNextReview(quality: number, easeFactor: number, interval: number): { easeFactor: number; interval: number; nextDate: string } {
  let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;
  let newInterval: number;
  if (quality < 3) {
    newInterval = 1;
  } else if (interval === 1) {
    newInterval = 1;
  } else if (interval <= 1) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEF);
  }
  const next = new Date();
  next.setDate(next.getDate() + newInterval);
  return { easeFactor: newEF, interval: newInterval, nextDate: next.toISOString().split('T')[0] };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
