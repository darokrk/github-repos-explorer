import { StyleSheet, View } from 'react-native';
import type { Repository } from '@/shared/api/github';
import { formatCompactCount } from '@/shared/lib/formatCompactCount';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText } from '@/shared/ui';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    grid: { flexDirection: 'row', gap: theme.spacing.sm },
    cell: {
      flex: 1,
      alignItems: 'center',
      gap: 2,
      paddingVertical: theme.spacing.md,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderCurve: 'continuous',
    },
  });

export function RepositoryStats({ repository }: { readonly repository: Repository }) {
  const styles = useThemedStyles(createStyles);

  const stats: ReadonlyArray<{ key: string; label: string; value: number }> = [
    { key: 'stars', label: 'Stars', value: repository.starCount },
    { key: 'forks', label: 'Forks', value: repository.forkCount },
    ...(repository.watcherCount === null
      ? []
      : [{ key: 'watchers', label: 'Watchers', value: repository.watcherCount }]),
    { key: 'issues', label: 'Open issues', value: repository.openIssueCount },
  ];

  return (
    <View style={styles.grid}>
      {stats.map(stat => (
        <View key={stat.key} style={styles.cell}>
          <AppText variant="heading">{formatCompactCount(stat.value)}</AppText>
          <AppText variant="caption" tone="muted">
            {stat.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}
