export interface Palette {
  readonly background: string;
  readonly surface: string;
  readonly surfaceMuted: string;
  readonly border: string;
  readonly borderStrong: string;
  readonly text: string;
  readonly textMuted: string;
  readonly textInverted: string;
  readonly accent: string;
  readonly accentSurface: string;
  readonly star: string;
  readonly danger: string;
  readonly dangerSurface: string;
  readonly skeleton: string;
}

export const lightPalette: Palette = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceMuted: '#F6F8FA',
  border: '#D1D9E0',
  borderStrong: '#AFB8C1',
  text: '#1F2328',
  textMuted: '#59636E',
  textInverted: '#FFFFFF',
  accent: '#0969DA',
  accentSurface: '#DDF4FF',
  star: '#BF8700',
  danger: '#CF222E',
  dangerSurface: '#FFEBE9',
  skeleton: '#EAEEF2',
};

export const darkPalette: Palette = {
  background: '#0D1117',
  surface: '#151B23',
  surfaceMuted: '#10161F',
  border: '#3D444D',
  borderStrong: '#565E68',
  text: '#F0F6FC',
  textMuted: '#9198A1',
  textInverted: '#0D1117',
  accent: '#4493F8',
  accentSurface: '#121D2F',
  star: '#E3B341',
  danger: '#F85149',
  dangerSurface: '#25171C',
  skeleton: '#21262D',
};
