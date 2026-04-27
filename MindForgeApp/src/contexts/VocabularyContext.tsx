import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VocabularyWord } from '../types';
import { getDailyWords } from '../data/vocabulary';
import { getToday, calculateNextReview } from '../utils/helpers';

interface VocabularyContextType {
  todaysWords: VocabularyWord[];
  pinnedWords: VocabularyWord[];
  reviewQueue: VocabularyWord[];
  allWords: VocabularyWord[];
  togglePin: (wordId: string) => void;
  markReviewed: (wordId: string, quality: number) => void;
}

const VocabularyContext = createContext<VocabularyContextType>({
  todaysWords: [],
  pinnedWords: [],
  reviewQueue: [],
  allWords: [],
  togglePin: () => {},
  markReviewed: () => {},
});

export const useVocabulary = () => useContext(VocabularyContext);

export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allWords, setAllWords] = useState<VocabularyWord[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('mindforge-vocabulary');
        const parsed: VocabularyWord[] = saved ? JSON.parse(saved) : [];
        const today = getToday();
        const daily = getDailyWords(today);
        const existingIds = new Set(parsed.map(w => w.id));
        const newWords = daily.filter(w => !existingIds.has(w.id));
        if (newWords.length > 0) {
          const merged = [...parsed, ...newWords];
          await AsyncStorage.setItem('mindforge-vocabulary', JSON.stringify(merged));
          setAllWords(merged);
        } else {
          setAllWords(parsed.length > 0 ? parsed : daily);
        }
      } catch {
        setAllWords(getDailyWords(getToday()));
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (allWords.length > 0) {
      AsyncStorage.setItem('mindforge-vocabulary', JSON.stringify(allWords));
    }
  }, [allWords]);

  const todaysWords = getDailyWords(getToday());

  const pinnedWords = allWords.filter(w => w.isPinned);

  const reviewQueue = allWords.filter(w => {
    const today = getToday();
    return w.nextReviewDate <= today && w.reviewCount > 0;
  });

  const togglePin = useCallback((wordId: string) => {
    setAllWords(prev => prev.map(w =>
      w.id === wordId ? { ...w, isPinned: !w.isPinned } : w
    ));
  }, []);

  const markReviewed = useCallback((wordId: string, quality: number) => {
    setAllWords(prev => prev.map(w => {
      if (w.id !== wordId) return w;
      const result = calculateNextReview(quality, w.easeFactor, w.interval);
      return {
        ...w,
        reviewCount: w.reviewCount + 1,
        easeFactor: result.easeFactor,
        interval: result.interval,
        nextReviewDate: result.nextDate,
      };
    }));
  }, []);

  return (
    <VocabularyContext.Provider value={{
      todaysWords,
      pinnedWords,
      reviewQueue,
      allWords,
      togglePin,
      markReviewed,
    }}>
      {children}
    </VocabularyContext.Provider>
  );
};
