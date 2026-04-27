import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeMode } from '../types';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  bg: '#F8F9FA',
  bgSecondary: '#FFFFFF',
  bgTertiary: '#F0F2F5',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#5A4BD1',
  accent: '#00B894',
  border: '#E5E7EB',
  card: '#FFFFFF',
  cardHover: '#F9FAFB',
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#E17055',
  shadow: 'rgba(0,0,0,0.08)',
  overlay: 'rgba(0,0,0,0.5)',
  gradient1: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
  gradient2: 'linear-gradient(135deg, #00B894 0%, #55EFC4 100%)',
  gradient3: 'linear-gradient(135deg, #E17055 0%, #FAB1A0 100%)',
};

const darkColors = {
  bg: '#0F0F1A',
  bgSecondary: '#1A1A2E',
  bgTertiary: '#16213E',
  text: '#EAEAEA',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  primary: '#A29BFE',
  primaryLight: '#6C5CE7',
  primaryDark: '#C4B5FD',
  accent: '#55EFC4',
  border: '#2D2D44',
  card: '#1A1A2E',
  cardHover: '#16213E',
  success: '#55EFC4',
  warning: '#FFEAA7',
  error: '#FAB1A0',
  shadow: 'rgba(0,0,0,0.3)',
  overlay: 'rgba(0,0,0,0.7)',
  gradient1: 'linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%)',
  gradient2: 'linear-gradient(135deg, #00B894 0%, #55EFC4 100%)',
  gradient3: 'linear-gradient(135deg, #E17055 0%, #FAB1A0 100%)',
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  colors: lightColors,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('mindforge-theme');
    return (saved as ThemeMode) || 'dark';
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('mindforge-theme', next);
      return next;
    });
  }, []);

  const colors = theme === 'light' ? lightColors : darkColors;

  useEffect(() => {
    document.body.style.backgroundColor = colors.bg;
    document.body.style.color = colors.text;
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};
