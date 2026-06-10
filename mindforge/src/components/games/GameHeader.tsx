import React from 'react';
import { X, Clock } from 'lucide-react';

interface GameHeaderProps {
  progressLabel: string;
  timeLeft: number;
  totalTime: number;
  accentColor: string;
  onExit: () => void;
}

/** Shared in-game top bar: exit, progress, countdown + time bar. */
const GameHeader: React.FC<GameHeaderProps> = ({ progressLabel, timeLeft, totalTime, accentColor, onExit }) => {
  const pct = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;
  const urgent = timeLeft <= 10;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '16px 20px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <button
          onClick={onExit}
          aria-label="Exit game"
          style={{
            background: 'var(--bg-subtle)', border: 'none', borderRadius: 8,
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)',
          }}
        >
          <X size={16} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>
          {progressLabel}
        </span>
        <span style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 14, fontWeight: 700,
          color: urgent ? 'var(--error)' : 'var(--text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          <Clock size={14} />
          {timeLeft}s
        </span>
      </div>
      <div className="progress-track" style={{ height: 4 }}>
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: urgent ? 'var(--error)' : accentColor,
            transition: 'width 1s linear',
          }}
        />
      </div>
    </div>
  );
};

export default GameHeader;
