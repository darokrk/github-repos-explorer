import { GITHUB_API_BASE_URL, GITHUB_API_VERSION } from '@/shared/config/github';
import { GitHubError } from './githubError';

export interface GitHubRequest {
  readonly path: string;
  readonly searchParams?: Readonly<Record<string, string | number>>;
  readonly signal?: AbortSignal;
}

export interface GitHubClient {
  request: <TResponse>(request: GitHubRequest) => Promise<TResponse>;
}

function buildUrl(path: string, searchParams: GitHubRequest['searchParams']): string {
  if (!searchParams) {
    return `${GITHUB_API_BASE_URL}${path}`;
  }
  const query = Object.entries(searchParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');
  return query ? `${GITHUB_API_BASE_URL}${path}?${query}` : `${GITHUB_API_BASE_URL}${path}`;
}

function isRateLimited(response: Response): boolean {
  if (response.status === 429) {
    return true;
  }
  return response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0';
}

function secondsUntilReset(response: Response): number | undefined {
  const retryAfter = response.headers.get('retry-after');
  if (retryAfter !== null) {
    const parsed = Number.parseInt(retryAfter, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  const resetAt = response.headers.get('x-ratelimit-reset');
  if (resetAt !== null) {
    const parsed = Number.parseInt(resetAt, 10);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.ceil(parsed - Date.now() / 1000));
    }
  }
  return undefined;
}

function toGitHubError(response: Response): GitHubError {
  if (isRateLimited(response)) {
    const retryAfterSeconds = secondsUntilReset(response);
    return new GitHubError('GitHub API rate limit reached.', {
      kind: 'rate-limit',
      status: response.status,
      ...(retryAfterSeconds === undefined ? {} : { retryAfterSeconds }),
    });
  }
  if (response.status === 404) {
    return new GitHubError('Repository not found.', { kind: 'not-found', status: 404 });
  }
  if (response.status === 422) {
    return new GitHubError('GitHub could not understand that query.', {
      kind: 'invalid-query',
      status: 422,
    });
  }
  if (response.status >= 500) {
    return new GitHubError('GitHub is having trouble right now.', {
      kind: 'server',
      status: response.status,
    });
  }
  return new GitHubError(`GitHub request failed with status ${response.status}.`, {
    kind: 'unknown',
    status: response.status,
  });
}

export function createGitHubClient(accessToken?: string): GitHubClient {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return {
    async request<TResponse>({ path, searchParams, signal }: GitHubRequest): Promise<TResponse> {
      let response: Response;
      try {
        response = await fetch(buildUrl(path, searchParams), {
          headers,
          ...(signal ? { signal } : {}),
        });
      } catch (cause) {
        if (cause instanceof Error && cause.name === 'AbortError') {
          throw cause;
        }
        throw new GitHubError('No connection to GitHub.', { kind: 'offline', cause });
      }

      if (!response.ok) {
        throw toGitHubError(response);
      }

      return (await response.json()) as TResponse;
    },
  };
}

export const githubClient = createGitHubClient();
