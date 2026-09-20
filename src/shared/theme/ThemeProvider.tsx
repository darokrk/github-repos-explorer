import type { ReactNode } from 'react';
import { createContext, use } from 'react';
import { useColorScheme } from 'react-native';
import type { Theme } from './theme';
import { lightTheme, resolveColorScheme, themeForScheme } from './theme';
import { selectThemePreference, useThemePreferenceStore } from './themePreferenceStore';

const ThemeContext = createContext<Theme>(lightTheme);

export function ThemeProvider({ children }: { readonly children: ReactNode }) {
  const systemScheme = useColorScheme();
  const preference = useThemePreferenceStore(selectThemePreference);

  const scheme = resolveColorScheme(preference, systemScheme);

  return <ThemeContext value={themeForScheme(scheme)}>{children}</ThemeContext>;
}

export function useTheme(): Theme {
  return use(ThemeContext);
}
