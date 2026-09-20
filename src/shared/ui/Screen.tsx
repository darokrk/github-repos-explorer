import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Theme } from '@/shared/theme/theme';
import { useThemedStyles } from '@/shared/theme/useThemedStyles';
import { OfflineBanner } from './OfflineBanner';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.background },
  });

export function Screen({ children }: { readonly children: ReactNode }) {
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const safeAreaPadding = { paddingBottom: insets.bottom };

  return (
    <View style={[styles.root, safeAreaPadding]}>
      <OfflineBanner />
      {children}
    </View>
  );
}
