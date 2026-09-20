import { StyleSheet, View } from 'react-native';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { Screen } from '@/shared/ui';
import { RepositoryResults } from './RepositoryResults';
import { SearchField } from './SearchField';
import { SortSelector } from './SortSelector';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.sm,
      paddingBottom: theme.spacing.md,
      gap: theme.spacing.md,
    },
  });

export function RepositorySearchScreen() {
  const styles = useThemedStyles(createStyles);

  return (
    <Screen>
      <View style={styles.header}>
        <SearchField />
        <SortSelector />
      </View>
      <RepositoryResults />
    </Screen>
  );
}
