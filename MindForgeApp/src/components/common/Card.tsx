import React from 'react';
import { TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
  backgroundColor?: string;
}

const Card: React.FC<CardProps> = ({ children, onPress, style, padding = 16, backgroundColor }) => {
  const { colors } = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: backgroundColor || colors.card,
    borderRadius: 16,
    padding,
    borderWidth: backgroundColor ? 0 : 1,
    borderColor: backgroundColor ? 'transparent' : colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[cardStyle, style]}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[cardStyle, style]}>
      {children}
    </View>
  );
};

export default Card;
