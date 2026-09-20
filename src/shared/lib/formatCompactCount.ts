const THOUSAND = 1_000;
const MILLION = 1_000_000;

function withOneDecimal(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatCompactCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) {
    return '0';
  }
  if (count < THOUSAND) {
    return String(Math.trunc(count));
  }
  if (count < MILLION) {
    return `${withOneDecimal(count / THOUSAND)}k`;
  }
  return `${withOneDecimal(count / MILLION)}M`;
}
