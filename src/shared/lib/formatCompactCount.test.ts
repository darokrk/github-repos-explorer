import { formatCompactCount } from './formatCompactCount';

describe('formatCompactCount', () => {
  it('renders counts below one thousand verbatim', () => {
    expect(formatCompactCount(0)).toBe('0');
    expect(formatCompactCount(7)).toBe('7');
    expect(formatCompactCount(999)).toBe('999');
  });

  it('abbreviates thousands and drops a trailing zero decimal', () => {
    expect(formatCompactCount(1000)).toBe('1k');
    expect(formatCompactCount(1234)).toBe('1.2k');
    expect(formatCompactCount(12345)).toBe('12.3k');
    expect(formatCompactCount(999949)).toBe('999.9k');
  });

  it('abbreviates millions', () => {
    expect(formatCompactCount(1_000_000)).toBe('1M');
    expect(formatCompactCount(2_450_000)).toBe('2.5M');
  });

  it('falls back to zero for invalid input', () => {
    expect(formatCompactCount(Number.NaN)).toBe('0');
    expect(formatCompactCount(-5)).toBe('0');
  });
});
