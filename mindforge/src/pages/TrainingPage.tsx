import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import { gameConfigs, categoryInfo } from '../data/games';
import { SkillCategory } from '../types';

const TrainingPage: React.FC = () => {
  const { colors } = useTheme();
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');

  const categories = Object.entries(categoryInfo);
  const filteredGames = selectedCategory === 'all'
    ? gameConfigs
    : gameConfigs.filter(g => g.category === selectedCategory);

  return (
    <div style={{ padding: '24px 16px 90px', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: colors.text, margin: '0 0 4px' }}>
        Training
      </h1>
      <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '0 0 20px' }}>
        Choose a category to start training
      </p>

      {/* Category Filter */}
      <div style={{
        display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px',
        scrollbarWidth: 'none',
      }}>
        <button
          onClick={() => setSelectedCategory('all')}
          style={{
            padding: '8px 16px', borderRadius: '20px', border: 'none',
            background: selectedCategory === 'all' ? colors.primary : colors.bgTertiary,
            color: selectedCategory === 'all' ? '#fff' : colors.textSecondary,
            fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            transition: 'all 0.2s',
          }}
        >
          All Games
        </button>
        {categories.map(([key, info]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key as SkillCategory)}
            style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none',
              background: selectedCategory === key ? info.color : colors.bgTertiary,
              color: selectedCategory === key ? '#fff' : colors.textSecondary,
              fontSize: '13px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
          >
            {info.icon} {info.name}
          </button>
        ))}
      </div>

      {/* Category Cards (when All is selected) */}
      {selectedCategory === 'all' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
          {categories.map(([key, info]) => {
            const level = user.skillLevels[key as SkillCategory];
            return (
              <Card
                key={key}
                onClick={() => setSelectedCategory(key as SkillCategory)}
                padding="14px"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <div style={{
                  position: 'absolute', top: '-15px', right: '-15px',
                  width: '60px', height: '60px', borderRadius: '50%',
                  background: info.color, opacity: 0.12,
                }} />
                <span style={{ fontSize: '32px' }}>{info.icon}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: '8px 0 2px' }}>
                  {info.name}
                </h3>
                <p style={{ fontSize: '11px', color: colors.textSecondary, margin: '0 0 8px', lineHeight: 1.3 }}>
                  {info.description}
                </p>
                <div style={{
                  height: '4px', borderRadius: '2px', background: colors.bgTertiary,
                }}>
                  <div style={{
                    height: '100%', borderRadius: '2px', background: info.color,
                    width: `${(level / 10) * 100}%`, transition: 'width 0.4s ease',
                  }} />
                </div>
                <p style={{ fontSize: '10px', color: info.color, fontWeight: 600, margin: '4px 0 0' }}>
                  Level {Math.floor(level)}
                </p>
              </Card>
            );
          })}
        </div>
      )}

      {/* Game List */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.text, margin: '0 0 12px' }}>
        {selectedCategory === 'all' ? 'All Games' : `${categoryInfo[selectedCategory].name} Games`}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredGames.map(game => (
          <Card key={game.id} onClick={() => navigate(`/play/${game.id}`)} padding="14px">
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '14px',
                background: `${game.color}18`, display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                flexShrink: 0,
              }}>
                {game.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: colors.text, margin: '0 0 3px' }}>
                  {game.title}
                </h3>
                <p style={{ fontSize: '12px', color: colors.textSecondary, margin: 0 }}>
                  {game.description}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '6px',
                  background: game.difficulty === 'hard' ? `${colors.error}20` :
                    game.difficulty === 'medium' ? `${colors.warning}20` : `${colors.success}20`,
                  color: game.difficulty === 'hard' ? colors.error :
                    game.difficulty === 'medium' ? colors.warning : colors.success,
                  textTransform: 'capitalize',
                }}>
                  {game.difficulty}
                </span>
                <p style={{ fontSize: '11px', color: colors.textTertiary, margin: '4px 0 0' }}>
                  {game.duration}s
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrainingPage;
