import { StyleSheet, View } from 'react-native';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { ActionButton } from './ActionButton';
import { AppText } from './AppText';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: {
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: theme.spacing.xl,
      paddingVertical: theme.spacing.xl * 2,
      gap: theme.spacing.sm,
    },
    centered: { textAlign: 'center' },
    action: { marginTop: theme.spacing.md },
  });

export interface MessageViewProps {
  readonly title: string;
  readonly detail: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

export function MessageView({ title, detail, actionLabel, onAction }: MessageViewProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root}>
      <AppText variant="heading" style={styles.centered}>
        {title}
      </AppText>
      <AppText variant="body" tone="muted" style={styles.centered}>
        {detail}
      </AppText>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <ActionButton label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}
