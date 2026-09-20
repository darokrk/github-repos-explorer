import { Pressable, StyleSheet } from 'react-native';
import type { Theme, ThemePreference } from '@/shared/theme/theme';
import {
  selectCycleThemePreference,
  selectThemePreference,
  useThemePreferenceStore,
} from '@/shared/theme/themePreferenceStore';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText } from '@/shared/ui';

const labels: Readonly<Record<ThemePreference, string>> = {
  system: 'Auto',
  light: 'Light',
  dark: 'Dark',
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    button: {
      minWidth: 64,
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: 2,
    },
    pressed: { opacity: 0.4 },
  });

export function ThemeToggle() {
  const styles = useThemedStyles(createStyles);
  const preference = useThemePreferenceStore(selectThemePreference);
  const cyclePreference = useThemePreferenceStore(selectCycleThemePreference);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Theme: ${labels[preference]}. Double tap to change.`}
      hitSlop={16}
      onPress={cyclePreference}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
    >
      <AppText variant="label" tone="accent">
        {labels[preference]}
      </AppText>
    </Pressable>
  );
}
