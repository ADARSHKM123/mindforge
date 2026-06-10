import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Gauge } from 'lucide-react';
import { gameConfigs, categoryInfo } from '../data/games';
import { useUser } from '../contexts/UserContext';
import { difficultyOf } from '../core/adaptive';
import { SkillCategory } from '../types';
import Card from '../components/ui/Card';
import CategoryIcon from '../components/ui/CategoryIcon';
import Reveal from '../components/ui/Reveal';

const categories = Object.keys(categoryInfo) as SkillCategory[];

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [filter, setFilter] = useState<SkillCategory | 'all'>('all');

  const visible = filter === 'all' ? gameConfigs : gameConfigs.filter(g => g.category === filter);
  const grouped = categories
    .map(cat => ({ cat, games: visible.filter(g => g.category === cat) }))
    .filter(group => group.games.length > 0);

  return (
    <div className="page">
      <Reveal onScroll={false}>
        <header className="page-header">
          <p className="eyebrow" style={{ marginBottom: 8 }}>Exercise library</p>
          <h1 className="page-title">Training</h1>
          <p className="page-subtitle">{gameConfigs.length} exercises across {categories.length} cognitive skills — difficulty adapts to you.</p>
        </header>
      </Reveal>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        <button
          className={`badge ${filter === 'all' ? 'badge-accent' : ''}`}
          style={{ cursor: 'pointer', border: 'none', padding: '7px 14px', fontSize: 13 }}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`badge ${filter === cat ? 'badge-accent' : ''}`}
            style={{ cursor: 'pointer', border: 'none', padding: '7px 14px', fontSize: 13 }}
            onClick={() => setFilter(filter === cat ? 'all' : cat)}
          >
            <CategoryIcon category={cat} size={13} />
            {categoryInfo[cat].name}
          </button>
        ))}
      </div>

      {grouped.map(({ cat, games }) => (
        <Reveal key={cat}>
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
            <h2 style={{ fontSize: 17 }}>{categoryInfo[cat].name}</h2>
            <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>{categoryInfo[cat].description}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {games.map(game => {
              const locked = game.proOnly && !user.isPro;
              const level = difficultyOf(user.gameRatings[game.id]);
              const plays = user.gameRatings[game.id]?.plays ?? 0;
              return (
                <Card
                  key={game.id}
                  interactive
                  onClick={() => navigate(`/play/${game.id}`)}
                  style={{ padding: 16, opacity: locked ? 0.75 : 1 }}
                >
                  <div style={{ display: 'flex', gap: 12 }}>
                    <CategoryIcon category={game.category} boxed boxSize={42} size={19} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <h3 style={{ fontSize: 15 }}>{game.title}</h3>
                        {locked && <Lock size={13} color="var(--warning)" />}
                      </div>
                      <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2, lineHeight: 1.45 }}>
                        {game.description}
                      </p>
                      <div style={{ display: 'flex', gap: 12, marginTop: 8, alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 600 }}>
                          <Gauge size={12} /> Lv {level}
                        </span>
                        {plays > 0 && (
                          <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 600 }}>
                            {plays} session{plays > 1 ? 's' : ''}
                          </span>
                        )}
                        {locked && <span className="badge badge-pro" style={{ fontSize: 10, padding: '1px 8px' }}>PRO</span>}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
        </Reveal>
      ))}
    </div>
  );
};

export default TrainingPage;
