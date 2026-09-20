import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { AppErrorBoundary } from './AppErrorBoundary';
import { RootNavigator } from './navigation/RootNavigator';
import { AppQueryProvider } from './providers/AppQueryProvider';

export function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppErrorBoundary>
          <AppQueryProvider>
            <RootNavigator />
          </AppQueryProvider>
        </AppErrorBoundary>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
