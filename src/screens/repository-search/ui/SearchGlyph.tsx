import { StyleSheet, View } from 'react-native';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';

const LENS_DIAMETER = 14;
const STROKE = 1.9;
const HANDLE_LENGTH = 7;

const DIAGONAL = Math.SQRT1_2;
const lensRadius = LENS_DIAMETER / 2;
const handleCentreDistance = lensRadius - STROKE / 2 + HANDLE_LENGTH / 2;
const handleCentre = lensRadius + handleCentreDistance * DIAGONAL;
const glyphSize = Math.ceil(handleCentre + (HANDLE_LENGTH / 2) * DIAGONAL + STROKE / 2);

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: { width: glyphSize, height: glyphSize },
    lens: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: LENS_DIAMETER,
      height: LENS_DIAMETER,
      borderRadius: lensRadius,
      borderWidth: STROKE,
      borderColor: theme.colors.textMuted,
    },
    handle: {
      position: 'absolute',
      left: handleCentre - STROKE / 2,
      top: handleCentre - HANDLE_LENGTH / 2,
      width: STROKE,
      height: HANDLE_LENGTH,
      borderRadius: STROKE / 2,
      backgroundColor: theme.colors.textMuted,
      transform: [{ rotate: '-45deg' }],
    },
  });

export function SearchGlyph() {
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.root} accessible={false}>
      <View style={styles.lens} />
      <View style={styles.handle} />
    </View>
  );
}
