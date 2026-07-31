import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { theme, colors } from '@/theme/index';

type ActiveColors = typeof colors | typeof colors.dark;

interface ThemeContextValue {
  theme: typeof theme;
  colors: ActiveColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme,
  colors,
  isDark: false,
});

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const isDark = systemScheme === 'dark';

  const activeColors = isDark ? colors.dark : colors;

  return (
    <ThemeContext.Provider value={{ theme, colors: activeColors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
