import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useVocabulary } from '../contexts/VocabularyContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { VocabularyWord } from '../types';

type Tab = 'today' | 'pinned' | 'review' | 'all';

const VocabularyPage: React.FC = () => {
  const { colors } = useTheme();
  const { todaysWords, pinnedWords, reviewQueue, allWords, togglePin, markReviewed } = useVocabulary();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [expandedWord, setExpandedWord] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'today', label: "Today's", count: todaysWords.length },
    { key: 'pinned', label: 'Pinned', count: pinnedWords.length },
    { key: 'review', label: 'Review', count: reviewQueue.length },
    { key: 'all', label: 'All', count: allWords.length },
  ];

  const getActiveWords = (): VocabularyWord[] => {
    switch (activeTab) {
      case 'today': return todaysWords;
      case 'pinned': return pinnedWords;
      case 'review': return reviewQueue;
      case 'all': return allWords;
    }
  };

  const words = getActiveWords();

  const handleReviewResponse = (quality: number) => {
    if (reviewQueue.length > 0) {
      markReviewed(reviewQueue[reviewIndex].id, quality);
      setShowAnswer(false);
      if (reviewIndex + 1 >= reviewQueue.length) {
        setReviewMode(false);
        setReviewIndex(0);
      } else {
        setReviewIndex(prev => prev + 1);
      }
    }
  };

  // Review Mode
  if (reviewMode && reviewQueue.length > 0) {
    const word = reviewQueue[reviewIndex];
    return (
      <div style={{ padding: '24px 16px 90px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button onClick={() => { setReviewMode(false); setReviewIndex(0); }}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: colors.textSecondary }}>
            ← Back
          </button>
          <span style={{ fontSize: '14px', fontWeight: 600, color: colors.textSecondary }}>
            {reviewIndex + 1} / {reviewQueue.length}
          </span>
        </div>

        <Card style={{ textAlign: 'center', padding: '32px 24px' }}>
          <p style={{ fontSize: '12px', color: colors.primary, fontWeight: 600, marginBottom: '8px' }}>
            What does this word mean?
          </p>
          <h2 style={{ fontSize: '32px', fontWeight: 800, color: colors.text, margin: '0 0 8px' }}>
            {word.word}
          </h2>
          <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px' }}>
            {word.pronunciation}
          </p>

          {!showAnswer ? (
            <Button onClick={() => setShowAnswer(true)} fullWidth>Show Answer</Button>
          ) : (
            <>
              <div style={{
                padding: '16px', borderRadius: '12px', background: colors.bgTertiary, marginBottom: '20px',
                textAlign: 'left',
              }}>
                <p style={{ fontSize: '11px', color: colors.primary, fontWeight: 600, margin: '0 0 4px' }}>
                  {word.partOfSpeech}
                </p>
                <p style={{ fontSize: '16px', color: colors.text, fontWeight: 600, margin: '0 0 8px' }}>
                  {word.definition}
                </p>
                <p style={{ fontSize: '13px', color: colors.textSecondary, fontStyle: 'italic', margin: 0 }}>
                  "{word.exampleSentences[0]}"
                </p>
              </div>
              <p style={{ fontSize: '13px', color: colors.textSecondary, marginBottom: '12px' }}>
                How well did you remember?
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="secondary" onClick={() => handleReviewResponse(1)} fullWidth
                  style={{ fontSize: '12px', background: `${colors.error}15`, color: colors.error, border: 'none' }}>
                  Forgot
                </Button>
                <Button variant="secondary" onClick={() => handleReviewResponse(3)} fullWidth
                  style={{ fontSize: '12px', background: `${colors.warning}15`, color: colors.warning, border: 'none' }}>
                  Hard
                </Button>
                <Button variant="secondary" onClick={() => handleReviewResponse(4)} fullWidth
                  style={{ fontSize: '12px', background: `${colors.accent}15`, color: colors.accent, border: 'none' }}>
                  Good
                </Button>
                <Button variant="secondary" onClick={() => handleReviewResponse(5)} fullWidth
                  style={{ fontSize: '12px', background: `${colors.success}15`, color: colors.success, border: 'none' }}>
                  Easy
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 16px 90px', maxWidth: '480px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: colors.text, margin: '0 0 4px' }}>
        Vocabulary
      </h1>
      <p style={{ fontSize: '14px', color: colors.textSecondary, margin: '0 0 20px' }}>
        Learn new words every day
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1, padding: '10px 8px', borderRadius: '10px', border: 'none',
              background: activeTab === tab.key ? colors.primary : colors.bgTertiary,
              color: activeTab === tab.key ? '#fff' : colors.textSecondary,
              fontSize: '12px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            }}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Review Button */}
      {activeTab === 'review' && reviewQueue.length > 0 && (
        <Card gradient={colors.gradient2} style={{ marginBottom: '16px', color: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>
                {reviewQueue.length} words to review
              </h3>
              <p style={{ fontSize: '13px', opacity: 0.9, margin: 0 }}>
                Spaced repetition for better retention
              </p>
            </div>
            <Button onClick={() => setReviewMode(true)}
              style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              Start
            </Button>
          </div>
        </Card>
      )}

      {/* Word List */}
      {words.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ fontSize: '48px', marginBottom: '12px' }}>📚</p>
          <p style={{ fontSize: '15px', color: colors.textSecondary }}>
            {activeTab === 'pinned' ? 'No pinned words yet. Pin words to save them for later!' :
              activeTab === 'review' ? 'No words to review. Check back later!' :
                'No words available.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {words.map(word => {
            const isExpanded = expandedWord === word.id;
            return (
              <Card key={word.id} padding="0">
                <div
                  onClick={() => setExpandedWord(isExpanded ? null : word.id)}
                  style={{ padding: '14px 16px', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 700, color: colors.text, margin: 0 }}>
                          {word.word}
                        </h3>
                        <span style={{
                          fontSize: '10px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px',
                          background: word.difficulty === 'advanced' ? `${colors.error}15` :
                            word.difficulty === 'intermediate' ? `${colors.warning}15` : `${colors.success}15`,
                          color: word.difficulty === 'advanced' ? colors.error :
                            word.difficulty === 'intermediate' ? colors.warning : colors.success,
                          textTransform: 'capitalize',
                        }}>
                          {word.difficulty}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: colors.textSecondary, margin: '0 0 4px' }}>
                        {word.pronunciation} · {word.partOfSpeech}
                      </p>
                      <p style={{ fontSize: '14px', color: colors.text, margin: 0, lineHeight: 1.4 }}>
                        {word.definition}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePin(word.id); }}
                      style={{
                        background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer',
                        padding: '4px', color: word.isPinned ? colors.warning : colors.textTertiary,
                      }}
                      aria-label={word.isPinned ? 'Unpin word' : 'Pin word'}
                    >
                      {word.isPinned ? '📌' : '📍'}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{
                    padding: '0 16px 16px', borderTop: `1px solid ${colors.border}`,
                    paddingTop: '12px',
                  }}>
                    {/* Example Sentences */}
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: colors.primary, margin: '0 0 6px' }}>
                        Examples
                      </p>
                      {word.exampleSentences.map((ex, i) => (
                        <p key={i} style={{
                          fontSize: '13px', color: colors.textSecondary, margin: '0 0 4px',
                          fontStyle: 'italic', lineHeight: 1.5, paddingLeft: '8px',
                          borderLeft: `2px solid ${colors.primary}30`,
                        }}>
                          "{ex}"
                        </p>
                      ))}
                    </div>

                    {/* Synonyms */}
                    <div style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: colors.success, margin: '0 0 6px' }}>
                        Synonyms
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {word.synonyms.map(s => (
                          <span key={s} style={{
                            fontSize: '12px', padding: '4px 10px', borderRadius: '6px',
                            background: `${colors.success}15`, color: colors.success, fontWeight: 500,
                          }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Antonyms */}
                    {word.antonyms.length > 0 && (
                      <div>
                        <p style={{ fontSize: '12px', fontWeight: 600, color: colors.error, margin: '0 0 6px' }}>
                          Antonyms
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {word.antonyms.map(a => (
                            <span key={a} style={{
                              fontSize: '12px', padding: '4px 10px', borderRadius: '6px',
                              background: `${colors.error}15`, color: colors.error, fontWeight: 500,
                            }}>
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VocabularyPage;
