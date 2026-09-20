import { FlashList } from '@shopify/flash-list';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import type { Repository } from '@/shared/api/github';
import { useRepositorySearch } from '@/shared/api/github';
import { formatCompactCount } from '@/shared/lib/formatCompactCount';
import type { Theme } from '@/shared/theme/theme';
import { useTheme } from '@/shared/theme/ThemeProvider';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { AppText, ErrorView, InlineNotice, MessageView, OfflinePendingView } from '@/shared/ui';
import { selectSort, selectTerm, useRepositorySearchStore } from '../model/repositorySearchStore';
import { RepositoryCard } from './RepositoryCard';
import { RepositorySkeletonList } from './RepositorySkeletonList';

const keyExtractor = (repository: Repository) => String(repository.id);

const renderRepository = ({ item }: { item: Repository }) => <RepositoryCard repository={item} />;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: { flex: 1 },
    summary: {
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.sm,
    },
    notice: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.sm },
    footer: { paddingVertical: theme.spacing.xl, alignItems: 'center' },
    footerNotice: { paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.lg },
  });

export function RepositoryResults() {
  const styles = useThemedStyles(createStyles);
  const theme = useTheme();
  const term = useRepositorySearchStore(selectTerm);
  const sort = useRepositorySearchStore(selectSort);

  const {
    data,
    error,
    fetchStatus,
    isPending,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
    isRefetching,
  } = useRepositorySearch(term, sort);

  if (term.length === 0) {
    return (
      <MessageView
        title="Search GitHub"
        detail="Type a keyword such as “react-native” to explore public repositories."
      />
    );
  }

  if (isPending && fetchStatus === 'paused') {
    return <OfflinePendingView />;
  }

  if (isPending) {
    return <RepositorySkeletonList />;
  }

  if (error && !data) {
    return (
      <ErrorView
        error={error}
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  const repositories = data?.repositories ?? [];

  if (repositories.length === 0) {
    return (
      <MessageView
        title="No repositories found"
        detail={`Nothing on GitHub matches “${term}”. Try a different keyword.`}
      />
    );
  }

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
      void fetchNextPage();
    }
  };

  const hasRefreshError = Boolean(error) && !isFetchNextPageError;

  return (
    <View style={styles.root}>
      <View style={styles.summary}>
        <AppText variant="caption" tone="muted">
          {formatCompactCount(data?.totalCount ?? 0)} repositories · {repositories.length} loaded
        </AppText>
      </View>

      {hasRefreshError ? (
        <View style={styles.notice}>
          <InlineNotice
            message="Could not refresh — showing the results already loaded."
            actionLabel="Try again"
            onAction={() => {
              void refetch();
            }}
          />
        </View>
      ) : null}

      <FlashList
        data={repositories}
        renderItem={renderRepository}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.6}
        refreshing={isRefetching}
        onRefresh={() => {
          void refetch();
        }}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator color={theme.colors.textMuted} />
            </View>
          ) : isFetchNextPageError ? (
            <View style={styles.footerNotice}>
              <InlineNotice
                message="Could not load more repositories."
                actionLabel="Try again"
                onAction={() => {
                  void fetchNextPage();
                }}
              />
            </View>
          ) : null
        }
      />
    </View>
  );
}
