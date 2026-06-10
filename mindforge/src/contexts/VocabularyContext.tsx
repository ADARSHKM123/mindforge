import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { VocabularyWord } from '../types';
import { getDailyWords } from '../data/vocabulary';
import { getToday, calculateNextReview } from '../utils/helpers';
import { storage } from '../core/storage';

interface VocabularyContextType {
  todaysWords: VocabularyWord[];
  pinnedWords: VocabularyWord[];
  reviewQueue: VocabularyWord[];
  allWords: VocabularyWord[];
  togglePin: (wordId: string) => void;
  markReviewed: (wordId: string, quality: number) => void;
}

function loadWords(): VocabularyWord[] {
  return storage.get<VocabularyWord[]>('vocabulary', []);
}

function saveWords(words: VocabularyWord[]) {
  storage.set('vocabulary', words);
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
  const [allWords, setAllWords] = useState<VocabularyWord[]>(() => {
    const saved = loadWords();
    const today = getToday();
    const daily = getDailyWords(today);
    // Merge daily words with saved (don't duplicate)
    const existingIds = new Set(saved.map(w => w.id));
    const newWords = daily.filter(w => !existingIds.has(w.id));
    if (newWords.length > 0) {
      const merged = [...saved, ...newWords];
      saveWords(merged);
      return merged;
    }
    return saved.length > 0 ? saved : daily;
  });

  useEffect(() => {
    saveWords(allWords);
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
