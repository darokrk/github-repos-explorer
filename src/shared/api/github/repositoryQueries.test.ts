import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { createElement } from 'react';
import { githubClient } from './githubClient';
import { GitHubError } from './githubError';
import type { Repository } from './repository';
import { repositoryQueryKeys, useRepositoryDetail } from './repositoryQueries';

jest.mock('./githubClient', () => ({
  githubClient: { request: jest.fn() },
}));

const request = githubClient.request as jest.Mock;

const cachedRepository: Repository = {
  id: 29028775,
  name: 'react-native',
  fullName: 'facebook/react-native',
  owner: {
    login: 'facebook',
    avatarUrl: 'https://avatars.githubusercontent.com/u/69631?v=4',
    profileUrl: 'https://github.com/facebook',
    kind: 'organization',
  },
  description: 'A framework for building native applications using React',
  language: 'C++',
  repositoryUrl: 'https://github.com/facebook/react-native',
  homepage: 'https://reactnative.dev',
  starCount: 123456,
  forkCount: 24000,
  openIssueCount: 700,
  watcherCount: null,
  topics: ['react'],
  license: 'MIT',
  defaultBranch: 'main',
  isArchived: false,
  isFork: false,
  createdAt: '2015-01-09T18:10:16Z',
  updatedAt: '2026-09-16T10:00:00Z',
};

function createHarness() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });

  queryClient.setQueryData(repositoryQueryKeys.search('react-native', 'best-match'), {
    pageParams: [1],
    pages: [{ items: [cachedRepository], totalCount: 1, isIncomplete: false, nextPage: null }],
  });

  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);

  return { queryClient, wrapper };
}

describe('useRepositoryDetail', () => {
  afterEach(() => {
    request.mockReset();
  });

  it('keeps the record seeded from the search cache when the refresh fails offline', async () => {
    request.mockRejectedValue(new GitHubError('No connection to GitHub.', { kind: 'offline' }));
    const { wrapper } = createHarness();

    const { result } = renderHook(() => useRepositoryDetail('facebook', 'react-native'), {
      wrapper,
    });

    expect(result.current.data).toEqual(cachedRepository);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toEqual(cachedRepository);
  });

  it('replaces the seeded record once the network request succeeds', async () => {
    request.mockResolvedValue({
      id: 29028775,
      name: 'react-native',
      full_name: 'facebook/react-native',
      owner: {
        login: 'facebook',
        avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
        html_url: 'https://github.com/facebook',
        type: 'Organization',
      },
      description: 'A framework for building native applications using React',
      language: 'C++',
      html_url: 'https://github.com/facebook/react-native',
      homepage: 'https://reactnative.dev',
      stargazers_count: 123456,
      forks_count: 24000,
      open_issues_count: 700,
      watchers_count: 123456,
      subscribers_count: 3500,
      topics: ['react'],
      license: { spdx_id: 'MIT', name: 'MIT License' },
      default_branch: 'main',
      archived: false,
      fork: false,
      created_at: '2015-01-09T18:10:16Z',
      updated_at: '2026-09-16T10:00:00Z',
    });
    const { wrapper } = createHarness();

    const { result } = renderHook(() => useRepositoryDetail('facebook', 'react-native'), {
      wrapper,
    });

    expect(result.current.data?.watcherCount).toBeNull();

    await waitFor(() => expect(result.current.data?.watcherCount).toBe(3500));

    expect(request).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/repos/facebook/react-native' }),
    );
  });

  it('reports the error when nothing was cached to fall back on', async () => {
    request.mockRejectedValue(new GitHubError('Repository not found.', { kind: 'not-found' }));
    const { wrapper } = createHarness();

    const { result } = renderHook(() => useRepositoryDetail('unknown', 'missing'), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
  });
});
