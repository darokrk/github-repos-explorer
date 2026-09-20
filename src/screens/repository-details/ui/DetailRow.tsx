import { StyleSheet, View } from 'react-native';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText } from '@/shared/ui';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    value: { flexShrink: 1, textAlign: 'right' },
  });

export function DetailRow({ label, value }: { readonly label: string; readonly value: string }) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <AppText variant="caption" tone="muted">
        {label}
      </AppText>
      <AppText variant="label" numberOfLines={1} style={styles.value}>
        {value}
      </AppText>
    </View>
  );
}
