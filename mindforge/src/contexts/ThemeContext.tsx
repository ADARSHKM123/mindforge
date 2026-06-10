import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeMode } from '../types';
import { storage } from '../core/storage';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Dark-first: dark is the product's default; light remains a user choice.
  const [theme, setTheme] = useState<ThemeMode>(() =>
    storage.get<ThemeMode | null>('theme', null) ?? 'dark'
  );

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      storage.set('theme', next);
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
