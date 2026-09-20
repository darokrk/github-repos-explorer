import { buildAvatarUrl } from './buildAvatarUrl';

describe('buildAvatarUrl', () => {
  it('appends a device-scaled size to an avatar that already has a query string', () => {
    expect(buildAvatarUrl('https://avatars.githubusercontent.com/u/1?v=4', 44, 3)).toBe(
      'https://avatars.githubusercontent.com/u/1?v=4&s=132',
    );
  });

  it('starts a query string when the avatar has none', () => {
    expect(buildAvatarUrl('https://avatars.githubusercontent.com/u/1', 32, 2)).toBe(
      'https://avatars.githubusercontent.com/u/1?s=64',
    );
  });

  it('rounds fractional pixel ratios up', () => {
    expect(buildAvatarUrl('https://example.test/a', 44, 2.75)).toBe('https://example.test/a?s=121');
  });
});
