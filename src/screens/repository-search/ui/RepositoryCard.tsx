import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, View } from 'react-native';
import type { Repository } from '@/shared/api/github';
import { LIST_AVATAR_SIZE } from '@/shared/config/github';
import { formatCompactCount } from '@/shared/lib/formatCompactCount';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';
import type { RootStackNavigation } from '@/shared/navigation/routeParams';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText, Avatar, Badge } from '@/shared/ui';
import { LanguageDot } from './LanguageDot';

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
    pressed: { backgroundColor: theme.colors.surfaceMuted },
    content: { flex: 1, gap: theme.spacing.xs },
    meta: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs + 2 },
  });

export function RepositoryCard({ repository }: { readonly repository: Repository }) {
  const styles = useThemedStyles(createStyles);
  const { navigate } = useNavigation<RootStackNavigation>();

  const handlePress = () => {
    navigate('RepositoryDetails', {
      owner: repository.owner.login,
      name: repository.name,
    });
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${repository.fullName}, ${repository.starCount} stars`}
      onPress={handlePress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      <Avatar url={repository.owner.avatarUrl} size={LIST_AVATAR_SIZE} />

      <View style={styles.content}>
        <AppText variant="heading" tone="accent" numberOfLines={1}>
          {repository.fullName}
        </AppText>

        {repository.description ? (
          <AppText variant="caption" tone="muted" numberOfLines={2}>
            {repository.description}
          </AppText>
        ) : null}

        <View style={styles.meta}>
          <AppText variant="mono" tone="star">
            ★ {formatCompactCount(repository.starCount)}
          </AppText>

          {repository.language ? (
            <>
              <LanguageDot language={repository.language} />
              <AppText variant="caption" tone="muted">
                {repository.language}
              </AppText>
            </>
          ) : null}

          <AppText variant="caption" tone="muted">
            · {formatRelativeTime(repository.updatedAt)}
          </AppText>

          {repository.isArchived ? <Badge label="Archived" size="sm" /> : null}
        </View>
      </View>
    </Pressable>
  );
}
