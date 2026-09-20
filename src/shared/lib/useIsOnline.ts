import { useSyncExternalStore } from 'react';
import { onlineManager } from '@tanstack/react-query';

function subscribe(onChange: () => void): () => void {
  return onlineManager.subscribe(onChange);
}

function getSnapshot(): boolean {
  return onlineManager.isOnline();
}

export function useIsOnline(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot);
}
