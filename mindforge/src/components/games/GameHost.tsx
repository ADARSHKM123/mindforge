import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Clock, Gauge, Trophy, TrendingUp, ArrowRight, RotateCcw, Lock } from 'lucide-react';
import { gameConfigs, categoryInfo } from '../../data/games';
import { useUser } from '../../contexts/UserContext';
import { difficultyOf } from '../../core/adaptive';
import { buildQuiz, QuizSpec } from '../../games/generators';
import { calculateXP, getToday } from '../../utils/helpers';
import { SessionSummary } from '../../types';
import Button from '../ui/Button';
import CategoryIcon, { categoryColor } from '../ui/CategoryIcon';
import QuizEngine from './QuizEngine';
import MemoryBoard from './MemoryBoard';
import SequenceRecall from './SequenceRecall';

const GameHost: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inWorkout = searchParams.get('workout') === '1';
  const { user, addGameResult, workout, markWorkoutGame } = useUser();

  const config = gameConfigs.find(g => g.id === gameId);
  const [phase, setPhase] = useState<'intro' | 'playing' | 'result'>('intro');
  const [summary, setSummary] = useState<SessionSummary | null>(null);
  const [sessionKey, setSessionKey] = useState(0);
  const levelBeforeRef = useRef(0);

  const level = difficultyOf(user.gameRatings[gameId ?? '']);

  // Build the quiz spec once per session so questions don't reshuffle on re-render
  const quizSpec = useMemo<QuizSpec | null>(
    () => (config?.mode === 'quiz' ? buildQuiz(config.id, level) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config?.id, sessionKey]
  );

  if (!config) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 80 }}>
        <h2>Game not found</h2>
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/training')}>Back to Training</Button>
      </div>
    );
  }

  const locked = config.proOnly && !user.isPro;
  const color = categoryColor(config.category);
  const parMs = quizSpec?.parMsPerQuestion ?? 4000;

  const handleComplete = (s: SessionSummary) => {
    levelBeforeRef.current = level;
    setSummary(s);
    const xp = calculateXP(s.score, s.maxScore, level);
    addGameResult({
      gameId: config.id,
      category: config.category,
      score: s.score,
      maxScore: s.maxScore,
      accuracy: Math.round(s.accuracy * 100),
      timeSpent: s.timeSpent,
      avgResponseMs: Math.round(s.avgResponseMs),
      date: getToday(),
      xpEarned: xp,
    }, parMs);
    if (inWorkout) markWorkoutGame(config.id);
    setPhase('result');
  };

  const replay = () => {
    setSummary(null);
    setSessionKey(k => k + 1);
    setPhase('playing');
  };

  // ===== Pro gate =====
  if (locked) {
    return (
      <div className="page" style={{ textAlign: 'center', paddingTop: 80, maxWidth: 400 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18, background: 'var(--warning-soft)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <Lock size={26} color="var(--warning)" />
        </div>
        <h2 style={{ marginBottom: 8 }}>{config.title} is a Pro exercise</h2>
        <p className="text-secondary" style={{ marginBottom: 24 }}>
          Unlock all {gameConfigs.length} exercises, the full 5-game daily workout and complete progress analytics.
        </p>
        <Button size="lg" fullWidth onClick={() => navigate('/pro')}>See Pro plans</Button>
        <Button variant="ghost" fullWidth style={{ marginTop: 8 }} onClick={() => navigate('/training')}>Back</Button>
      </div>
    );
  }

  // ===== Intro =====
  if (phase === 'intro') {
    return (
      <div className="page" style={{ maxWidth: 480, textAlign: 'center', paddingTop: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <CategoryIcon category={config.category} boxed boxSize={72} size={32} />
        </div>
        <span className="badge" style={{ marginBottom: 12 }}>{categoryInfo[config.category].name}</span>
        <h1 style={{ fontSize: 28, marginBottom: 10 }}>{config.title}</h1>
        <p className="text-secondary" style={{ marginBottom: 6 }}>{config.description}</p>
        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 28 }}>{config.benefit}</p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: 'var(--text-secondary)' }}>
            <Clock size={15} /> {config.duration}s
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: 'var(--text-secondary)' }}>
            <Gauge size={15} /> Level {level} / 10
          </span>
        </div>

        <Button size="lg" fullWidth onClick={() => setPhase('playing')}>Start</Button>
        <Button variant="ghost" fullWidth style={{ marginTop: 8 }} onClick={() => navigate(inWorkout ? '/home' : '/training')}>
          Back
        </Button>
      </div>
    );
  }

  // ===== Result =====
  if (phase === 'result' && summary) {
    const accuracyPct = Math.round(summary.accuracy * 100);
    const xp = calculateXP(summary.score, summary.maxScore, levelBeforeRef.current);
    const newLevel = difficultyOf(user.gameRatings[config.id]);
    const levelChanged = newLevel !== levelBeforeRef.current;

    const remainingWorkout = workout.gameIds.filter(id => !workout.completed.includes(id));
    const nextWorkoutGame = inWorkout ? remainingWorkout[0] : undefined;
    const workoutDone = inWorkout && remainingWorkout.length === 0;

    const headline = accuracyPct >= 85 ? 'Excellent session' : accuracyPct >= 65 ? 'Solid work' : accuracyPct >= 45 ? 'Good effort' : 'Keep training';

    return (
      <div className="page" style={{ maxWidth: 440, textAlign: 'center', paddingTop: 56 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 18,
          background: `color-mix(in srgb, ${color} 12%, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
        }}>
          <Trophy size={28} color={color} />
        </div>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>{headline}</h1>
        <p className="text-secondary" style={{ marginBottom: 28 }}>{config.title} complete</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div className="card" style={{ padding: 16 }}>
            <div className="stat-value">{summary.score}<span style={{ fontSize: 15, color: 'var(--text-tertiary)' }}> / {summary.maxScore}</span></div>
            <div className="stat-label">Score</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="stat-value">{accuracyPct}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="stat-value" style={{ color: 'var(--accent)' }}>+{xp}</div>
            <div className="stat-label">XP earned</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="stat-value">{summary.timeSpent}s</div>
            <div className="stat-label">Time</div>
          </div>
        </div>

        {levelChanged && (
          <div className="badge badge-accent" style={{ marginBottom: 24 }}>
            <TrendingUp size={13} />
            Difficulty {newLevel > levelBeforeRef.current ? 'increased' : 'adjusted'}: level {levelBeforeRef.current} → {newLevel}
          </div>
        )}

        {workoutDone && (
          <div className="card" style={{ marginBottom: 20, background: 'var(--success-soft)', borderColor: 'var(--success)' }}>
            <p style={{ fontWeight: 700, color: 'var(--success)' }}>Daily workout complete</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {workout.gameIds.length} exercises finished — see you tomorrow.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {nextWorkoutGame && (
            <Button size="lg" fullWidth onClick={() => {
              setPhase('intro');
              setSummary(null);
              setSessionKey(k => k + 1);
              navigate(`/play/${nextWorkoutGame}?workout=1`);
            }}>
              Next exercise <ArrowRight size={16} />
            </Button>
          )}
          {!inWorkout && (
            <Button size="lg" fullWidth onClick={replay}>
              <RotateCcw size={16} /> Play again
            </Button>
          )}
          <Button variant="secondary" fullWidth onClick={() => navigate(inWorkout ? '/home' : '/training')}>
            {inWorkout ? 'Back to Today' : 'Back to Training'}
          </Button>
        </div>
      </div>
    );
  }

  // ===== Playing =====
  const exit = () => navigate(inWorkout ? '/home' : '/training');

  if (config.mode === 'memory-board') {
    return (
      <MemoryBoard
        key={sessionKey}
        level={level}
        variant={config.id === 'symbol-pairs' ? 'symbols' : 'shapes'}
        duration={config.duration}
        accentColor={color}
        onComplete={handleComplete}
        onExit={exit}
      />
    );
  }

  if (config.mode === 'sequence') {
    return (
      <SequenceRecall
        key={sessionKey}
        level={level}
        variant={config.id === 'pattern-recall' ? 'advanced' : 'standard'}
        duration={config.duration}
        accentColor={color}
        onComplete={handleComplete}
        onExit={exit}
      />
    );
  }

  return (
    <QuizEngine
      key={sessionKey}
      spec={quizSpec!}
      duration={config.duration}
      accentColor={color}
      onComplete={handleComplete}
      onExit={exit}
    />
  );
};

export default GameHost;
