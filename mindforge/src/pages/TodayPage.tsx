import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Play, Check, Sparkles, BookA, ChevronRight } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useVocabulary } from '../contexts/VocabularyContext';
import { gameConfigs } from '../data/games';
import { skillScores, mindforgeQuotient } from '../core/adaptive';
import { getToday } from '../utils/helpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ProgressRing from '../components/ui/ProgressRing';
import CategoryIcon from '../components/ui/CategoryIcon';
import Reveal from '../components/ui/Reveal';
import CoachPanel from '../components/coach/CoachPanel';

const TodayPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, workout, progressHistory } = useUser();
  const { todaysWords } = useVocabulary();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const completed = workout.completed.length;
  const total = workout.gameIds.length;
  const workoutProgress = total > 0 ? completed / total : 0;
  const nextGame = workout.gameIds.find(id => !workout.completed.includes(id));

  const todayEntry = progressHistory.find(p => p.date === getToday());
  const gamesToday = todayEntry?.gamesPlayed ?? 0;

  const mq = mindforgeQuotient(skillScores(gameConfigs, user.gameRatings));

  return (
    <div className="page">
      {/* Editorial hero */}
      <Reveal onScroll={false}>
        <header style={{ marginBottom: 36 }}>
          <p className="eyebrow" style={{ marginBottom: 10 }}>{dateLabel}</p>
          <h1 className="display-hero">
            {greeting},<br />
            <span style={{
              background: 'linear-gradient(110deg, var(--accent), #9B7CF8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {user.name.split(' ')[0]}
            </span>
          </h1>
        </header>
      </Reveal>

      <div className="bento">
        {/* Daily Workout — featured tile */}
        <Reveal onScroll={false} delay={0.08} className="bento-4">
          <Card className="card-glow" style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 22, flexWrap: 'wrap' }}>
              <ProgressRing progress={workoutProgress} size={92} strokeWidth={7}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1 }}>
                    {completed}<span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>/{total}</span>
                  </div>
                </div>
              </ProgressRing>
              <div style={{ flex: 1, minWidth: 180 }}>
                <p className="eyebrow" style={{ marginBottom: 6 }}>Daily workout</p>
                <h2 style={{ fontSize: 21, marginBottom: 4 }}>
                  {completed === total && total > 0 ? 'Complete' : 'Your session today'}
                </h2>
                <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  {completed === 0 && 'Personalized for your weakest skills.'}
                  {completed > 0 && completed < total && `${total - completed} exercise${total - completed > 1 ? 's' : ''} remaining.`}
                  {completed === total && total > 0 && 'Outstanding consistency — see you tomorrow.'}
                </p>
              </div>
              {nextGame && (
                <Button size="lg" onClick={() => navigate(`/play/${nextGame}?workout=1`)}>
                  <Play size={15} /> {completed === 0 ? 'Start' : 'Continue'}
                </Button>
              )}
            </div>

            <hr className="divider" />

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {workout.gameIds.map(id => {
                const g = gameConfigs.find(c => c.id === id);
                if (!g) return null;
                const done = workout.completed.includes(id);
                return (
                  <button
                    key={id}
                    className="list-row"
                    disabled={done}
                    onClick={() => navigate(`/play/${id}?workout=1`)}
                    style={{ opacity: done ? 0.5 : 1 }}
                  >
                    <CategoryIcon category={g.category} boxed boxSize={34} size={16} />
                    <span className="list-row-label" style={{ textDecoration: done ? 'line-through' : 'none' }}>
                      {g.title}
                    </span>
                    {done
                      ? <Check size={16} color="var(--success)" />
                      : <ChevronRight size={16} color="var(--text-secondary)" />}
                  </button>
                );
              })}
            </div>
          </Card>
        </Reveal>

        {/* Right column: Coach + stats */}
        <Reveal onScroll={false} delay={0.16} className="bento-2">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
            <CoachPanel />

            <Card style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
              <Flame size={22} color={user.streak > 0 ? '#FB923C' : 'var(--text-tertiary)'} />
              <div>
                <div className="stat-value" style={{ fontSize: 22 }}>{user.streak}</div>
                <div className="stat-label">Day streak</div>
              </div>
            </Card>

            <Card
              interactive
              style={{ padding: 18, flex: 1 }}
              onClick={() => navigate('/progress')}
            >
              <div className="stat-value" style={{ fontSize: 30, color: 'var(--accent)' }}>{mq}</div>
              <div className="stat-label">MindForge Quotient</div>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
                {gamesToday} session{gamesToday !== 1 ? 's' : ''} today · view analytics →
              </p>
            </Card>
          </div>
        </Reveal>

        {/* Word of the day */}
        {todaysWords.length > 0 && (
          <Reveal delay={0.05} className="bento-4">
            <Card interactive style={{ height: '100%' }} onClick={() => navigate('/vocabulary')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12, background: 'var(--accent-soft)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <BookA size={19} color="var(--accent)" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="eyebrow" style={{ marginBottom: 3 }}>Word of the day</p>
                  <p style={{ fontSize: 16, fontWeight: 600 }}>
                    {todaysWords[0].word}
                    <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}> — {todaysWords[0].definition}</span>
                  </p>
                </div>
                <ChevronRight size={16} color="var(--text-tertiary)" />
              </div>
            </Card>
          </Reveal>
        )}

        {/* Pro upsell */}
        {!user.isPro && (
          <Reveal delay={0.1} className="bento-2">
            <Card interactive onClick={() => navigate('/pro')} style={{ height: '100%', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
                <Sparkles size={20} color="var(--warning)" />
                <p style={{ fontSize: 15, fontWeight: 600 }}>Train at full capacity</p>
                <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>
                  All {gameConfigs.length} exercises, 5-game workouts.
                </p>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--warning)', marginTop: 'auto' }}>
                  Explore Pro →
                </span>
              </div>
            </Card>
          </Reveal>
        )}
      </div>
    </div>
  );
};

export default TodayPage;
