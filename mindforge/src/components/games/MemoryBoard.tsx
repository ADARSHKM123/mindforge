import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SessionSummary } from '../../types';
import { boardEmojiSet, boardSymbolSet } from '../../data/content';
import { shuffleArray } from '../../utils/helpers';
import GameHeader from './GameHeader';

interface MemoryBoardProps {
  level: number; // adaptive difficulty 1–10
  variant: 'shapes' | 'symbols';
  duration: number;
  accentColor: string;
  onComplete: (summary: SessionSummary) => void;
  onExit: () => void;
}

interface CardState {
  glyph: string;
  flipped: boolean;
  matched: boolean;
}

const MemoryBoard: React.FC<MemoryBoardProps> = ({ level, variant, duration, accentColor, onComplete, onExit }) => {
  const pairCount = level <= 3 ? 6 : level <= 7 ? 8 : 10;
  const columns = pairCount === 6 ? 4 : pairCount === 8 ? 4 : 5;
  const glyphSet = variant === 'shapes' ? boardEmojiSet : boardSymbolSet;

  const initialCards = useMemo<CardState[]>(() => {
    const glyphs = shuffleArray(glyphSet).slice(0, pairCount);
    return shuffleArray([...glyphs, ...glyphs]).map(g => ({ glyph: g, flipped: false, matched: false }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [cards, setCards] = useState<CardState[]>(initialCards);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [lockBoard, setLockBoard] = useState(false);
  const openRef = useRef<number | null>(null);
  const attemptsRef = useRef(0);
  const matchedRef = useRef(0);
  const sessionStartRef = useRef(Date.now());
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const attempts = attemptsRef.current;
    const matched = matchedRef.current;
    const timeSpent = Math.round((Date.now() - sessionStartRef.current) / 1000);
    onComplete({
      score: matched,
      maxScore: pairCount,
      accuracy: attempts > 0 ? Math.min(1, matched / attempts) : 0,
      avgResponseMs: attempts > 0 ? (timeSpent * 1000) / attempts : 0,
      timeSpent,
    });
  }, [onComplete, pairCount]);

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          finish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [finish]);

  const flip = (index: number) => {
    if (lockBoard || doneRef.current) return;
    const card = cards[index];
    if (card.flipped || card.matched) return;

    const next = cards.map((c, i) => (i === index ? { ...c, flipped: true } : c));
    setCards(next);

    if (openRef.current === null) {
      openRef.current = index;
      return;
    }

    // Second card of the attempt
    const firstIdx = openRef.current;
    openRef.current = null;
    attemptsRef.current += 1;

    if (next[firstIdx].glyph === next[index].glyph) {
      matchedRef.current += 1;
      const matchedCards = next.map((c, i) =>
        i === firstIdx || i === index ? { ...c, matched: true } : c
      );
      setCards(matchedCards);
      if (matchedRef.current === pairCount) {
        setTimeout(finish, 500);
      }
    } else {
      setLockBoard(true);
      setTimeout(() => {
        setCards(prev => prev.map((c, i) =>
          i === firstIdx || i === index ? { ...c, flipped: false } : c
        ));
        setLockBoard(false);
      }, 700);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <GameHeader
        progressLabel={`${matchedRef.current} / ${pairCount} pairs`}
        timeLeft={timeLeft}
        totalTime={duration}
        accentColor={accentColor}
        onExit={onExit}
      />

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 10 }}>
          {cards.map((card, i) => (
            <button
              key={i}
              className={`memory-card ${card.matched ? 'matched' : card.flipped ? '' : 'face-down'}`}
              onClick={() => flip(i)}
              aria-label={card.flipped || card.matched ? card.glyph : 'Hidden card'}
            >
              <span style={{
                fontSize: 26,
                fontWeight: 700,
                color: card.matched ? 'var(--success)' : 'var(--text-primary)',
                opacity: card.flipped || card.matched ? 1 : 0,
                transition: 'opacity 150ms',
              }}>
                {card.glyph}
              </span>
            </button>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)', marginTop: 20 }}>
          Find all matching pairs before time runs out
        </p>
      </div>
    </div>
  );
};

export default MemoryBoard;
