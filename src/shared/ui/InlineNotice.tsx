import { Pressable, StyleSheet, View } from 'react-native';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText } from './AppText';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    notice: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.dangerSurface,
      borderRadius: theme.radius.md,
      borderCurve: 'continuous',
    },
    message: { flex: 1 },
    pressed: { opacity: 0.6 },
  });

export interface InlineNoticeProps {
  readonly message: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export function InlineNotice({ message, actionLabel, onAction }: InlineNoticeProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.notice}>
      <AppText variant="caption" tone="danger" style={styles.message}>
        {message}
      </AppText>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={onAction}
          style={({ pressed }) => (pressed ? styles.pressed : null)}
        >
          <AppText variant="label" tone="danger">
            {actionLabel}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
