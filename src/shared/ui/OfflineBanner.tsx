import { StyleSheet, View } from 'react-native';
import { useIsOnline } from '@/shared/lib/useIsOnline';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText } from './AppText';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    banner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      backgroundColor: theme.colors.accentSurface,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.accent,
    },
  });

export function OfflineBanner() {
  const styles = useThemedStyles(createStyles);
  const isOnline = useIsOnline();

  if (isOnline) {
    return null;
  }

  return (
    <View
      testID="offline-banner"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={styles.banner}
    >
      <View style={styles.dot} />
      <AppText variant="label" tone="accent">
        No connection — requests are paused
      </AppText>
    </View>
  );
}
