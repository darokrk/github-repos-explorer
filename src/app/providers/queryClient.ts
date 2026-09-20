import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { isGitHubError } from '@/shared/api/github';
import { OFFLINE_CACHE_MAX_AGE_MS } from '@/shared/config/github';

const MAX_RETRIES = 2;
const CACHE_VERSION = 'v1';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: OFFLINE_CACHE_MAX_AGE_MS,
      retry: (failureCount, error) => {
        if (isGitHubError(error)) {
          return error.isRetryable && failureCount < MAX_RETRIES;
        }
        return failureCount < MAX_RETRIES;
      },
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnReconnect: true,
    },
  },
});

export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: `github-explorer-query-cache-${CACHE_VERSION}`,
  throttleTime: 2000,
});

export const persistOptions = {
  persister: queryPersister,
  maxAge: OFFLINE_CACHE_MAX_AGE_MS,
  buster: CACHE_VERSION,
  dehydrateOptions: {
    shouldDehydrateQuery: ({ state }: { state: { status: string } }) => state.status === 'success',
  },
};
