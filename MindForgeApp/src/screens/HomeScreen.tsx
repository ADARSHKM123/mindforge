import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import { useVocabulary } from '../contexts/VocabularyContext';
import Card from '../components/common/Card';
import ProgressRing from '../components/common/ProgressRing';
import { gameConfigs, categoryInfo } from '../data/games';
import { getToday } from '../utils/helpers';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user, progressHistory } = useUser();
  const { todaysWords } = useVocabulary();

  const todayProgress = progressHistory.find(p => p.date === getToday());
  const gamesPlayedToday = todayProgress?.gamesPlayed || 0;
  const dailyGoalProgress = Math.min(100, (gamesPlayedToday / user.dailyGoal) * 100);

  const sortedSkills = Object.entries(user.skillLevels)
    .sort(([, a], [, b]) => a - b);
  const weakestCategories = sortedSkills.slice(0, 3).map(([cat]) => cat);
  const recommendedGames = gameConfigs
    .filter(g => weakestCategories.includes(g.category))
    .slice(0, 4);

  const greeting = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      {/* Header */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 4 }}>
          Good {greeting},
        </Text>
        <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text }}>
          {user.name} {'\u{1F44B}'}
        </Text>
      </View>

      {/* Daily Progress Card */}
      <Card backgroundColor={colors.primary} style={{ marginBottom: 20 }} padding={20}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>Daily Progress</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 4 }}>
              {gamesPlayedToday} / {user.dailyGoal} games
            </Text>
            <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
              {dailyGoalProgress >= 100 ? 'Goal completed! \u{1F389}' : `${Math.round(dailyGoalProgress)}% complete`}
            </Text>
          </View>
          <ProgressRing
            progress={dailyGoalProgress}
            size={72}
            strokeWidth={6}
            color="#FFFFFF"
            bgColor="rgba(255,255,255,0.3)"
          >
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#fff' }}>
              {Math.round(dailyGoalProgress)}%
            </Text>
          </ProgressRing>
        </View>
      </Card>

      {/* Stats Row */}
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        <Card style={{ flex: 1, alignItems: 'center' }} padding={12}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.primary, marginBottom: 2 }}>
            {user.streak}
          </Text>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>Day Streak {'\u{1F525}'}</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }} padding={12}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.accent, marginBottom: 2 }}>
            {user.level}
          </Text>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>Level {'\u{2B50}'}</Text>
        </Card>
        <Card style={{ flex: 1, alignItems: 'center' }} padding={12}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.warning, marginBottom: 2 }}>
            {user.xp}
          </Text>
          <Text style={{ fontSize: 11, color: colors.textSecondary }}>Total XP</Text>
        </Card>
      </View>

      {/* Recommended Games */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Recommended For You
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Training')}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary }}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {recommendedGames.map(game => (
            <Card
              key={game.id}
              onPress={() => navigation.navigate('GameEngine', { gameId: game.id })}
              style={{ width: '48%', overflow: 'hidden' }}
              padding={14}
            >
              <View style={{
                position: 'absolute', top: -10, right: -10,
                width: 50, height: 50, borderRadius: 25,
                backgroundColor: game.color, opacity: 0.1,
              }} />
              <Text style={{ fontSize: 28 }}>{game.icon}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, marginTop: 8, marginBottom: 4 }}>
                {game.title}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary, lineHeight: 16 }}>
                {game.description}
              </Text>
              <View style={{
                marginTop: 8, alignSelf: 'flex-start',
                paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6,
                backgroundColor: `${game.color}20`,
              }}>
                <Text style={{ fontSize: 10, fontWeight: '600', color: game.color }}>
                  {categoryInfo[game.category]?.name}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </View>

      {/* Today's Vocabulary */}
      <View style={{ marginBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>
            Today's Words
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Vocabulary')}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary }}>View All</Text>
          </TouchableOpacity>
        </View>
        {todaysWords.slice(0, 2).map(word => (
          <Card key={word.id} onPress={() => navigation.navigate('Vocabulary')} style={{ marginBottom: 8 }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 }}>
                {word.word}
              </Text>
              <View style={{
                alignSelf: 'flex-start', paddingVertical: 2, paddingHorizontal: 6,
                borderRadius: 4, backgroundColor: `${colors.primary}15`,
              }}>
                <Text style={{ fontSize: 11, color: colors.primary, fontWeight: '600' }}>
                  {word.partOfSpeech}
                </Text>
              </View>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 8, lineHeight: 18 }}>
                {word.definition}
              </Text>
            </View>
          </Card>
        ))}
      </View>

      {/* Quick Skills Overview */}
      <View>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 }}>
          Skill Overview
        </Text>
        <Card>
          {Object.entries(categoryInfo).map(([key, info], index, arr) => {
            const level = user.skillLevels[key as keyof typeof user.skillLevels];
            const percentage = (level / 10) * 100;
            return (
              <View key={key} style={{
                flexDirection: 'row', alignItems: 'center', gap: 12,
                paddingVertical: 8,
                borderBottomWidth: index < arr.length - 1 ? 1 : 0,
                borderBottomColor: colors.border,
              }}>
                <Text style={{ fontSize: 20, width: 28 }}>{info.icon}</Text>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{info.name}</Text>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      Lv {Math.floor(level)}
                    </Text>
                  </View>
                  <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.bgTertiary, overflow: 'hidden' }}>
                    <View style={{
                      height: '100%', borderRadius: 3, backgroundColor: info.color,
                      width: `${percentage}%`,
                    }} />
                  </View>
                </View>
              </View>
            );
          })}
        </Card>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
