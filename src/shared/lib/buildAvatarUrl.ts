export function buildAvatarUrl(avatarUrl: string, displaySize: number, pixelRatio: number): string {
  const requestedSize = Math.ceil(displaySize * pixelRatio);
  const separator = avatarUrl.includes('?') ? '&' : '?';
  return `${avatarUrl}${separator}s=${requestedSize}`;
}
