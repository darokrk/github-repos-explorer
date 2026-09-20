import { StyleSheet, View } from 'react-native';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText } from './AppText';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    badge: {
      borderRadius: theme.radius.pill,
      borderCurve: 'continuous',
      borderWidth: StyleSheet.hairlineWidth,
      backgroundColor: theme.colors.surfaceMuted,
    },
    sm: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: 1,
      borderColor: theme.colors.borderStrong,
    },
    md: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs + 2,
      borderColor: theme.colors.border,
    },
  });

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  readonly label: string;
  readonly size?: BadgeSize;
}

export function Badge({ label, size = 'md' }: BadgeProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={[styles.badge, styles[size]]}>
      <AppText variant={size === 'sm' ? 'caption' : 'label'} tone="muted">
        {label}
      </AppText>
    </View>
  );
}
