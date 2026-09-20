import type { Palette } from './palette';
import { darkPalette, lightPalette } from './palette';

export type ColorSchemeName = 'light' | 'dark';

export type ThemePreference = 'system' | 'light' | 'dark';

export function resolveColorScheme(
  preference: ThemePreference,
  systemScheme: ColorSchemeName | null | undefined,
): ColorSchemeName {
  if (preference !== 'system') {
    return preference;
  }
  return systemScheme === 'dark' ? 'dark' : 'light';
}

export interface Theme {
  readonly scheme: ColorSchemeName;
  readonly colors: Palette;
  readonly spacing: {
    readonly xs: number;
    readonly sm: number;
    readonly md: number;
    readonly lg: number;
    readonly xl: number;
  };
  readonly radius: {
    readonly sm: number;
    readonly md: number;
    readonly lg: number;
    readonly pill: number;
  };
}

const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
const radius = { sm: 6, md: 10, lg: 14, pill: 999 } as const;

export const lightTheme: Theme = { scheme: 'light', colors: lightPalette, spacing, radius };
export const darkTheme: Theme = { scheme: 'dark', colors: darkPalette, spacing, radius };

export function themeForScheme(scheme: ColorSchemeName): Theme {
  return scheme === 'dark' ? darkTheme : lightTheme;
}
