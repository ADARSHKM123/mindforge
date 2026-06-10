import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SessionSummary } from '../../types';
import GameHeader from './GameHeader';

interface SequenceRecallProps {
  level: number; // adaptive difficulty 1–10
  variant: 'standard' | 'advanced';
  duration: number;
  accentColor: string;
  onComplete: (summary: SessionSummary) => void;
  onExit: () => void;
}

const TOTAL_ROUNDS = 6;

/**
 * Simon-style sequence memory: tiles light up in order, then the player
 * reproduces the sequence. Each successful round adds one step.
 */
const SequenceRecall: React.FC<SequenceRecallProps> = ({ level, variant, duration, accentColor, onComplete, onExit }) => {
  const gridSize = variant === 'advanced' || level >= 7 ? 4 : 3;
  const tileCount = gridSize * gridSize;
  const startLen = Math.min(3 + Math.floor(level / 3), 6);
  const flashMs = Math.max(280, (variant === 'advanced' ? 480 : 560) - level * 22);

  const [phase, setPhase] = useState<'watch' | 'repeat' | 'between'>('between');
  const [litTile, setLitTile] = useState<number | null>(null);
  const [errorTile, setErrorTile] = useState<number | null>(null);
  const [round, setRound] = useState(0); // completed rounds
  const [timeLeft, setTimeLeft] = useState(duration);
  const [message, setMessage] = useState('Watch the pattern…');

  const seqRef = useRef<number[]>([]);
  const inputIdxRef = useRef(0);
  const roundsDoneRef = useRef(0);
  const sessionStartRef = useRef(Date.now());
  const doneRef = useRef(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const queue = (fn: () => void, ms: number) => {
    timersRef.current.push(setTimeout(fn, ms));
  };

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    timersRef.current.forEach(clearTimeout);
    const rounds = roundsDoneRef.current;
    const timeSpent = Math.round((Date.now() - sessionStartRef.current) / 1000);
    onComplete({
      score: rounds,
      maxScore: TOTAL_ROUNDS,
      accuracy: rounds / TOTAL_ROUNDS,
      avgResponseMs: rounds > 0 ? (timeSpent * 1000) / rounds : 0,
      timeSpent,
    });
  }, [onComplete]);

  // Countdown
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

  const playSequence = useCallback((seq: number[]) => {
    setPhase('watch');
    setMessage('Watch the pattern…');
    seq.forEach((tile, i) => {
      queue(() => setLitTile(tile), i * (flashMs + 160));
      queue(() => setLitTile(null), i * (flashMs + 160) + flashMs);
    });
    queue(() => {
      inputIdxRef.current = 0;
      setPhase('repeat');
      setMessage('Your turn — repeat it');
    }, seq.length * (flashMs + 160) + 200);
  }, [flashMs]);

  const startRound = useCallback((completedRounds: number) => {
    const len = startLen + completedRounds;
    const seq = Array.from({ length: len }, () => Math.floor(Math.random() * tileCount));
    seqRef.current = seq;
    setPhase('between');
    queue(() => playSequence(seq), 600);
  }, [startLen, tileCount, playSequence]);

  // Kick off first round
  useEffect(() => {
    startRound(0);
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTile = (index: number) => {
    if (phase !== 'repeat' || doneRef.current) return;
    const expected = seqRef.current[inputIdxRef.current];

    if (index !== expected) {
      setErrorTile(index);
      setMessage('Not quite — session over');
      queue(finish, 800);
      return;
    }

    setLitTile(index);
    queue(() => setLitTile(null), 180);
    inputIdxRef.current += 1;

    if (inputIdxRef.current >= seqRef.current.length) {
      roundsDoneRef.current += 1;
      setRound(roundsDoneRef.current);
      if (roundsDoneRef.current >= TOTAL_ROUNDS) {
        setMessage('Perfect recall!');
        queue(finish, 600);
      } else {
        setMessage('Correct! Next pattern…');
        startRound(roundsDoneRef.current);
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <GameHeader
        progressLabel={`Round ${Math.min(round + 1, TOTAL_ROUNDS)} / ${TOTAL_ROUNDS}`}
        timeLeft={timeLeft}
        totalTime={duration}
        accentColor={accentColor}
        onExit={onExit}
      />

      <div style={{ maxWidth: 400, margin: '0 auto', padding: '32px 20px', textAlign: 'center' }}>
        <p style={{
          fontSize: 15, fontWeight: 600, marginBottom: 24, minHeight: 24,
          color: phase === 'repeat' ? 'var(--accent)' : 'var(--text-secondary)',
        }}>
          {message}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: 10,
          pointerEvents: phase === 'repeat' ? 'auto' : 'none',
        }}>
          {Array.from({ length: tileCount }, (_, i) => (
            <button
              key={i}
              className={`seq-tile ${litTile === i ? 'lit' : ''} ${errorTile === i ? 'error' : ''}`}
              onClick={() => handleTile(i)}
              aria-label={`Tile ${i + 1}`}
            />
          ))}
        </div>

        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 20 }}>
          Sequence length: {startLen + round}
        </p>
      </div>
    </div>
  );
};

export default SequenceRecall;
