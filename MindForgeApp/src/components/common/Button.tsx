import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  children, onPress, variant = 'primary', size = 'medium',
  fullWidth = false, disabled = false, style, textStyle,
}) => {
  const { colors } = useTheme();

  const sizeStyles: Record<string, { paddingVertical: number; paddingHorizontal: number; fontSize: number }> = {
    small: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 13 },
    medium: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 15 },
    large: { paddingVertical: 16, paddingHorizontal: 32, fontSize: 17 },
  };

  const variantStyles: Record<string, { bg: string; textColor: string; borderColor?: string }> = {
    primary: { bg: colors.primary, textColor: '#FFFFFF' },
    secondary: { bg: colors.bgTertiary, textColor: colors.text, borderColor: colors.border },
    ghost: { bg: 'transparent', textColor: colors.primary },
  };

  const s = sizeStyles[size];
  const v = variantStyles[variant];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        {
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          borderRadius: 12,
          backgroundColor: v.bg,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
          borderWidth: v.borderColor ? 1 : 0,
          borderColor: v.borderColor || 'transparent',
        },
        style,
      ]}
    >
      {typeof children === 'string' ? (
        <Text style={[{ fontSize: s.fontSize, fontWeight: '600', color: v.textColor, letterSpacing: 0.3 }, textStyle]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;
