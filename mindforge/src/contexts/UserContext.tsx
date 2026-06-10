import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { DailyProgress, DailyWorkout, GameResult, SkillCategory, UserProfile } from '../types';
import { getToday, getLevel, getStreakDays } from '../utils/helpers';
import { achievements as allAchievements, gameConfigs } from '../data/games';
import { storage } from '../core/storage';
import { skillScores, toSkillLevels, updateRating } from '../core/adaptive';
import { buildWorkout } from '../core/workout';

interface UserContextType {
  user: UserProfile;
  updateUser: (updates: Partial<UserProfile>) => void;
  addGameResult: (result: GameResult, parTimeMs: number) => void;
  progressHistory: DailyProgress[];
  isOnboarded: boolean;
  completeOnboarding: (name: string, focusAreas: SkillCategory[], dailyGoal: number) => void;
  workout: DailyWorkout;
  markWorkoutGame: (gameId: string) => void;
  upgradeToPro: () => void;
  resetAllData: () => void;
}

const defaultUser: UserProfile = {
  id: 'user-1',
  name: 'Player',
  email: '',
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
  dailyGoal: 3,
  onboardingComplete: false,
  isPro: false,
  focusAreas: [],
  gameRatings: {},
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => ({
    ...defaultUser,
    ...storage.get<Partial<UserProfile>>('user', {}),
  }));
  const [progressHistory, setProgressHistory] = useState<DailyProgress[]>(() =>
    storage.get('progress', [] as DailyProgress[])
  );
  const [workout, setWorkout] = useState<DailyWorkout>(() => {
    const saved = storage.get<DailyWorkout | null>('workout', null);
    if (saved && saved.date === getToday()) return saved;
    return { date: '', gameIds: [], completed: [] };
  });

  const updateUser = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => {
      const next = { ...prev, ...updates };
      storage.set('user', next);
      return next;
    });
  }, []);

  // Build (or rebuild) today's workout lazily whenever it's stale
  const todaysWorkout = useMemo(() => {
    if (workout.date === getToday()) return workout;
    const fresh = buildWorkout(getToday(), gameConfigs, user.gameRatings, user.isPro, user.focusAreas);
    storage.set('workout', fresh);
    return fresh;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workout, user.isPro]);

  const markWorkoutGame = useCallback((gameId: string) => {
    setWorkout(() => {
      const current = storage.get<DailyWorkout | null>('workout', null);
      const base = current && current.date === getToday() ? current : todaysWorkout;
      if (!base.gameIds.includes(gameId) || base.completed.includes(gameId)) return base;
      const next = { ...base, completed: [...base.completed, gameId] };
      storage.set('workout', next);
      return next;
    });
  }, [todaysWorkout]);

  const addGameResult = useCallback((result: GameResult, parTimeMs: number) => {
    setUser(prev => {
      const newXP = prev.xp + result.xpEarned;
      const levelInfo = getLevel(newXP);

      // Adaptive rating update
      const newRatings = {
        ...prev.gameRatings,
        [result.gameId]: updateRating(
          prev.gameRatings[result.gameId],
          result.accuracy / 100,
          result.avgResponseMs,
          parTimeMs
        ),
      };
      const scores = skillScores(gameConfigs, newRatings);

      const newGamesPlayed = prev.totalGamesPlayed + 1;
      const newMinutes = prev.totalTrainingMinutes + Math.max(1, Math.round(result.timeSpent / 60));

      // Streak: computed from history including today's session
      const historyWithToday = [...progressHistory.map(p => ({ date: p.date })), { date: getToday() }];
      const streak = getStreakDays(historyWithToday);
      const longestStreak = Math.max(prev.longestStreak, streak);

      // Achievements
      const unlocked = [...prev.achievements];
      allAchievements.forEach(a => {
        if (unlocked.find(ua => ua.id === a.id)) return;
        let earned = false;
        if (a.type === 'games_played' && newGamesPlayed >= a.requirement) earned = true;
        if (a.type === 'streak' && streak >= a.requirement) earned = true;
        if (a.type === 'level' && levelInfo.level >= a.requirement) earned = true;
        if (a.type === 'perfect_score' && result.accuracy === 100) earned = true;
        if (earned) unlocked.push({ ...a, unlockedAt: getToday() });
      });

      const next: UserProfile = {
        ...prev,
        xp: newXP,
        level: levelInfo.level,
        xpToNextLevel: levelInfo.xpToNext,
        streak,
        longestStreak,
        totalGamesPlayed: newGamesPlayed,
        totalTrainingMinutes: newMinutes,
        skillLevels: toSkillLevels(scores),
        achievements: unlocked,
        gameRatings: newRatings,
      };
      storage.set('user', next);
      return next;
    });

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
          const newAvg = ((cat.avgScore * cat.played) + result.accuracy) / newPlayed;
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
          categories: { [result.category]: { played: 1, avgScore: Math.round(result.accuracy) } },
        }];
      }
      storage.set('progress', updated);
      return updated;
    });
  }, [progressHistory]);

  const completeOnboarding = useCallback((name: string, focusAreas: SkillCategory[], dailyGoal: number) => {
    updateUser({ name, focusAreas, dailyGoal, onboardingComplete: true });
  }, [updateUser]);

  const upgradeToPro = useCallback(() => {
    // Demo checkout — replaced by a real payment provider (e.g. Stripe) at launch.
    updateUser({ isPro: true });
    storage.remove('workout'); // rebuild at Pro size
    setWorkout({ date: '', gameIds: [], completed: [] });
  }, [updateUser]);

  const resetAllData = useCallback(() => {
    storage.clearAll();
    window.location.reload();
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      updateUser,
      addGameResult,
      progressHistory,
      isOnboarded: user.onboardingComplete,
      completeOnboarding,
      workout: todaysWorkout,
      markWorkoutGame,
      upgradeToPro,
      resetAllData,
    }}>
      {children}
    </UserContext.Provider>
  );
};
