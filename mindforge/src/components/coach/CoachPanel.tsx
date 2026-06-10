import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { gameConfigs, categoryInfo } from '../../data/games';
import { skillScores } from '../../core/adaptive';
import { getToday } from '../../utils/helpers';
import { SkillCategory } from '../../types';
import Card from '../ui/Card';

/**
 * Coach — an agent-style insight panel.
 * Currently powered by on-device heuristics over your training data,
 * streamed token-by-token; designed so an LLM backend can drop in later.
 */
function buildInsight(
  name: string,
  streak: number,
  gamesToday: number,
  dailyGoal: number,
  workoutRemaining: number,
  scores: Record<SkillCategory, number>
): string {
  const cats = Object.keys(scores) as SkillCategory[];
  const weakest = cats.reduce((a, b) => (scores[a] ?? 0) <= (scores[b] ?? 0) ? a : b);
  const strongest = cats.reduce((a, b) => (scores[a] ?? 0) >= (scores[b] ?? 0) ? a : b);

  const parts: string[] = [];

  if (gamesToday === 0) {
    parts.push(`Welcome back, ${name}. Your mind is freshest in the first session of the day — a perfect moment to start.`);
  } else if (workoutRemaining > 0) {
    parts.push(`Strong start today — ${workoutRemaining} exercise${workoutRemaining > 1 ? 's' : ''} left in your workout. Finishing it keeps your adaptive levels climbing.`);
  } else {
    parts.push(`Workout complete — excellent discipline. Anything you train now is a bonus rep for your weakest skills.`);
  }

  if (scores[strongest] - scores[weakest] >= 8) {
    parts.push(`Your ${categoryInfo[strongest].name} is pulling ahead, while ${categoryInfo[weakest].name} is lagging — I've weighted today's session toward ${categoryInfo[weakest].name} to close that gap.`);
  } else {
    parts.push(`Your skills are developing evenly — that balance is exactly what long-term cognitive training should look like.`);
  }

  if (streak >= 3) {
    parts.push(`You're on a ${streak}-day streak. Consistency is the single strongest predictor of improvement — protect it.`);
  } else if (gamesToday >= dailyGoal) {
    parts.push(`Daily goal hit: ${gamesToday}/${dailyGoal} sessions. Tomorrow extends the streak.`);
  }

  return parts.join(' ');
}

const CoachPanel: React.FC = () => {
  const { user, workout, progressHistory } = useUser();
  const gamesToday = progressHistory.find(p => p.date === getToday())?.gamesPlayed ?? 0;
  const workoutRemaining = workout.gameIds.length - workout.completed.length;

  const message = useMemo(
    () => buildInsight(
      user.name.split(' ')[0],
      user.streak,
      gamesToday,
      user.dailyGoal,
      workoutRemaining,
      skillScores(gameConfigs, user.gameRatings)
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gamesToday, workoutRemaining, user.streak]
  );

  const [shown, setShown] = useState('');
  const indexRef = useRef(0);

  // Stream the insight word-by-word, like a live agent response
  useEffect(() => {
    setShown('');
    indexRef.current = 0;
    const words = message.split(' ');
    const id = setInterval(() => {
      indexRef.current += 1;
      setShown(words.slice(0, indexRef.current).join(' '));
      if (indexRef.current >= words.length) clearInterval(id);
    }, 38);
    return () => clearInterval(id);
  }, [message]);

  const streaming = shown.length < message.length;

  return (
    <Card className="coach-panel card-glow" style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'linear-gradient(135deg, var(--accent), #7C5AF5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--glow-accent)', flexShrink: 0,
        }}>
          <Sparkles size={15} color="#fff" />
        </div>
        <span className="eyebrow" style={{ color: 'var(--accent)' }}>Coach</span>
      </div>
      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-secondary)', minHeight: 48 }}>
        {shown}
        {streaming && <span className="coach-cursor" />}
      </p>
    </Card>
  );
};

export default CoachPanel;
