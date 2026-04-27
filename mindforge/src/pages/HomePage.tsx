import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useVocabulary } from '../contexts/VocabularyContext';
import Card from '../components/common/Card';
import ProgressRing from '../components/common/ProgressRing';
import { gameConfigs, categoryInfo } from '../data/games';
import { getToday } from '../utils/helpers';

const HomePage: React.FC = () => {
  const { colors } = useTheme();
  const { user, progressHistory } = useUser();
  const { todaysWords } = useVocabulary();
  const navigate = useNavigate();

  const todayProgress = progressHistory.find(p => p.date === getToday());
  const gamesPlayedToday = todayProgress?.gamesPlayed || 0;
  const dailyGoalProgress = Math.min(100, (gamesPlayedToday / user.dailyGoal) * 100);

  // Recommend games from weakest categories
  const sortedSkills = Object.entries(user.skillLevels)
    .sort(([, a], [, b]) => a - b);
  const weakestCategories = sortedSkills.slice(0, 3).map(([cat]) => cat);
  const recommendedGames = gameConfigs
    .filter(g => weakestCategories.includes(g.category))
    .slice(0, 4);

  return (
    <div style={{ padding: '24px 16px 90px', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '4px' }}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: 800, color: colors.text, margin: 0 }}>
          {user.name} 👋
        </h1>
      </div>

      {/* Daily Progress Card */}
      <Card gradient={colors.gradient1} style={{ marginBottom: '20px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>Daily Progress</p>
            <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px' }}>
              {gamesPlayedToday} / {user.dailyGoal} games
            </h2>
            <p style={{ fontSize: '13px', opacity: 0.8 }}>
              {dailyGoalProgress >= 100 ? 'Goal completed! 🎉' : `${Math.round(dailyGoalProgress)}% complete`}
            </p>
          </div>
          <ProgressRing
            progress={dailyGoalProgress}
            size={72}
            strokeWidth={6}
            color="#FFFFFF"
            bgColor="rgba(255,255,255,0.3)"
          >
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>
              {Math.round(dailyGoalProgress)}%
            </span>
          </ProgressRing>
        </div>
      </Card>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <Card style={{ textAlign: 'center' }} padding="12px">
          <p style={{ fontSize: '22px', fontWeight: 800, color: colors.primary, margin: '0 0 2px' }}>
            {user.streak}
          </p>
          <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0 }}>Day Streak 🔥</p>
        </Card>
        <Card style={{ textAlign: 'center' }} padding="12px">
          <p style={{ fontSize: '22px', fontWeight: 800, color: colors.accent, margin: '0 0 2px' }}>
            {user.level}
          </p>
          <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0 }}>Level ⭐</p>
        </Card>
        <Card style={{ textAlign: 'center' }} padding="12px">
          <p style={{ fontSize: '22px', fontWeight: 800, color: colors.warning, margin: '0 0 2px' }}>
            {user.xp}
          </p>
          <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0 }}>Total XP</p>
        </Card>
      </div>

      {/* Recommended Games */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: 0 }}>
            Recommended For You
          </h2>
          <button
            onClick={() => navigate('/training')}
            style={{
              background: 'none', border: 'none', color: colors.primary,
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            See All
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {recommendedGames.map(game => (
            <Card
              key={game.id}
              onClick={() => navigate(`/play/${game.id}`)}
              style={{ position: 'relative', overflow: 'hidden' }}
              padding="14px"
            >
              <div style={{
                position: 'absolute', top: '-10px', right: '-10px',
                width: '50px', height: '50px', borderRadius: '50%',
                background: game.color, opacity: 0.1,
              }} />
              <span style={{ fontSize: '28px' }}>{game.icon}</span>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: colors.text, margin: '8px 0 4px' }}>
                {game.title}
              </h3>
              <p style={{ fontSize: '11px', color: colors.textSecondary, margin: 0, lineHeight: 1.4 }}>
                {game.description}
              </p>
              <span style={{
                display: 'inline-block', marginTop: '8px', fontSize: '10px', fontWeight: 600,
                padding: '3px 8px', borderRadius: '6px',
                background: `${game.color}20`, color: game.color,
              }}>
                {categoryInfo[game.category]?.name}
              </span>
            </Card>
          ))}
        </div>
      </div>

      {/* Today's Vocabulary */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: 0 }}>
            Today's Words
          </h2>
          <button
            onClick={() => navigate('/vocabulary')}
            style={{
              background: 'none', border: 'none', color: colors.primary,
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            View All
          </button>
        </div>
        {todaysWords.slice(0, 2).map(word => (
          <Card key={word.id} onClick={() => navigate('/vocabulary')} style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: colors.text, margin: '0 0 4px' }}>
                  {word.word}
                </h3>
                <span style={{
                  fontSize: '11px', color: colors.primary, fontWeight: 600,
                  padding: '2px 6px', borderRadius: '4px', background: `${colors.primary}15`,
                }}>
                  {word.partOfSpeech}
                </span>
                <p style={{ fontSize: '13px', color: colors.textSecondary, margin: '8px 0 0', lineHeight: 1.4 }}>
                  {word.definition}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Skills Overview */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: '0 0 12px' }}>
          Skill Overview
        </h2>
        <Card>
          {Object.entries(categoryInfo).map(([key, info]) => {
            const level = user.skillLevels[key as keyof typeof user.skillLevels];
            const percentage = (level / 10) * 100;
            return (
              <div key={key} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '8px 0', borderBottom: key !== 'verbal' ? `1px solid ${colors.border}` : 'none',
              }}>
                <span style={{ fontSize: '20px', width: '28px' }}>{info.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: colors.text }}>{info.name}</span>
                    <span style={{ fontSize: '12px', color: colors.textSecondary }}>
                      Lv {Math.floor(level)}
                    </span>
                  </div>
                  <div style={{
                    height: '6px', borderRadius: '3px', background: colors.bgTertiary, overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: '3px', background: info.color,
                      width: `${percentage}%`, transition: 'width 0.6s ease',
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
