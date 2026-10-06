import { dark, light } from '@/theme';
import React, {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';
export type AppTheme = typeof light;

interface ThemeContextValue {
  theme: AppTheme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  color: AppTheme['color'];
  icon: AppTheme['icon'];
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: light,
  color: light.color,
  icon: light.icon,
  mode: 'system',
  setMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const resolvedTheme = useMemo<AppTheme>(() => {
    if (mode === 'dark') return dark;
    if (mode === 'light') return light;
    return systemScheme === 'dark' ? dark : light;
  }, [mode, systemScheme]);

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      mode,
      setMode,
      color: resolvedTheme.color,
      icon: resolvedTheme.icon,
    }),
    [resolvedTheme, mode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
