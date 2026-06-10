import React, { useState } from 'react';
import { Pin, Volume2, RotateCw } from 'lucide-react';
import { useVocabulary } from '../contexts/VocabularyContext';
import { VocabularyWord } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

type Tab = 'today' | 'review' | 'all';

const WordCard: React.FC<{ word: VocabularyWord; onPin: (id: string) => void }> = ({ word, onPin }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card interactive style={{ padding: 18 }} onClick={() => setExpanded(e => !e)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <h3 style={{ fontSize: 17 }}>{word.word}</h3>
            <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>{word.partOfSpeech}</span>
            <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>{word.pronunciation}</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>{word.definition}</p>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onPin(word.id); }}
          aria-label={word.isPinned ? 'Unpin word' : 'Pin word'}
          style={{
            background: word.isPinned ? 'var(--accent-soft)' : 'var(--bg-subtle)',
            border: 'none', borderRadius: 8, width: 32, height: 32, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}
        >
          <Pin size={15} color={word.isPinned ? 'var(--accent)' : 'var(--text-tertiary)'} />
        </button>
      </div>

      {expanded && (
        <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
          {word.exampleSentences.map((ex, i) => (
            <p key={i} style={{ fontSize: 13.5, color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 6 }}>
              "{ex}"
            </p>
          ))}
          <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
            <p style={{ fontSize: 12.5 }}>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>Synonyms: </span>
              <span className="text-secondary">{word.synonyms.join(', ')}</span>
            </p>
            <p style={{ fontSize: 12.5 }}>
              <span style={{ fontWeight: 700, color: 'var(--error)' }}>Antonyms: </span>
              <span className="text-secondary">{word.antonyms.join(', ')}</span>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

const ReviewSession: React.FC = () => {
  const { reviewQueue, markReviewed } = useVocabulary();
  const [revealed, setRevealed] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const current = reviewQueue[0];

  if (!current) {
    return (
      <Card style={{ textAlign: 'center', padding: 40 }}>
        <RotateCw size={28} color="var(--text-tertiary)" style={{ marginBottom: 12 }} />
        <h3 style={{ marginBottom: 6 }}>{reviewedCount > 0 ? 'Review complete' : 'Nothing due for review'}</h3>
        <p className="text-secondary" style={{ fontSize: 13.5 }}>
          {reviewedCount > 0
            ? `${reviewedCount} word${reviewedCount > 1 ? 's' : ''} reviewed — spaced repetition will bring them back at the right time.`
            : 'Words you study come back for review on a spaced-repetition schedule.'}
        </p>
      </Card>
    );
  }

  const grade = (quality: number) => {
    markReviewed(current.id, quality);
    setRevealed(false);
    setReviewedCount(c => c + 1);
  };

  return (
    <Card style={{ textAlign: 'center', padding: 32 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 16 }}>
        {reviewQueue.length} due — recall the meaning
      </p>
      <h2 style={{ fontSize: 30, marginBottom: 6 }}>{current.word}</h2>
      <p style={{ fontSize: 13.5, color: 'var(--text-tertiary)', marginBottom: 24 }}>
        <Volume2 size={13} style={{ verticalAlign: -2, marginRight: 5 }} />
        {current.pronunciation} · {current.partOfSpeech}
      </p>

      {!revealed ? (
        <Button size="lg" onClick={() => setRevealed(true)}>Reveal definition</Button>
      ) : (
        <>
          <p style={{ fontSize: 16, marginBottom: 8 }}>{current.definition}</p>
          {current.exampleSentences[0] && (
            <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 24 }}>
              "{current.exampleSentences[0]}"
            </p>
          )}
          <p style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginBottom: 10 }}>How well did you remember it?</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, maxWidth: 420, margin: '0 auto' }}>
            <Button variant="secondary" size="sm" style={{ color: 'var(--error)' }} onClick={() => grade(1)}>Again</Button>
            <Button variant="secondary" size="sm" style={{ color: 'var(--warning)' }} onClick={() => grade(3)}>Hard</Button>
            <Button variant="secondary" size="sm" onClick={() => grade(4)}>Good</Button>
            <Button variant="secondary" size="sm" style={{ color: 'var(--success)' }} onClick={() => grade(5)}>Easy</Button>
          </div>
        </>
      )}
    </Card>
  );
};

const VocabularyPage: React.FC = () => {
  const { todaysWords, reviewQueue, allWords, togglePin } = useVocabulary();
  const [tab, setTab] = useState<Tab>('today');
  const [search, setSearch] = useState('');

  const filtered = allWords.filter(w =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.definition.toLowerCase().includes(search.toLowerCase())
  );
  const sorted = [...filtered].sort((a, b) => Number(b.isPinned) - Number(a.isPinned) || a.word.localeCompare(b.word));

  const tabs: { id: Tab; label: string }[] = [
    { id: 'today', label: "Today's words" },
    { id: 'review', label: reviewQueue.length > 0 ? `Review (${reviewQueue.length})` : 'Review' },
    { id: 'all', label: `All (${allWords.length})` },
  ];

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow" style={{ marginBottom: 8 }}>Word program</p>
        <h1 className="page-title">Vocabulary</h1>
        <p className="page-subtitle">Daily words with spaced-repetition review — your edge over any other brain trainer.</p>
      </header>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {tabs.map(t => (
          <button
            key={t.id}
            className={`badge ${tab === t.id ? 'badge-accent' : ''}`}
            style={{ cursor: 'pointer', border: 'none', padding: '8px 16px', fontSize: 13 }}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'today' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {todaysWords.map(w => {
            const live = allWords.find(x => x.id === w.id) ?? w;
            return <WordCard key={w.id} word={live} onPin={togglePin} />;
          })}
        </div>
      )}

      {tab === 'review' && <ReviewSession />}

      {tab === 'all' && (
        <>
          <input
            className="input"
            placeholder="Search words…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sorted.map(w => <WordCard key={w.id} word={w} onPin={togglePin} />)}
            {sorted.length === 0 && (
              <p className="text-tertiary" style={{ textAlign: 'center', padding: 24 }}>No words match your search.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VocabularyPage;
