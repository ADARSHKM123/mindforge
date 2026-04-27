import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import ProgressRing from '../components/common/ProgressRing';
import { categoryInfo } from '../data/games';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

type TimeRange = '7d' | '30d' | 'all';

const ProfilePage: React.FC = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, progressHistory, updateUser } = useUser();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const xpProgress = user.xpToNextLevel > 0
    ? ((user.xp % user.xpToNextLevel) / user.xpToNextLevel) * 100
    : 0;

  // Filter progress by time range
  const now = new Date();
  const filteredProgress = progressHistory.filter(p => {
    const d = new Date(p.date);
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    if (timeRange === '7d') return diff <= 7;
    if (timeRange === '30d') return diff <= 30;
    return true;
  });

  // Chart data
  const chartData = filteredProgress.map(p => ({
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: p.gamesPlayed > 0 ? Math.round(p.totalScore / p.gamesPlayed * 10) : 0,
    games: p.gamesPlayed,
    xp: p.totalXP,
  }));

  // Skill radar data
  const skillData = Object.entries(user.skillLevels).map(([key, value]) => ({
    skill: categoryInfo[key]?.name || key,
    level: Math.round(value * 10) / 10,
    color: categoryInfo[key]?.color || '#666',
    icon: categoryInfo[key]?.icon || '',
  }));

  // Stats summary
  const totalStats = {
    games: filteredProgress.reduce((s, p) => s + p.gamesPlayed, 0),
    xp: filteredProgress.reduce((s, p) => s + p.totalXP, 0),
    minutes: Math.round(filteredProgress.reduce((s, p) => s + p.timeSpent, 0) / 60),
  };

  const avatars = ['🧠', '🦁', '🦊', '🐱', '🐶', '🦉', '🐼', '🦈', '🚀', '⚡', '🌟', '🔥'];

  return (
    <div style={{ padding: '24px 16px 90px', maxWidth: '480px', margin: '0 auto' }}>
      {/* Profile Header */}
      <Card gradient={colors.gradient1} style={{ marginBottom: '20px', color: '#fff', textAlign: 'center' }}
        padding="24px">
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '36px',
          margin: '0 auto 12px', border: '3px solid rgba(255,255,255,0.4)',
        }}>
          {user.avatar}
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px' }}>{user.name}</h1>
        <p style={{ fontSize: '14px', opacity: 0.85, margin: '0 0 16px' }}>Level {user.level} Learner</p>

        <ProgressRing progress={xpProgress} size={64} strokeWidth={5} color="#fff" bgColor="rgba(255,255,255,0.25)">
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>{Math.round(xpProgress)}%</span>
        </ProgressRing>
        <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>
          {user.xp} XP · {user.xpToNextLevel - (user.xp % user.xpToNextLevel)} to next level
        </p>
      </Card>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px', marginBottom: '20px' }}>
        {[
          { value: user.streak, label: 'Streak', icon: '🔥' },
          { value: user.totalGamesPlayed, label: 'Games', icon: '🎮' },
          { value: user.level, label: 'Level', icon: '⭐' },
          { value: user.totalTrainingMinutes, label: 'Minutes', icon: '⏱️' },
        ].map(stat => (
          <Card key={stat.label} style={{ textAlign: 'center' }} padding="10px">
            <p style={{ fontSize: '10px', margin: '0 0 2px' }}>{stat.icon}</p>
            <p style={{ fontSize: '18px', fontWeight: 800, color: colors.primary, margin: '0 0 2px' }}>{stat.value}</p>
            <p style={{ fontSize: '10px', color: colors.textSecondary, margin: 0 }}>{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Time Range Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['7d', '30d', 'all'] as TimeRange[]).map(range => (
          <button key={range} onClick={() => setTimeRange(range)}
            style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
              background: timeRange === range ? colors.primary : colors.bgTertiary,
              color: timeRange === range ? '#fff' : colors.textSecondary,
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
          </button>
        ))}
      </div>

      {/* Period Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <Card style={{ textAlign: 'center' }} padding="12px">
          <p style={{ fontSize: '20px', fontWeight: 800, color: colors.accent, margin: '0 0 2px' }}>{totalStats.games}</p>
          <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0 }}>Games</p>
        </Card>
        <Card style={{ textAlign: 'center' }} padding="12px">
          <p style={{ fontSize: '20px', fontWeight: 800, color: colors.warning, margin: '0 0 2px' }}>{totalStats.xp}</p>
          <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0 }}>XP</p>
        </Card>
        <Card style={{ textAlign: 'center' }} padding="12px">
          <p style={{ fontSize: '20px', fontWeight: 800, color: colors.error, margin: '0 0 2px' }}>{totalStats.minutes}</p>
          <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0 }}>Minutes</p>
        </Card>
      </div>

      {/* Progress Chart */}
      {chartData.length > 0 && (
        <Card style={{ marginBottom: '20px' }} padding="16px">
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: '0 0 12px' }}>
            Activity
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: colors.textSecondary }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: colors.card, border: `1px solid ${colors.border}`,
                  borderRadius: '8px', fontSize: '12px', color: colors.text,
                }}
              />
              <Bar dataKey="games" fill={colors.primary} radius={[4, 4, 0, 0]} name="Games" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* XP Chart */}
      {chartData.length > 1 && (
        <Card style={{ marginBottom: '20px' }} padding="16px">
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: '0 0 12px' }}>
            XP Progress
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: colors.textSecondary }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: colors.card, border: `1px solid ${colors.border}`,
                  borderRadius: '8px', fontSize: '12px', color: colors.text,
                }}
              />
              <Line type="monotone" dataKey="xp" stroke={colors.accent} strokeWidth={2} dot={{ fill: colors.accent, r: 3 }} name="XP" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Skill Levels */}
      <Card style={{ marginBottom: '20px' }} padding="16px">
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: '0 0 16px' }}>
          Skill Levels
        </h3>
        {skillData.map(skill => (
          <div key={skill.skill} style={{
            display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px',
          }}>
            <span style={{ fontSize: '20px', width: '28px' }}>{skill.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{skill.skill}</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: skill.color }}>
                  {skill.level.toFixed(1)} / 10
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '4px', background: colors.bgTertiary }}>
                <div style={{
                  height: '100%', borderRadius: '4px', background: skill.color,
                  width: `${(skill.level / 10) * 100}%`, transition: 'width 0.6s ease',
                }} />
              </div>
            </div>
          </div>
        ))}
      </Card>

      {/* Achievements */}
      <Card style={{ marginBottom: '20px' }} padding="16px">
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: '0 0 16px' }}>
          Achievements ({user.achievements.length})
        </h3>
        {user.achievements.length === 0 ? (
          <p style={{ fontSize: '13px', color: colors.textSecondary, textAlign: 'center', padding: '16px 0' }}>
            Play games to unlock achievements! 🏆
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {user.achievements.map(a => (
              <div key={a.id} style={{
                padding: '12px', borderRadius: '10px', background: colors.bgTertiary, textAlign: 'center',
              }}>
                <span style={{ fontSize: '24px' }}>{a.icon}</span>
                <p style={{ fontSize: '12px', fontWeight: 700, color: colors.text, margin: '4px 0 2px' }}>{a.title}</p>
                <p style={{ fontSize: '10px', color: colors.textSecondary, margin: 0 }}>{a.description}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Settings Section */}
      <Card padding="16px">
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: '0 0 16px' }}>
          Settings
        </h3>

        {/* Avatar Selection */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.textSecondary, margin: '0 0 8px' }}>Avatar</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {avatars.map(a => (
              <button key={a} onClick={() => updateUser({ avatar: a })}
                style={{
                  width: '40px', height: '40px', borderRadius: '10px', border: 'none',
                  background: user.avatar === a ? `${colors.primary}20` : colors.bgTertiary,
                  fontSize: '20px', cursor: 'pointer',
                  outline: user.avatar === a ? `2px solid ${colors.primary}` : 'none',
                }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Goal */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: colors.textSecondary, margin: '0 0 8px' }}>
            Daily Goal: {user.dailyGoal} games
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[3, 5, 7, 10].map(goal => (
              <button key={goal} onClick={() => updateUser({ dailyGoal: goal })}
                style={{
                  flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                  background: user.dailyGoal === goal ? colors.primary : colors.bgTertiary,
                  color: user.dailyGoal === goal ? '#fff' : colors.textSecondary,
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                }}>
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Toggle */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 0', borderTop: `1px solid ${colors.border}`,
        }}>
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: colors.text, margin: '0 0 2px' }}>
              {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </p>
            <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
              Toggle appearance
            </p>
          </div>
          <button
            onClick={toggleTheme}
            style={{
              width: '52px', height: '28px', borderRadius: '14px', border: 'none',
              background: theme === 'dark' ? colors.primary : colors.bgTertiary,
              position: 'relative', cursor: 'pointer', transition: 'background 0.3s',
            }}
          >
            <div style={{
              width: '22px', height: '22px', borderRadius: '50%', background: '#fff',
              position: 'absolute', top: '3px',
              left: theme === 'dark' ? '27px' : '3px',
              transition: 'left 0.3s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
