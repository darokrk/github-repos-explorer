export interface RepositoryOwnerDto {
  readonly login: string;
  readonly avatar_url: string;
  readonly html_url: string;
  readonly type: string;
}

export interface RepositoryLicenseDto {
  readonly spdx_id: string | null;
  readonly name: string;
}

export interface RepositoryDto {
  readonly id: number;
  readonly name: string;
  readonly full_name: string;
  readonly owner: RepositoryOwnerDto;
  readonly description: string | null;
  readonly language: string | null;
  readonly html_url: string;
  readonly homepage: string | null;
  readonly stargazers_count: number;
  readonly forks_count: number;
  readonly open_issues_count: number;
  readonly watchers_count: number;
  readonly subscribers_count?: number;
  readonly topics?: readonly string[];
  readonly license: RepositoryLicenseDto | null;
  readonly default_branch: string;
  readonly archived: boolean;
  readonly fork: boolean;
  readonly created_at: string;
  readonly updated_at: string;
  readonly pushed_at: string | null;
}

export interface RepositorySearchResponseDto {
  readonly total_count: number;
  readonly incomplete_results: boolean;
  readonly items: readonly RepositoryDto[];
}

export type RepositoryOwnerKind = 'user' | 'organization';

export interface RepositoryOwner {
  readonly login: string;
  readonly avatarUrl: string;
  readonly profileUrl: string;
  readonly kind: RepositoryOwnerKind;
}

export interface Repository {
  readonly id: number;
  readonly name: string;
  readonly fullName: string;
  readonly owner: RepositoryOwner;
  readonly description: string | null;
  readonly language: string | null;
  readonly repositoryUrl: string;
  readonly homepage: string | null;
  readonly starCount: number;
  readonly forkCount: number;
  readonly openIssueCount: number;
  readonly watcherCount: number | null;
  readonly topics: readonly string[];
  readonly license: string | null;
  readonly defaultBranch: string;
  readonly isArchived: boolean;
  readonly isFork: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

function toRepositoryOwner(dto: RepositoryOwnerDto): RepositoryOwner {
  return {
    login: dto.login,
    avatarUrl: dto.avatar_url,
    profileUrl: dto.html_url,
    kind: dto.type === 'Organization' ? 'organization' : 'user',
  };
}

export function toRepository(dto: RepositoryDto): Repository {
  return {
    id: dto.id,
    name: dto.name,
    fullName: dto.full_name,
    owner: toRepositoryOwner(dto.owner),
    description: dto.description,
    language: dto.language,
    repositoryUrl: dto.html_url,
    homepage: dto.homepage ? dto.homepage : null,
    starCount: dto.stargazers_count,
    forkCount: dto.forks_count,
    openIssueCount: dto.open_issues_count,
    watcherCount: dto.subscribers_count ?? null,
    topics: dto.topics ?? [],
    license: dto.license?.spdx_id ?? null,
    defaultBranch: dto.default_branch,
    isArchived: dto.archived,
    isFork: dto.fork,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}
