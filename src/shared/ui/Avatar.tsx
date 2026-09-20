import { Image, PixelRatio, StyleSheet } from 'react-native';
import { buildAvatarUrl } from '@/shared/lib/buildAvatarUrl';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const pixelRatio = PixelRatio.get();

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    image: { backgroundColor: theme.colors.skeleton, borderCurve: 'continuous' },
  });

export interface AvatarProps {
  readonly url: string;
  readonly size: number;
  readonly rounded?: boolean;
}

export function Avatar({ url, size, rounded = false }: AvatarProps) {
  const styles = useThemedStyles(createStyles);
  const dimensions = { width: size, height: size, borderRadius: rounded ? size / 2 : 8 };

  return (
    <Image
      source={{ uri: buildAvatarUrl(url, size, pixelRatio) }}
      style={[styles.image, dimensions]}
      resizeMode="cover"
      accessible={false}
    />
  );
}
