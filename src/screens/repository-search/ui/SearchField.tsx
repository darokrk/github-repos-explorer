import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SEARCH_DEBOUNCE_MS } from '@/shared/config/github';
import { useDebouncedCallback } from '../lib/useDebouncedCallback';
import type { Theme } from '@/shared/theme/theme';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText } from '@/shared/ui';
import { SearchGlyph } from './SearchGlyph';
import {
  selectSetTerm,
  selectTerm,
  useRepositorySearchStore,
} from '../model/repositorySearchStore';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      borderCurve: 'continuous',
    },
    input: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
    },
    clear: {
      width: 22,
      height: 22,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 11,
      backgroundColor: theme.colors.borderStrong,
    },
    clearLabel: { color: theme.colors.surfaceMuted, lineHeight: 16 },
  });

export function SearchField() {
  const styles = useThemedStyles(createStyles);
  const theme = useTheme();
  const setTerm = useRepositorySearchStore(selectSetTerm);
  const restoredTerm = useRepositorySearchStore(selectTerm);
  const [typedValue, setTypedValue] = useState<string | null>(null);
  const { run: commitTerm, cancel: cancelCommit } = useDebouncedCallback(
    setTerm,
    SEARCH_DEBOUNCE_MS,
  );

  const value = typedValue ?? restoredTerm;

  const handleChangeText = (nextValue: string) => {
    setTypedValue(nextValue);
    commitTerm(nextValue);
  };

  const handleClear = () => {
    cancelCommit();
    setTypedValue('');
    setTerm('');
  };

  return (
    <View style={styles.field}>
      <SearchGlyph />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleChangeText}
        placeholder="Search repositories"
        placeholderTextColor={theme.colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="never"
        accessibilityLabel="Search GitHub repositories"
      />
      {value.length > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={8}
          onPress={handleClear}
          style={styles.clear}
        >
          <AppText variant="label" style={styles.clearLabel}>
            ✕
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
