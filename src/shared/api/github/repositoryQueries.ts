import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  DETAIL_STALE_TIME_MS,
  SEARCH_PAGE_SIZE,
  SEARCH_RESULT_HARD_LIMIT,
  SEARCH_STALE_TIME_MS,
} from '@/shared/config/github';
import { githubClient } from './githubClient';
import type { Repository, RepositoryDto, RepositorySearchResponseDto } from './repository';
import { toRepository } from './repository';

export type RepositorySortOption = 'best-match' | 'stars' | 'updated';

export interface RepositorySearchPage {
  readonly items: readonly Repository[];
  readonly totalCount: number;
  readonly isIncomplete: boolean;
  readonly nextPage: number | null;
}

export const repositoryQueryKeys = {
  root: ['github', 'repositories'] as const,
  searchRoot: ['github', 'repositories', 'search'] as const,
  search: (term: string, sort: RepositorySortOption) =>
    ['github', 'repositories', 'search', term, sort] as const,
  detail: (owner: string, name: string) =>
    ['github', 'repositories', 'detail', owner, name] as const,
};

function sortSearchParams(sort: RepositorySortOption): Record<string, string> {
  return sort === 'best-match' ? {} : { sort, order: 'desc' };
}

async function fetchRepositoryPage(
  term: string,
  sort: RepositorySortOption,
  page: number,
  signal: AbortSignal,
): Promise<RepositorySearchPage> {
  const response = await githubClient.request<RepositorySearchResponseDto>({
    path: '/search/repositories',
    searchParams: { q: term, per_page: SEARCH_PAGE_SIZE, page, ...sortSearchParams(sort) },
    signal,
  });

  const reachableCount = Math.min(response.total_count, SEARCH_RESULT_HARD_LIMIT);
  const loadedCount = (page - 1) * SEARCH_PAGE_SIZE + response.items.length;
  const hasMore = response.items.length === SEARCH_PAGE_SIZE && loadedCount < reachableCount;

  return {
    items: response.items.map(toRepository),
    totalCount: response.total_count,
    isIncomplete: response.incomplete_results,
    nextPage: hasMore ? page + 1 : null,
  };
}

export interface RepositorySearchResult {
  readonly repositories: readonly Repository[];
  readonly totalCount: number;
  readonly isIncomplete: boolean;
}

function toSearchResult(data: InfiniteData<RepositorySearchPage, number>): RepositorySearchResult {
  const firstPage = data.pages[0];
  return {
    repositories: data.pages.flatMap(page => page.items),
    totalCount: firstPage?.totalCount ?? 0,
    isIncomplete: firstPage?.isIncomplete ?? false,
  };
}

export function repositorySearchQuery(term: string, sort: RepositorySortOption) {
  return infiniteQueryOptions({
    queryKey: repositoryQueryKeys.search(term, sort),
    queryFn: ({ pageParam, signal }) => fetchRepositoryPage(term, sort, pageParam, signal),
    initialPageParam: 1,
    getNextPageParam: (lastPage: RepositorySearchPage) => lastPage.nextPage,
    enabled: term.length > 0,
    staleTime: SEARCH_STALE_TIME_MS,
    select: toSearchResult,
  });
}

export function useRepositorySearch(term: string, sort: RepositorySortOption) {
  return useInfiniteQuery(repositorySearchQuery(term, sort));
}

export function findCachedRepository(
  queryClient: QueryClient,
  owner: string,
  name: string,
): Repository | undefined {
  const fullName = `${owner}/${name}`;
  const cachedPages = queryClient.getQueriesData<InfiniteData<RepositorySearchPage, number>>({
    queryKey: repositoryQueryKeys.searchRoot,
  });

  for (const [, data] of cachedPages) {
    if (!data) {
      continue;
    }
    for (const page of data.pages) {
      const match = page.items.find(item => item.fullName === fullName);
      if (match) {
        return match;
      }
    }
  }
  return undefined;
}

export function repositoryDetailQuery(owner: string, name: string) {
  return queryOptions({
    queryKey: repositoryQueryKeys.detail(owner, name),
    queryFn: async ({ signal }) => {
      const dto = await githubClient.request<RepositoryDto>({
        path: `/repos/${owner}/${name}`,
        signal,
      });
      return toRepository(dto);
    },
    staleTime: DETAIL_STALE_TIME_MS,
  });
}

export function useRepositoryDetail(owner: string, name: string) {
  const queryClient = useQueryClient();

  return useQuery({
    ...repositoryDetailQuery(owner, name),
    initialData: () => findCachedRepository(queryClient, owner, name),
    initialDataUpdatedAt: 0,
  });
}
