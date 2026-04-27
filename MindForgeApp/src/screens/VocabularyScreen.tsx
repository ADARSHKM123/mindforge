import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useVocabulary } from '../contexts/VocabularyContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { VocabularyWord } from '../types';

type Tab = 'today' | 'pinned' | 'review' | 'all';

const VocabularyScreen: React.FC = () => {
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
      <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => { setReviewMode(false); setReviewIndex(0); }}>
            <Text style={{ fontSize: 20, color: colors.textSecondary }}>{'\u2190'} Back</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.textSecondary }}>
            {reviewIndex + 1} / {reviewQueue.length}
          </Text>
        </View>

        <Card style={{ alignItems: 'center' }} padding={32}>
          <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '600', marginBottom: 8 }}>
            What does this word mean?
          </Text>
          <Text style={{ fontSize: 32, fontWeight: '800', color: colors.text, marginBottom: 8 }}>
            {word.word}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 24 }}>
            {word.pronunciation}
          </Text>

          {!showAnswer ? (
            <Button onPress={() => setShowAnswer(true)} fullWidth>Show Answer</Button>
          ) : (
            <>
              <View style={{
                padding: 16, borderRadius: 12, backgroundColor: colors.bgTertiary,
                marginBottom: 20, width: '100%',
              }}>
                <Text style={{ fontSize: 11, color: colors.primary, fontWeight: '600', marginBottom: 4 }}>
                  {word.partOfSpeech}
                </Text>
                <Text style={{ fontSize: 16, color: colors.text, fontWeight: '600', marginBottom: 8 }}>
                  {word.definition}
                </Text>
                <Text style={{ fontSize: 13, color: colors.textSecondary, fontStyle: 'italic' }}>
                  "{word.exampleSentences[0]}"
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}>
                How well did you remember?
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, width: '100%' }}>
                <View style={{ flex: 1 }}>
                  <Button variant="secondary" onPress={() => handleReviewResponse(1)} fullWidth
                    style={{ backgroundColor: `${colors.error}15`, borderWidth: 0 }}
                    textStyle={{ fontSize: 12, color: colors.error }}>
                    Forgot
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button variant="secondary" onPress={() => handleReviewResponse(3)} fullWidth
                    style={{ backgroundColor: `${colors.warning}15`, borderWidth: 0 }}
                    textStyle={{ fontSize: 12, color: colors.warning }}>
                    Hard
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button variant="secondary" onPress={() => handleReviewResponse(4)} fullWidth
                    style={{ backgroundColor: `${colors.accent}15`, borderWidth: 0 }}
                    textStyle={{ fontSize: 12, color: colors.accent }}>
                    Good
                  </Button>
                </View>
                <View style={{ flex: 1 }}>
                  <Button variant="secondary" onPress={() => handleReviewResponse(5)} fullWidth
                    style={{ backgroundColor: `${colors.success}15`, borderWidth: 0 }}
                    textStyle={{ fontSize: 12, color: colors.success }}>
                    Easy
                  </Button>
                </View>
              </View>
            </>
          )}
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 4 }}>
        Vocabulary
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 20 }}>
        Learn new words every day
      </Text>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 20 }}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{
              flex: 1, paddingVertical: 10, paddingHorizontal: 8, borderRadius: 10,
              backgroundColor: activeTab === tab.key ? colors.primary : colors.bgTertiary,
              alignItems: 'center',
            }}>
            <Text style={{
              fontSize: 12, fontWeight: '600',
              color: activeTab === tab.key ? '#fff' : colors.textSecondary,
            }}>
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Review Button */}
      {activeTab === 'review' && reviewQueue.length > 0 && (
        <Card backgroundColor={colors.success} style={{ marginBottom: 16 }} padding={16}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 }}>
                {reviewQueue.length} words to review
              </Text>
              <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)' }}>
                Spaced repetition for better retention
              </Text>
            </View>
            <Button onPress={() => setReviewMode(true)}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
              textStyle={{ color: '#fff' }}>
              Start
            </Button>
          </View>
        </Card>
      )}

      {/* Word List */}
      {words.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>{'\u{1F4DA}'}</Text>
          <Text style={{ fontSize: 15, color: colors.textSecondary, textAlign: 'center' }}>
            {activeTab === 'pinned' ? 'No pinned words yet. Pin words to save them for later!' :
              activeTab === 'review' ? 'No words to review. Check back later!' :
                'No words available.'}
          </Text>
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          {words.map(word => {
            const isExpanded = expandedWord === word.id;
            return (
              <Card key={word.id} padding={0}>
                <TouchableOpacity
                  onPress={() => setExpandedWord(isExpanded ? null : word.id)}
                  style={{ padding: 14 }}
                  activeOpacity={0.7}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>
                          {word.word}
                        </Text>
                        <View style={{
                          paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4,
                          backgroundColor: word.difficulty === 'advanced' ? `${colors.error}15` :
                            word.difficulty === 'intermediate' ? `${colors.warning}15` : `${colors.success}15`,
                        }}>
                          <Text style={{
                            fontSize: 10, fontWeight: '600', textTransform: 'capitalize',
                            color: word.difficulty === 'advanced' ? colors.error :
                              word.difficulty === 'intermediate' ? colors.warning : colors.success,
                          }}>{word.difficulty}</Text>
                        </View>
                      </View>
                      <Text style={{ fontSize: 12, color: colors.textSecondary, marginBottom: 4 }}>
                        {word.pronunciation} {'\u00B7'} {word.partOfSpeech}
                      </Text>
                      <Text style={{ fontSize: 14, color: colors.text, lineHeight: 20 }}>
                        {word.definition}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => togglePin(word.id)}
                      style={{ padding: 4 }}>
                      <Text style={{ fontSize: 20, color: word.isPinned ? colors.warning : colors.textTertiary }}>
                        {word.isPinned ? '\u{1F4CC}' : '\u{1F4CD}'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/* Expanded Content */}
                {isExpanded && (
                  <View style={{
                    paddingHorizontal: 16, paddingBottom: 16, paddingTop: 12,
                    borderTopWidth: 1, borderTopColor: colors.border,
                  }}>
                    {/* Examples */}
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary, marginBottom: 6 }}>
                        Examples
                      </Text>
                      {word.exampleSentences.map((ex, i) => (
                        <View key={i} style={{
                          borderLeftWidth: 2, borderLeftColor: `${colors.primary}30`,
                          paddingLeft: 8, marginBottom: 4,
                        }}>
                          <Text style={{ fontSize: 13, color: colors.textSecondary, fontStyle: 'italic', lineHeight: 20 }}>
                            "{ex}"
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Synonyms */}
                    <View style={{ marginBottom: 12 }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.success, marginBottom: 6 }}>
                        Synonyms
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                        {word.synonyms.map(s => (
                          <View key={s} style={{
                            paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6,
                            backgroundColor: `${colors.success}15`,
                          }}>
                            <Text style={{ fontSize: 12, color: colors.success, fontWeight: '500' }}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Antonyms */}
                    {word.antonyms.length > 0 && (
                      <View>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.error, marginBottom: 6 }}>
                          Antonyms
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                          {word.antonyms.map(a => (
                            <View key={a} style={{
                              paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6,
                              backgroundColor: `${colors.error}15`,
                            }}>
                              <Text style={{ fontSize: 12, color: colors.error, fontWeight: '500' }}>{a}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    )}
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default VocabularyScreen;
