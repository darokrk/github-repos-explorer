import type { GitHubErrorKind } from '@/shared/api/github/githubError';
import { isGitHubError } from '@/shared/api/github/githubError';
import { MessageView } from './MessageView';

interface ErrorCopy {
  readonly title: string;
  readonly detail: string;
}

const copyByKind: Readonly<Record<GitHubErrorKind, ErrorCopy>> = {
  'rate-limit': {
    title: 'Rate limit reached',
    detail:
      'GitHub allows a small number of unauthenticated searches per minute. Results already loaded stay available.',
  },
  offline: {
    title: 'No connection',
    detail: 'Check your network. Previously loaded results are served from the offline cache.',
  },
  'not-found': {
    title: 'Repository not found',
    detail: 'It may have been renamed, made private, or deleted.',
  },
  'invalid-query': {
    title: 'Unsupported search',
    detail: 'GitHub rejected this query. Try different keywords or fewer qualifiers.',
  },
  server: {
    title: 'GitHub is unavailable',
    detail: 'The API returned an error. This is usually temporary.',
  },
  unknown: {
    title: 'Something went wrong',
    detail: 'The request could not be completed.',
  },
};

function resolveCopy(error: unknown): ErrorCopy {
  if (isGitHubError(error)) {
    if (error.kind === 'rate-limit' && error.retryAfterSeconds !== null) {
      return {
        title: copyByKind['rate-limit'].title,
        detail: `Try again in about ${Math.max(1, error.retryAfterSeconds)} seconds.`,
      };
    }
    return copyByKind[error.kind];
  }
  return copyByKind.unknown;
}

export interface ErrorViewProps {
  readonly error: unknown;
  readonly onRetry?: () => void;
}

export function ErrorView({ error, onRetry }: ErrorViewProps) {
  const { title, detail } = resolveCopy(error);

  return (
    <MessageView
      title={title}
      detail={detail}
      {...(onRetry ? { actionLabel: 'Try again', onAction: onRetry } : {})}
    />
  );
}
