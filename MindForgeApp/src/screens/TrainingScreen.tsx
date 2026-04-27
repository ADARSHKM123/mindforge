import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import Card from '../components/common/Card';
import { gameConfigs, categoryInfo } from '../data/games';
import { SkillCategory } from '../types';

const TrainingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors } = useTheme();
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | 'all'>('all');

  const categories = Object.entries(categoryInfo);
  const filteredGames = selectedCategory === 'all'
    ? gameConfigs
    : gameConfigs.filter(g => g.category === selectedCategory);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 4 }}>
        Training
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 20 }}>
        Choose a category to start training
      </Text>

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 20 }}
        contentContainerStyle={{ gap: 8, paddingRight: 16 }}>
        <TouchableOpacity
          onPress={() => setSelectedCategory('all')}
          style={{
            paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
            backgroundColor: selectedCategory === 'all' ? colors.primary : colors.bgTertiary,
          }}>
          <Text style={{
            fontSize: 13, fontWeight: '600',
            color: selectedCategory === 'all' ? '#fff' : colors.textSecondary,
          }}>All Games</Text>
        </TouchableOpacity>
        {categories.map(([key, info]) => (
          <TouchableOpacity
            key={key}
            onPress={() => setSelectedCategory(key as SkillCategory)}
            style={{
              paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
              backgroundColor: selectedCategory === key ? info.color : colors.bgTertiary,
            }}>
            <Text style={{
              fontSize: 13, fontWeight: '600',
              color: selectedCategory === key ? '#fff' : colors.textSecondary,
            }}>{info.icon} {info.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Cards (when All is selected) */}
      {selectedCategory === 'all' && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
          {categories.map(([key, info]) => {
            const level = user.skillLevels[key as SkillCategory];
            return (
              <Card
                key={key}
                onPress={() => setSelectedCategory(key as SkillCategory)}
                padding={14}
                style={{ width: '48%', overflow: 'hidden' }}
              >
                <View style={{
                  position: 'absolute', top: -15, right: -15,
                  width: 60, height: 60, borderRadius: 30,
                  backgroundColor: info.color, opacity: 0.12,
                }} />
                <Text style={{ fontSize: 32 }}>{info.icon}</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginTop: 8, marginBottom: 2 }}>
                  {info.name}
                </Text>
                <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 8, lineHeight: 15 }}>
                  {info.description}
                </Text>
                <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.bgTertiary }}>
                  <View style={{
                    height: '100%', borderRadius: 2, backgroundColor: info.color,
                    width: `${(level / 10) * 100}%`,
                  }} />
                </View>
                <Text style={{ fontSize: 10, color: info.color, fontWeight: '600', marginTop: 4 }}>
                  Level {Math.floor(level)}
                </Text>
              </Card>
            );
          })}
        </View>
      )}

      {/* Game List */}
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 12 }}>
        {selectedCategory === 'all' ? 'All Games' : `${categoryInfo[selectedCategory].name} Games`}
      </Text>
      <View style={{ gap: 10 }}>
        {filteredGames.map(game => (
          <Card key={game.id} onPress={() => navigation.navigate('GameEngine', { gameId: game.id })} padding={14}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
              <View style={{
                width: 52, height: 52, borderRadius: 14,
                backgroundColor: `${game.color}18`,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 26 }}>{game.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 3 }}>
                  {game.title}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                  {game.description}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <View style={{
                  paddingVertical: 3, paddingHorizontal: 8, borderRadius: 6,
                  backgroundColor: game.difficulty === 'hard' ? `${colors.error}20` :
                    game.difficulty === 'medium' ? `${colors.warning}20` : `${colors.success}20`,
                }}>
                  <Text style={{
                    fontSize: 10, fontWeight: '600', textTransform: 'capitalize',
                    color: game.difficulty === 'hard' ? colors.error :
                      game.difficulty === 'medium' ? colors.warning : colors.success,
                  }}>{game.difficulty}</Text>
                </View>
                <Text style={{ fontSize: 11, color: colors.textTertiary, marginTop: 4 }}>
                  {game.duration}s
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

export default TrainingScreen;
