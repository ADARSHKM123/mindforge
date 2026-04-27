import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface BottomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const tabIcons: Record<string, string> = {
  Home: '\u{1F3E0}',
  Training: '\u{1F9E0}',
  Vocabulary: '\u{1F4DA}',
  Profile: '\u{1F464}',
};

const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 70,
      backgroundColor: colors.bgSecondary,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingBottom: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 10,
    }}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel ?? options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={{
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 12,
              backgroundColor: isFocused ? `${colors.primary}15` : 'transparent',
            }}
          >
            <Text style={{ fontSize: 24 }}>{tabIcons[route.name] || '\u{2753}'}</Text>
            <Text style={{
              fontSize: 11,
              fontWeight: isFocused ? '700' : '500',
              color: isFocused ? colors.primary : colors.textSecondary,
              letterSpacing: 0.3,
            }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default BottomTabBar;
