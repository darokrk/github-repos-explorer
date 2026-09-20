import { Pressable, StyleSheet, View } from 'react-native';
import type { RepositoryOwner } from '@/shared/api/github';
import { DETAIL_AVATAR_SIZE } from '@/shared/config/github';
import { openExternalUrl } from '../lib/openExternalUrl';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText, Avatar } from '@/shared/ui';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    panel: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.lg },
    identity: { flex: 1, gap: 2 },
    pressed: { opacity: 0.6 },
  });

export function OwnerPanel({ owner }: { readonly owner: RepositoryOwner }) {
  const styles = useThemedStyles(createStyles);

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Open ${owner.login} on GitHub`}
      onPress={() => {
        void openExternalUrl(owner.profileUrl);
      }}
      style={({ pressed }) => [styles.panel, pressed ? styles.pressed : null]}
    >
      <Avatar url={owner.avatarUrl} size={DETAIL_AVATAR_SIZE} rounded />
      <View style={styles.identity}>
        <AppText variant="heading">{owner.login}</AppText>
        <AppText variant="caption" tone="muted">
          {owner.kind === 'organization' ? 'Organization' : 'User'}
        </AppText>
        <AppText variant="caption" tone="accent">
          View profile on GitHub
        </AppText>
      </View>
    </Pressable>
  );
}
