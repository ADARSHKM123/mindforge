import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import ProgressRing from '../components/common/ProgressRing';
import { categoryInfo } from '../data/games';

type TimeRange = '7d' | '30d' | 'all';

const ProfileScreen: React.FC = () => {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, progressHistory, updateUser } = useUser();
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  const xpProgress = user.xpToNextLevel > 0
    ? ((user.xp % user.xpToNextLevel) / user.xpToNextLevel) * 100
    : 0;

  const now = new Date();
  const filteredProgress = progressHistory.filter(p => {
    const d = new Date(p.date);
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    if (timeRange === '7d') return diff <= 7;
    if (timeRange === '30d') return diff <= 30;
    return true;
  });

  const chartData = filteredProgress.map(p => ({
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    games: p.gamesPlayed,
    xp: p.totalXP,
  }));

  const maxGames = Math.max(...chartData.map(d => d.games), 1);

  const skillData = Object.entries(user.skillLevels).map(([key, value]) => ({
    skill: categoryInfo[key]?.name || key,
    level: Math.round(value * 10) / 10,
    color: categoryInfo[key]?.color || '#666',
    icon: categoryInfo[key]?.icon || '',
  }));

  const totalStats = {
    games: filteredProgress.reduce((s, p) => s + p.gamesPlayed, 0),
    xp: filteredProgress.reduce((s, p) => s + p.totalXP, 0),
    minutes: Math.round(filteredProgress.reduce((s, p) => s + p.timeSpent, 0) / 60),
  };

  const avatars = ['\u{1F9E0}', '\u{1F981}', '\u{1F98A}', '\u{1F431}', '\u{1F436}', '\u{1F989}', '\u{1F43C}', '\u{1F988}', '\u{1F680}', '\u{26A1}', '\u{1F31F}', '\u{1F525}'];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      {/* Profile Header */}
      <Card backgroundColor={colors.primary} style={{ marginBottom: 20, alignItems: 'center' }} padding={24}>
        <View style={{
          width: 72, height: 72, borderRadius: 36,
          backgroundColor: 'rgba(255,255,255,0.2)',
          alignItems: 'center', justifyContent: 'center',
          marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)',
        }}>
          <Text style={{ fontSize: 36 }}>{user.avatar}</Text>
        </View>
        <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 }}>{user.name}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 16 }}>Level {user.level} Learner</Text>
        <ProgressRing progress={xpProgress} size={64} strokeWidth={5} color="#fff" bgColor="rgba(255,255,255,0.25)">
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{Math.round(xpProgress)}%</Text>
        </ProgressRing>
        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 8 }}>
          {user.xp} XP {'\u00B7'} {user.xpToNextLevel - (user.xp % user.xpToNextLevel)} to next level
        </Text>
      </Card>

      {/* Quick Stats */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
        {[
          { value: user.streak, label: 'Streak', icon: '\u{1F525}' },
          { value: user.totalGamesPlayed, label: 'Games', icon: '\u{1F3AE}' },
          { value: user.level, label: 'Level', icon: '\u{2B50}' },
          { value: user.totalTrainingMinutes, label: 'Minutes', icon: '\u{23F1}' },
        ].map(stat => (
          <Card key={stat.label} style={{ flex: 1, alignItems: 'center' }} padding={10}>
            <Text style={{ fontSize: 10, marginBottom: 2 }}>{stat.icon}</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary, marginBottom: 2 }}>{stat.value}</Text>
            <Text style={{ fontSize: 10, color: colors.textSecondary }}>{stat.label}</Text>
          </Card>
        ))}
      </View>

      {/* Time Range Selector */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
        {(['7d', '30d', 'all'] as TimeRange[]).map(range => (
          <TouchableOpacity key={range} onPress={() => setTimeRange(range)}
            style={{
              flex: 1, paddingVertical: 8, borderRadius: 8,
              backgroundColor: timeRange === range ? colors.primary : colors.bgTertiary,
              alignItems: 'center',
            }}>
            <Text style={{
              fontSize: 13, fontWeight: '600',
              color: timeRange === range ? '#fff' : colors.textSecondary,
            }}>
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : 'All Time'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Period Stats */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
        <Card style={{ flex: 1, alignItems: 'center' }} padding={12}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.accent, marginBottom: 2 }}>{totalStats.games}</Text>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>Games</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }} padding={12}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.warning, marginBottom: 2 }}>{totalStats.xp}</Text>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>XP</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }} padding={12}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.error, marginBottom: 2 }}>{totalStats.minutes}</Text>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>Minutes</Text>
        </Card>
      </View>

      {/* Simple Bar Chart */}
      {chartData.length > 0 && (
        <Card style={{ marginBottom: 20 }} padding={16}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>
            Activity
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 120 }}>
            {chartData.map((d, i) => (
              <View key={i} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
                <View style={{
                  width: '80%',
                  height: `${Math.max((d.games / maxGames) * 100, 5)}%`,
                  backgroundColor: colors.primary,
                  borderRadius: 4,
                  minHeight: 4,
                }} />
                <Text style={{ fontSize: 8, color: colors.textSecondary, marginTop: 4 }} numberOfLines={1}>
                  {d.date}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Skill Levels */}
      <Card style={{ marginBottom: 20 }} padding={16}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 16 }}>
          Skill Levels
        </Text>
        {skillData.map(skill => (
          <View key={skill.skill} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Text style={{ fontSize: 20, width: 28 }}>{skill.icon}</Text>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{skill.skill}</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: skill.color }}>
                  {skill.level.toFixed(1)} / 10
                </Text>
              </View>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: colors.bgTertiary }}>
                <View style={{
                  height: '100%', borderRadius: 4, backgroundColor: skill.color,
                  width: `${(skill.level / 10) * 100}%`,
                }} />
              </View>
            </View>
          </View>
        ))}
      </Card>

      {/* Achievements */}
      <Card style={{ marginBottom: 20 }} padding={16}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 16 }}>
          Achievements ({user.achievements.length})
        </Text>
        {user.achievements.length === 0 ? (
          <Text style={{ fontSize: 13, color: colors.textSecondary, textAlign: 'center', paddingVertical: 16 }}>
            Play games to unlock achievements! {'\u{1F3C6}'}
          </Text>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {user.achievements.map(a => (
              <View key={a.id} style={{
                width: '48%', padding: 12, borderRadius: 10,
                backgroundColor: colors.bgTertiary, alignItems: 'center',
              }}>
                <Text style={{ fontSize: 24 }}>{a.icon}</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text, marginTop: 4, marginBottom: 2 }}>{a.title}</Text>
                <Text style={{ fontSize: 10, color: colors.textSecondary, textAlign: 'center' }}>{a.description}</Text>
              </View>
            ))}
          </View>
        )}
      </Card>

      {/* Settings */}
      <Card padding={16}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 16 }}>
          Settings
        </Text>

        {/* Avatar Selection */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>Avatar</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {avatars.map(a => (
              <TouchableOpacity key={a} onPress={() => updateUser({ avatar: a })}
                style={{
                  width: 40, height: 40, borderRadius: 10,
                  backgroundColor: user.avatar === a ? `${colors.primary}20` : colors.bgTertiary,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: user.avatar === a ? 2 : 0,
                  borderColor: colors.primary,
                }}>
                <Text style={{ fontSize: 20 }}>{a}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily Goal */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 8 }}>
            Daily Goal: {user.dailyGoal} games
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[3, 5, 7, 10].map(goal => (
              <TouchableOpacity key={goal} onPress={() => updateUser({ dailyGoal: goal })}
                style={{
                  flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center',
                  backgroundColor: user.dailyGoal === goal ? colors.primary : colors.bgTertiary,
                }}>
                <Text style={{
                  fontSize: 13, fontWeight: '600',
                  color: user.dailyGoal === goal ? '#fff' : colors.textSecondary,
                }}>{goal}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Theme Toggle */}
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border,
        }}>
          <View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 2 }}>
              {theme === 'dark' ? '\u{1F319} Dark Mode' : '\u{2600}\u{FE0F} Light Mode'}
            </Text>
            <Text style={{ fontSize: 12, color: colors.textSecondary }}>
              Toggle appearance
            </Text>
          </View>
          <TouchableOpacity onPress={toggleTheme}
            style={{
              width: 52, height: 28, borderRadius: 14,
              backgroundColor: theme === 'dark' ? colors.primary : colors.bgTertiary,
              justifyContent: 'center',
              paddingHorizontal: 3,
            }}>
            <View style={{
              width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff',
              alignSelf: theme === 'dark' ? 'flex-end' : 'flex-start',
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2, shadowRadius: 3, elevation: 2,
            }} />
          </TouchableOpacity>
        </View>
      </Card>
    </ScrollView>
  );
};

export default ProfileScreen;
