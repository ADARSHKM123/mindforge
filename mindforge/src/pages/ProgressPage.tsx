import React from 'react';
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { Award, Lock } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { gameConfigs, categoryInfo, achievements as allAchievements } from '../data/games';
import { skillScores, mindforgeQuotient } from '../core/adaptive';
import { SkillCategory } from '../types';
import Card from '../components/ui/Card';
import CategoryIcon from '../components/ui/CategoryIcon';
import Reveal from '../components/ui/Reveal';

const ProgressPage: React.FC = () => {
  const { user, progressHistory } = useUser();

  const scores = skillScores(gameConfigs, user.gameRatings);
  const mq = mindforgeQuotient(scores);
  const categories = Object.keys(categoryInfo) as SkillCategory[];

  const radarData = categories.map(cat => ({
    skill: categoryInfo[cat].name,
    score: scores[cat] ?? 0,
  }));

  // Last 14 days of activity
  const days: { day: string; sessions: number; xp: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const entry = progressHistory.find(p => p.date === key);
    days.push({
      day: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      sessions: entry?.gamesPlayed ?? 0,
      xp: entry?.totalXP ?? 0,
    });
  }

  const unlockedIds = new Set(user.achievements.map(a => a.id));

  return (
    <div className="page">
      <Reveal onScroll={false}>
        <header className="page-header">
          <p className="eyebrow" style={{ marginBottom: 8 }}>Analytics</p>
          <h1 className="page-title">Progress</h1>
          <p className="page-subtitle">Your cognitive performance across all six skills.</p>
        </header>
      </Reveal>

      <div className="bento">
        {/* MQ — hero metric */}
        <Reveal onScroll={false} delay={0.08} className="bento-3">
          <Card className="card-glow" style={{
            height: '100%', display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 32,
          }}>
            <p className="eyebrow">MindForge Quotient</p>
            <p style={{
              fontSize: 'clamp(56px, 8vw, 84px)', fontWeight: 600, letterSpacing: '-0.045em',
              lineHeight: 1.05, margin: '8px 0 4px',
              background: 'linear-gradient(110deg, var(--accent), #9B7CF8)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              {mq}
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>out of 600 — rises with your adaptive levels</p>
            <hr className="divider" style={{ width: '100%' }} />
            <div style={{ display: 'flex', gap: 28 }}>
              <div>
                <div className="stat-value" style={{ fontSize: 19 }}>{user.totalGamesPlayed}</div>
                <div className="stat-label">Sessions</div>
              </div>
              <div>
                <div className="stat-value" style={{ fontSize: 19 }}>{user.totalTrainingMinutes}</div>
                <div className="stat-label">Minutes</div>
              </div>
              <div>
                <div className="stat-value" style={{ fontSize: 19 }}>{user.longestStreak}</div>
                <div className="stat-label">Best streak</div>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* Radar */}
        <Reveal onScroll={false} delay={0.16} className="bento-3">
          <Card style={{ height: '100%', minHeight: 300 }}>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Skill map</p>
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="skill" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <Radar dataKey="score" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.22} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </Card>
        </Reveal>

        {/* Activity chart */}
        <Reveal className="bento-6">
          <Card>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Last 14 days</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={days} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--text-tertiary)', fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                <Tooltip
                  cursor={{ fill: 'var(--bg-subtle)' }}
                  contentStyle={{
                    background: 'var(--card-solid)', border: '1px solid var(--border)',
                    borderRadius: 12, fontSize: 13, color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="sessions" fill="var(--accent)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Reveal>

        {/* Per-skill breakdown */}
        <Reveal className="bento-3">
          <Card style={{ height: '100%' }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Skills</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
              {categories.map(cat => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CategoryIcon category={cat} boxed boxSize={34} size={16} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600 }}>{categoryInfo[cat].name}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>{scores[cat] ?? 0}</span>
                    </div>
                    <div className="progress-track" style={{ height: 5 }}>
                      <div
                        className="progress-fill"
                        style={{ width: `${scores[cat] ?? 0}%`, background: categoryInfo[cat].cssVar, boxShadow: 'none' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Reveal>

        {/* Achievements */}
        <Reveal className="bento-3">
          <Card style={{ height: '100%' }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>
              Achievements · {user.achievements.length} / {allAchievements.length}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8 }}>
              {allAchievements.map(a => {
                const unlocked = unlockedIds.has(a.id);
                return (
                  <div
                    key={a.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                      borderRadius: 12, border: '1px solid var(--border)',
                      opacity: unlocked ? 1 : 0.45,
                      background: unlocked ? 'var(--accent-soft)' : 'transparent',
                    }}
                  >
                    {unlocked
                      ? <Award size={17} color="var(--accent)" style={{ flexShrink: 0 }} />
                      : <Lock size={15} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600 }}>{a.title}</p>
                      <p style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{a.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
};

export default ProgressPage;
