import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SessionSummary } from '../../types';
import { QuizSpec, Stimulus } from '../../games/generators';
import GameHeader from './GameHeader';

interface QuizEngineProps {
  spec: QuizSpec;
  duration: number; // seconds
  accentColor: string;
  onComplete: (summary: SessionSummary) => void;
  onExit: () => void;
}

const StimulusView: React.FC<{ stimulus: Stimulus }> = ({ stimulus }) => {
  switch (stimulus.kind) {
    case 'stroop':
      return (
        <p className="no-select" style={{ fontSize: 52, fontWeight: 800, color: stimulus.color, margin: '12px 0', letterSpacing: '0.02em' }}>
          {stimulus.word}
        </p>
      );
    case 'flanker':
      return (
        <p className="no-select" style={{ fontSize: 40, fontWeight: 700, margin: '16px 0', letterSpacing: '0.1em' }}>
          {stimulus.arrows}
        </p>
      );
    case 'grid':
      return (
        <div className="no-select" style={{ fontFamily: 'ui-monospace, monospace', fontSize: 24, lineHeight: 1.7, margin: '12px 0', fontWeight: 600 }}>
          {stimulus.rows.map((row, i) => <div key={i}>{row}</div>)}
        </div>
      );
    case 'compare':
      return (
        <div className="no-select" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, margin: '16px 0' }}>
          <span style={{ fontSize: 30, fontWeight: 700 }}>{stimulus.left}</span>
          <span style={{ fontSize: 22, color: 'var(--text-tertiary)' }}>=</span>
          <span style={{ fontSize: 30, fontWeight: 700 }}>{stimulus.right}</span>
        </div>
      );
    default:
      return null;
  }
};

const QuizEngine: React.FC<QuizEngineProps> = ({ spec, duration, accentColor, onComplete, onExit }) => {
  const { questions } = spec;
  const [currentQ, setCurrentQ] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const answersRef = useRef<{ correct: boolean; ms: number }[]>([]);
  const questionStartRef = useRef(Date.now());
  const sessionStartRef = useRef(Date.now());
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    const answers = answersRef.current;
    const correct = answers.filter(a => a.correct).length;
    const avgMs = answers.length > 0 ? answers.reduce((s, a) => s + a.ms, 0) / answers.length : 0;
    onComplete({
      score: correct,
      maxScore: questions.length,
      accuracy: answers.length > 0 ? correct / answers.length : 0,
      avgResponseMs: avgMs,
      timeSpent: Math.round((Date.now() - sessionStartRef.current) / 1000),
    });
  }, [onComplete, questions.length]);

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

  const handleAnswer = useCallback((index: number) => {
    if (showFeedback || doneRef.current) return;
    const q = questions[currentQ];
    const correct = index === q.correctIndex;
    answersRef.current.push({ correct, ms: Date.now() - questionStartRef.current });
    setSelected(index);
    setShowFeedback(true);

    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        finish();
      } else {
        setCurrentQ(prev => prev + 1);
        setSelected(null);
        setShowFeedback(false);
        questionStartRef.current = Date.now();
      }
    }, correct ? 450 : 900);
  }, [showFeedback, questions, currentQ, finish]);

  // Keyboard shortcuts 1–4
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= questions[currentQ].options.length) handleAnswer(n - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleAnswer, questions, currentQ]);

  const q = questions[currentQ];
  const twoOptions = q.options.length === 2;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <GameHeader
        progressLabel={`${currentQ + 1} / ${questions.length}`}
        timeLeft={timeLeft}
        totalTime={duration}
        accentColor={accentColor}
        onExit={onExit}
      />

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '28px 20px 40px' }}>
        {q.passage && (
          <div className="card" style={{ marginBottom: 20, fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-secondary)' }}>
            {q.passage}
          </div>
        )}

        <div style={{ textAlign: 'center', marginBottom: 28, minHeight: 60 }}>
          <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, whiteSpace: 'pre-line' }}>
            {q.prompt}
          </p>
          {q.stimulus && <StimulusView stimulus={q.stimulus} />}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: twoOptions ? '1fr 1fr' : 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 12,
        }}>
          {q.options.map((option, i) => {
            let cls = 'option-btn';
            if (showFeedback) {
              if (i === q.correctIndex) cls += ' correct';
              else if (i === selected) cls += ' incorrect';
            }
            return (
              <button key={i} className={cls} disabled={showFeedback} onClick={() => handleAnswer(i)}>
                {option}
              </button>
            );
          })}
        </div>

        {showFeedback && q.explanation && (
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)', marginTop: 16 }}>
            {q.explanation}
          </p>
        )}
      </div>
    </div>
  );
};

export default QuizEngine;
