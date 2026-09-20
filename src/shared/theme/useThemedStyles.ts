import { useMemo } from 'react';
import type { Theme } from './theme';
import { useTheme } from './ThemeProvider';

export function useThemedStyles<TStyles>(factory: (theme: Theme) => TStyles): TStyles {
  const theme = useTheme();
  return useMemo(() => factory(theme), [factory, theme]);
}
