import { StyleSheet, View } from 'react-native';
import { LIST_AVATAR_SIZE } from '@/shared/config/github';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const PLACEHOLDER_ROWS = [0, 1, 2, 3, 4, 5, 6, 7];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    avatar: {
      width: LIST_AVATAR_SIZE,
      height: LIST_AVATAR_SIZE,
      borderRadius: 8,
      borderCurve: 'continuous',
      backgroundColor: theme.colors.skeleton,
    },
    content: { flex: 1, gap: theme.spacing.sm, paddingVertical: 2 },
    bar: { height: 12, borderRadius: 6, backgroundColor: theme.colors.skeleton },
    barShort: { width: '45%' },
    barMedium: { width: '85%' },
    barTiny: { width: '30%' },
  });

export function RepositorySkeletonList() {
  const styles = useThemedStyles(createStyles);

  return (
    <View accessibilityLabel="Loading repositories" accessibilityRole="progressbar">
      {PLACEHOLDER_ROWS.map(row => (
        <View key={row} style={styles.row}>
          <View style={styles.avatar} />
          <View style={styles.content}>
            <View style={[styles.bar, styles.barShort]} />
            <View style={[styles.bar, styles.barMedium]} />
            <View style={[styles.bar, styles.barTiny]} />
          </View>
        </View>
      ))}
    </View>
  );
}
