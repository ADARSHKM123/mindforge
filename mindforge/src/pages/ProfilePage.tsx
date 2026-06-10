import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Sparkles, Trash2, Check } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatDate } from '../utils/helpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const goalOptions = [3, 5, 10];

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser, resetAllData } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [confirmReset, setConfirmReset] = useState(false);

  const initials = user.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const xpProgress = user.xpToNextLevel > 0
    ? Math.min(1, (user.xp - 0) / (user.xp + user.xpToNextLevel)) : 0;

  return (
    <div className="page" style={{ maxWidth: 640 }}>
      <header className="page-header">
        <p className="eyebrow" style={{ marginBottom: 8 }}>Account</p>
        <h1 className="page-title">Profile</h1>
      </header>

      {/* Identity */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--accent), #7C5AF5)',
            color: '#FFFFFF', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 20, fontWeight: 700, flexShrink: 0,
            boxShadow: 'var(--glow-accent)',
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ fontSize: 18 }}>{user.name}</h2>
              {user.isPro && <span className="badge badge-pro">PRO</span>}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Member since {formatDate(user.joinDate)}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="stat-value" style={{ fontSize: 20 }}>Lv {user.level}</div>
            <div className="stat-label">{user.xpToNextLevel} XP to next</div>
          </div>
        </div>
        <div className="progress-track" style={{ marginTop: 14 }}>
          <div className="progress-fill" style={{ width: `${Math.round(xpProgress * 100)}%` }} />
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 16 }}>
        {[
          { value: user.totalGamesPlayed, label: 'Sessions' },
          { value: user.totalTrainingMinutes, label: 'Minutes trained' },
          { value: user.longestStreak, label: 'Longest streak' },
          { value: user.achievements.length, label: 'Achievements' },
        ].map(s => (
          <Card key={s.label} style={{ padding: 16, textAlign: 'center' }}>
            <div className="stat-value" style={{ fontSize: 20 }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <Card style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>Settings</h2>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div>
            <p style={{ fontSize: 14.5, fontWeight: 600 }}>Appearance</p>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{theme === 'dark' ? 'Dark' : 'Light'} theme</p>
          </div>
          <Button variant="secondary" size="sm" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            {theme === 'dark' ? 'Light' : 'Dark'}
          </Button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 14.5, fontWeight: 600 }}>Daily goal</p>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>Sessions per day</p>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {goalOptions.map(g => (
              <button
                key={g}
                className={`badge ${user.dailyGoal === g ? 'badge-accent' : ''}`}
                style={{ cursor: 'pointer', border: 'none', padding: '7px 14px', fontSize: 13 }}
                onClick={() => updateUser({ dailyGoal: g })}
              >
                {user.dailyGoal === g && <Check size={12} />} {g}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Subscription */}
      <Card style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Subscription</h2>
        {user.isPro ? (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            <Sparkles size={14} color="var(--warning)" style={{ verticalAlign: -2, marginRight: 6 }} />
            You're on <strong style={{ color: 'var(--text-primary)' }}>MindForge Pro</strong> — every exercise, the full workout and complete analytics are unlocked.
          </p>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)' }}>
              Free plan — {`3-game workout, ${13} of 25 exercises`}
            </p>
            <Button size="sm" onClick={() => navigate('/pro')}>
              <Sparkles size={13} /> Upgrade
            </Button>
          </div>
        )}
      </Card>

      {/* Danger zone */}
      <Card>
        <h2 style={{ fontSize: 16, marginBottom: 12 }}>Data</h2>
        {!confirmReset ? (
          <Button variant="secondary" size="sm" style={{ color: 'var(--error)' }} onClick={() => setConfirmReset(true)}>
            <Trash2 size={14} /> Reset all progress
          </Button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 13.5, color: 'var(--error)', fontWeight: 600 }}>
              This permanently deletes all progress. Are you sure?
            </p>
            <Button variant="secondary" size="sm" onClick={() => setConfirmReset(false)}>Cancel</Button>
            <Button size="sm" style={{ background: 'var(--error)' }} onClick={resetAllData}>Yes, reset</Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProfilePage;
