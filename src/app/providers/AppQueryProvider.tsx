import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { AppState } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { focusManager } from '@tanstack/react-query';
import { setupOnlineManager } from './onlineManager';
import { persistOptions, queryClient } from './queryClient';

setupOnlineManager();

function useReactQueryAppStateFocus() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    });
    return () => subscription.remove();
  }, []);
}

export function AppQueryProvider({ children }: { readonly children: ReactNode }) {
  useReactQueryAppStateFocus();

  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      {children}
    </PersistQueryClientProvider>
  );
}
