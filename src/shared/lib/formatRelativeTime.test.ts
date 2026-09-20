import { formatRelativeTime } from './formatRelativeTime';

const NOW = Date.parse('2026-09-17T12:00:00.000Z');

describe('formatRelativeTime', () => {
  it('describes very recent timestamps', () => {
    expect(formatRelativeTime('2026-09-17T11:59:30.000Z', NOW)).toBe('just now');
  });

  it('pluralises each unit correctly', () => {
    expect(formatRelativeTime('2026-09-17T11:59:00.000Z', NOW)).toBe('1 minute ago');
    expect(formatRelativeTime('2026-09-17T09:00:00.000Z', NOW)).toBe('3 hours ago');
    expect(formatRelativeTime('2026-09-15T12:00:00.000Z', NOW)).toBe('2 days ago');
    expect(formatRelativeTime('2026-07-17T12:00:00.000Z', NOW)).toBe('2 months ago');
    expect(formatRelativeTime('2024-09-17T12:00:00.000Z', NOW)).toBe('2 years ago');
  });

  it('handles unparseable input without throwing', () => {
    expect(formatRelativeTime('not-a-date', NOW)).toBe('unknown');
  });
});
