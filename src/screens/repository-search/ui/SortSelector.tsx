import { StyleSheet, View } from 'react-native';
import type { RepositorySortOption } from '@/shared/api/github';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { Chip } from '@/shared/ui';
import {
  selectSetSort,
  selectSort,
  useRepositorySearchStore,
} from '../model/repositorySearchStore';

const sortOptions: ReadonlyArray<{ value: RepositorySortOption; label: string }> = [
  { value: 'best-match', label: 'Best match' },
  { value: 'stars', label: 'Most stars' },
  { value: 'updated', label: 'Recently updated' },
];

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: theme.spacing.sm },
  });

export function SortSelector() {
  const styles = useThemedStyles(createStyles);
  const sort = useRepositorySearchStore(selectSort);
  const setSort = useRepositorySearchStore(selectSetSort);

  return (
    <View style={styles.row}>
      {sortOptions.map(option => (
        <Chip
          key={option.value}
          label={option.label}
          isSelected={option.value === sort}
          onPress={() => setSort(option.value)}
        />
      ))}
    </View>
  );
}
