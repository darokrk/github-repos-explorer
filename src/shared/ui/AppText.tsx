import type { TextProps } from 'react-native';
import { StyleSheet, Text } from 'react-native';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

export type AppTextVariant = 'title' | 'heading' | 'body' | 'label' | 'caption' | 'mono';
export type AppTextTone = 'default' | 'muted' | 'accent' | 'danger' | 'star';

export interface AppTextProps extends TextProps {
  readonly variant?: AppTextVariant;
  readonly tone?: AppTextTone;
}

const variantStyles = StyleSheet.create({
  title: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.3 },
  heading: { fontSize: 17, lineHeight: 22, fontWeight: '600' },
  body: { fontSize: 15, lineHeight: 21, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '400' },
  mono: { fontSize: 13, lineHeight: 18, fontWeight: '500', fontVariant: ['tabular-nums'] },
});

const createToneStyles = (theme: Theme) =>
  StyleSheet.create({
    default: { color: theme.colors.text },
    muted: { color: theme.colors.textMuted },
    accent: { color: theme.colors.accent },
    danger: { color: theme.colors.danger },
    star: { color: theme.colors.star },
  });

export function AppText({ variant = 'body', tone = 'default', style, ...rest }: AppTextProps) {
  const toneStyles = useThemedStyles(createToneStyles);
  return <Text {...rest} style={[variantStyles[variant], toneStyles[tone], style]} />;
}
