import { QueryClient, QueryClientProvider, onlineManager } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import type { RepositoryDto } from '@/shared/api/github';
import { githubClient, repositoryQueryKeys } from '@/shared/api/github';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { useRepositorySearchStore } from '../model/repositorySearchStore';
import { RepositoryResults } from './RepositoryResults';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('@/shared/api/github/githubClient', () => ({
  githubClient: { request: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    getItem: jest.fn(async () => null),
    setItem: jest.fn(async () => undefined),
    removeItem: jest.fn(async () => undefined),
  },
}));

const request = githubClient.request as jest.Mock;

const dto: RepositoryDto = {
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
  homepage: '',
  stargazers_count: 123456,
  forks_count: 24000,
  open_issues_count: 700,
  watchers_count: 123456,
  subscribers_count: 3500,
  license: { spdx_id: 'MIT', name: 'MIT License' },
  default_branch: 'main',
  archived: false,
  fork: false,
  created_at: '2015-01-09T18:10:16Z',
  updated_at: '2026-09-16T10:00:00Z',
  pushed_at: '2026-09-16T09:00:00Z',
};

const firstPage = { total_count: 1, incomplete_results: false, items: [dto] };

let queryClient: QueryClient;

function renderResults() {
  queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );

  return render(<RepositoryResults />, { wrapper });
}

beforeEach(() => {
  request.mockReset();
  useRepositorySearchStore.setState({ term: 'react-native', sort: 'best-match' });
});

afterEach(() => {
  queryClient.clear();
  onlineManager.setOnline(true);
});

describe('RepositoryResults', () => {
  it('explains the empty screen instead of loading forever when an uncached search is paused offline', async () => {
    onlineManager.setOnline(false);

    renderResults();

    await waitFor(() => {
      expect(screen.getByText('No connection')).toBeVisible();
    });
    expect(request).not.toHaveBeenCalled();
  });

  it('keeps the loaded results on screen and reports a failed refresh instead of swallowing it', async () => {
    request.mockResolvedValueOnce(firstPage);

    renderResults();

    await screen.findByText('1 repositories · 1 loaded');

    request.mockRejectedValueOnce(new Error('network down'));
    await act(async () => {
      await queryClient.refetchQueries({
        queryKey: repositoryQueryKeys.search('react-native', 'best-match'),
      });
    });

    expect(
      await screen.findByText('Could not refresh — showing the results already loaded.'),
    ).toBeVisible();
    expect(screen.getByText('1 repositories · 1 loaded')).toBeVisible();
  });
});
