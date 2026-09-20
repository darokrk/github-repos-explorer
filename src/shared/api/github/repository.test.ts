import type { RepositoryDto } from './repository';
import { toRepository } from './repository';

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

describe('toRepository', () => {
  it('maps the API payload onto the domain model', () => {
    const repository = toRepository(dto);

    expect(repository.fullName).toBe('facebook/react-native');
    expect(repository.owner.kind).toBe('organization');
    expect(repository.owner.profileUrl).toBe('https://github.com/facebook');
    expect(repository.starCount).toBe(123456);
    expect(repository.license).toBe('MIT');
  });

  it('reports watchers only from subscribers_count, never from the stargazer alias', () => {
    expect(toRepository(dto).watcherCount).toBe(3500);
    expect(toRepository({ ...dto, subscribers_count: undefined }).watcherCount).toBeNull();
  });

  it('normalises absent optional fields to null or empty collections', () => {
    const sparse = toRepository({
      ...dto,
      owner: { ...dto.owner, type: 'User' },
      description: null,
      language: null,
      license: null,
      topics: undefined,
    });

    expect(sparse.description).toBeNull();
    expect(sparse.language).toBeNull();
    expect(sparse.license).toBeNull();
    expect(sparse.homepage).toBeNull();
    expect(sparse.topics).toEqual([]);
    expect(sparse.owner.kind).toBe('user');
  });
});
