import { createGitHubClient } from './githubClient';
import { GitHubError } from './githubError';

const client = createGitHubClient();

function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), init);
}

describe('createGitHubClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('builds an encoded query string and returns the parsed payload', async () => {
    const fetchMock = jest.fn().mockResolvedValue(jsonResponse({ total_count: 1 }));
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    const result = await client.request({
      path: '/search/repositories',
      searchParams: { q: 'react native', per_page: 100 },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.github.com/search/repositories?q=react%20native&per_page=100',
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: 'application/vnd.github+json' }),
      }),
    );
    expect(result).toEqual({ total_count: 1 });
  });

  it('classifies an exhausted rate limit and exposes the reset delay', async () => {
    const resetAt = Math.ceil(Date.now() / 1000) + 42;
    globalThis.fetch = jest.fn().mockResolvedValue(
      jsonResponse(
        { message: 'API rate limit exceeded' },
        {
          status: 403,
          headers: { 'x-ratelimit-remaining': '0', 'x-ratelimit-reset': String(resetAt) },
        },
      ),
    ) as unknown as typeof fetch;

    await expect(client.request({ path: '/search/repositories' })).rejects.toMatchObject({
      kind: 'rate-limit',
      status: 403,
    });
  });

  it('marks 404 as not-found and does not allow a retry', async () => {
    globalThis.fetch = jest
      .fn()
      .mockResolvedValue(jsonResponse({}, { status: 404 })) as unknown as typeof fetch;

    await expect(client.request({ path: '/repos/nope/nope' })).rejects.toMatchObject({
      kind: 'not-found',
      isRetryable: false,
    });
  });

  it('treats a transport failure as an offline error that may be retried', async () => {
    globalThis.fetch = jest
      .fn()
      .mockRejectedValue(new TypeError('Network request failed')) as unknown as typeof fetch;

    const error = await client.request({ path: '/search/repositories' }).catch(caught => caught);

    expect(error).toBeInstanceOf(GitHubError);
    expect(error).toMatchObject({ kind: 'offline', isRetryable: true });
  });

  it('rethrows an abort so React Query can cancel in-flight requests', async () => {
    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';
    globalThis.fetch = jest.fn().mockRejectedValue(abortError) as unknown as typeof fetch;

    await expect(client.request({ path: '/search/repositories' })).rejects.toBe(abortError);
  });
});
