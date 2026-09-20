import { Pressable, StyleSheet } from 'react-native';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText } from './AppText';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.xs + 2,
      borderRadius: theme.radius.pill,
      borderCurve: 'continuous',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceMuted,
    },
    selected: {
      borderColor: theme.colors.accent,
      backgroundColor: theme.colors.accentSurface,
    },
    pressed: { opacity: 0.6 },
  });

export interface ChipProps {
  readonly label: string;
  readonly isSelected: boolean;
  readonly onPress: () => void;
}

export function Chip({ label, isSelected, onPress }: ChipProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        isSelected ? styles.selected : null,
        pressed ? styles.pressed : null,
      ]}
    >
      <AppText variant="label" tone={isSelected ? 'accent' : 'muted'}>
        {label}
      </AppText>
    </Pressable>
  );
}
