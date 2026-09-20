import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useRepositoryDetail } from '@/shared/api/github';
import { formatRelativeTime } from '@/shared/lib/formatRelativeTime';
import { openExternalUrl } from '../lib/openExternalUrl';
import type { RootStackParamList } from '@/shared/navigation/routeParams';
import type { Theme } from '@/shared/theme/theme';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import {
  ActionButton,
  AppText,
  Badge,
  ErrorView,
  InlineNotice,
  OfflinePendingView,
  Screen,
} from '@/shared/ui';
import { DetailRow } from './DetailRow';
import { OwnerPanel } from './OwnerPanel';
import { RepositoryStats } from './RepositoryStats';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    content: { padding: theme.spacing.lg, gap: theme.spacing.xl, paddingBottom: theme.spacing.xl },
    loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    headline: { gap: theme.spacing.sm },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    topics: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
    section: { gap: theme.spacing.sm },
  });

export function RepositoryDetailsScreen() {
  const styles = useThemedStyles(createStyles);
  const theme = useTheme();
  const { params } = useRoute<RouteProp<RootStackParamList, 'RepositoryDetails'>>();
  const { data, error, fetchStatus, isPending, isFetching, refetch } = useRepositoryDetail(
    params.owner,
    params.name,
  );

  if (isPending && fetchStatus === 'paused') {
    return (
      <Screen>
        <OfflinePendingView detail="This repository has never been opened, so there is nothing cached to show. It loads by itself once the connection is back." />
      </Screen>
    );
  }

  if (isPending) {
    return (
      <Screen>
        <View style={styles.loader}>
          <ActivityIndicator color={theme.colors.textMuted} />
        </View>
      </Screen>
    );
  }

  if (!data) {
    return (
      <Screen>
        <ErrorView
          error={error}
          onRetry={() => {
            void refetch();
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {error ? (
          <InlineNotice
            message="Showing cached data — the latest version could not be loaded."
            actionLabel="Try again"
            onAction={() => {
              void refetch();
            }}
          />
        ) : null}

        <OwnerPanel owner={data.owner} />

        <View style={styles.headline}>
          <AppText variant="title">{data.name}</AppText>
          <AppText variant="body" tone="muted">
            {data.description ?? 'This repository has no description.'}
          </AppText>

          {data.isArchived || data.isFork || isFetching ? (
            <View style={styles.badgeRow}>
              {data.isArchived ? <Badge label="Archived" /> : null}
              {data.isFork ? <Badge label="Fork" /> : null}
              {isFetching ? <Badge label="Refreshing…" /> : null}
            </View>
          ) : null}
        </View>

        <RepositoryStats repository={data} />

        <View style={styles.section}>
          <AppText variant="label" tone="muted">
            ABOUT
          </AppText>
          <DetailRow label="Language" value={data.language ?? 'Not detected'} />
          <DetailRow label="License" value={data.license ?? 'None'} />
          <DetailRow label="Default branch" value={data.defaultBranch} />
          <DetailRow label="Created" value={formatRelativeTime(data.createdAt)} />
          <DetailRow label="Last updated" value={formatRelativeTime(data.updatedAt)} />
          {data.homepage ? <DetailRow label="Homepage" value={data.homepage} /> : null}
        </View>

        {data.topics.length > 0 ? (
          <View style={styles.section}>
            <AppText variant="label" tone="muted">
              TOPICS
            </AppText>
            <View style={styles.topics}>
              {data.topics.map(topic => (
                <Badge key={topic} label={topic} />
              ))}
            </View>
          </View>
        ) : null}

        <ActionButton
          label="Open on GitHub"
          onPress={() => {
            void openExternalUrl(data.repositoryUrl);
          }}
        />
      </ScrollView>
    </Screen>
  );
}
