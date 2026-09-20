export type GitHubErrorKind =
  'rate-limit' | 'not-found' | 'invalid-query' | 'offline' | 'server' | 'unknown';

interface GitHubErrorOptions {
  readonly kind: GitHubErrorKind;
  readonly status?: number;
  readonly retryAfterSeconds?: number;
  readonly cause?: unknown;
}

export class GitHubError extends Error {
  readonly kind: GitHubErrorKind;
  readonly status: number | null;
  readonly retryAfterSeconds: number | null;

  constructor(message: string, options: GitHubErrorOptions) {
    super(message, { cause: options.cause });
    this.name = 'GitHubError';
    this.kind = options.kind;
    this.status = options.status ?? null;
    this.retryAfterSeconds = options.retryAfterSeconds ?? null;
  }

  get isRetryable(): boolean {
    return this.kind === 'offline' || this.kind === 'server';
  }
}

export function isGitHubError(error: unknown): error is GitHubError {
  return error instanceof GitHubError;
}
