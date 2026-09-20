import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';

/**
 * React Query's default online detection relies on browser `online` events, so on React Native it
 * assumes the device is permanently online and `refetchOnReconnect` never fires. NetInfo supplies
 * the real signal.
 *
 * `isInternetReachable` is `null` until the first reachability probe resolves; treating that as
 * offline would blank the app on a cold start, so only an explicit `false` counts as unreachable.
 */
export function setupOnlineManager(): void {
  onlineManager.setEventListener(setOnline =>
    NetInfo.addEventListener(state => {
      setOnline(Boolean(state.isConnected) && state.isInternetReachable !== false);
    }),
  );
}
