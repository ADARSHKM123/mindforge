import React, { createContext, useContext, useState, useCallback } from 'react';
import { UserProfile, GameResult, DailyProgress } from '../types';
import { getToday, getLevel, calculateXP } from '../utils/helpers';
import { achievements as allAchievements } from '../data/games';

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  addGameResult: (result: GameResult) => void;
  progressHistory: DailyProgress[];
  isOnboarded: boolean;
  completeOnboarding: (name: string) => void;
}

const defaultUser: UserProfile = {
  id: 'user-1',
  name: 'Player',
  email: '',
  avatar: '🧠',
  joinDate: getToday(),
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  streak: 0,
  longestStreak: 0,
  totalGamesPlayed: 0,
  totalTrainingMinutes: 0,
  skillLevels: { reading: 1, math: 1, memory: 1, focus: 1, speed: 1, verbal: 1 },
  achievements: [],
  dailyGoal: 5,
  onboardingComplete: false,
};

function loadState<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(`mindforge-${key}`);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

function saveState(key: string, value: any) {
  localStorage.setItem(`mindforge-${key}`, JSON.stringify(value));
}

const UserContext = createContext<UserContextType>({
  user: defaultUser,
  updateUser: () => {},
  addGameResult: () => {},
  progressHistory: [],
  isOnboarded: false,
  completeOnboarding: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => loadState('user', defaultUser));
  const [progressHistory, setProgressHistory] = useState<DailyProgress[]>(() => loadState('progress', []));

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      saveState('user', next);
      return next;
    });
  }, []);

  const addGameResult = useCallback((result: GameResult) => {
    setUser(prev => {
      const xpEarned = calculateXP(result.score, result.maxScore, 'medium');
      const newXP = prev.xp + xpEarned;
      const levelInfo = getLevel(newXP);
      const newSkillLevels = { ...prev.skillLevels };
      const categoryScore = result.score / result.maxScore;
      if (categoryScore > 0.8) {
        newSkillLevels[result.category] = Math.min(10, newSkillLevels[result.category] + 0.1);
      }

      const newGamesPlayed = prev.totalGamesPlayed + 1;
      const newMinutes = prev.totalTrainingMinutes + Math.round(result.timeSpent / 60);

      // Check achievements
      const unlockedAchievements = [...prev.achievements];
      allAchievements.forEach(a => {
        if (unlockedAchievements.find(ua => ua.id === a.id)) return;
        let earned = false;
        if (a.type === 'games_played' && newGamesPlayed >= a.requirement) earned = true;
        if (a.type === 'streak' && prev.streak >= a.requirement) earned = true;
        if (a.type === 'level' && levelInfo.level >= a.requirement) earned = true;
        if (a.type === 'perfect_score' && categoryScore === 1) earned = true;
        if (earned) unlockedAchievements.push({ ...a, unlockedAt: getToday() });
      });

      const next: UserProfile = {
        ...prev,
        xp: newXP,
        level: levelInfo.level,
        xpToNextLevel: levelInfo.xpToNext,
        totalGamesPlayed: newGamesPlayed,
        totalTrainingMinutes: newMinutes,
        skillLevels: newSkillLevels,
        achievements: unlockedAchievements,
      };
      saveState('user', next);
      return next;
    });

    // Update progress history
    setProgressHistory(prev => {
      const today = getToday();
      const existing = prev.find(p => p.date === today);
      let updated: DailyProgress[];
      if (existing) {
        updated = prev.map(p => {
          if (p.date !== today) return p;
          const cats = { ...p.categories };
          const cat = cats[result.category] || { played: 0, avgScore: 0 };
          const newPlayed = cat.played + 1;
          const newAvg = ((cat.avgScore * cat.played) + (result.score / result.maxScore * 100)) / newPlayed;
          cats[result.category] = { played: newPlayed, avgScore: Math.round(newAvg) };
          return {
            ...p,
            gamesPlayed: p.gamesPlayed + 1,
            totalScore: p.totalScore + result.score,
            totalXP: p.totalXP + result.xpEarned,
            timeSpent: p.timeSpent + result.timeSpent,
            categories: cats,
          };
        });
      } else {
        updated = [...prev, {
          date: today,
          gamesPlayed: 1,
          totalScore: result.score,
          totalXP: result.xpEarned,
          timeSpent: result.timeSpent,
          categories: { [result.category]: { played: 1, avgScore: Math.round(result.score / result.maxScore * 100) } },
        }];
      }
      saveState('progress', updated);
      return updated;
    });
  }, []);

  const completeOnboarding = useCallback((name: string) => {
    updateUser({ name, onboardingComplete: true });
  }, [updateUser]);

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      addGameResult,
      progressHistory,
      isOnboarded: user.onboardingComplete,
      completeOnboarding,
    }}>
      {children}
    </UserContext.Provider>
  );
};
