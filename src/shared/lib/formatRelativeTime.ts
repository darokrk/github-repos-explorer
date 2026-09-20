const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

function pluralize(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? '' : 's'} ago`;
}

export function formatRelativeTime(isoDate: string, now: number = Date.now()): string {
  const timestamp = Date.parse(isoDate);
  if (Number.isNaN(timestamp)) {
    return 'unknown';
  }

  const elapsed = now - timestamp;
  if (elapsed < MINUTE_MS) {
    return 'just now';
  }
  if (elapsed < HOUR_MS) {
    return pluralize(Math.floor(elapsed / MINUTE_MS), 'minute');
  }
  if (elapsed < DAY_MS) {
    return pluralize(Math.floor(elapsed / HOUR_MS), 'hour');
  }
  if (elapsed < MONTH_MS) {
    return pluralize(Math.floor(elapsed / DAY_MS), 'day');
  }
  if (elapsed < YEAR_MS) {
    return pluralize(Math.floor(elapsed / MONTH_MS), 'month');
  }
  return pluralize(Math.floor(elapsed / YEAR_MS), 'year');
}
