import NetInfo from '@react-native-community/netinfo';
import type { NetInfoState } from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import { setupOnlineManager } from './onlineManager';

jest.mock('@react-native-community/netinfo', () => ({
  __esModule: true,
  default: { addEventListener: jest.fn(() => jest.fn()) },
}));

const addEventListener = NetInfo.addEventListener as jest.Mock;

function emit(state: Partial<NetInfoState>) {
  const [listener] = addEventListener.mock.calls[0] as [(state: NetInfoState) => void];
  listener(state as NetInfoState);
}

describe('setupOnlineManager', () => {
  beforeEach(() => {
    addEventListener.mockClear();
    setupOnlineManager();
    // Subscribing activates the listener that `setEventListener` registered.
    onlineManager.subscribe(() => {});
  });

  afterEach(() => {
    onlineManager.setOnline(true);
  });

  it('reports offline when the device has no connection', () => {
    emit({ isConnected: false, isInternetReachable: false });

    expect(onlineManager.isOnline()).toBe(false);
  });

  it('reports online when the device is connected and reachable', () => {
    emit({ isConnected: true, isInternetReachable: true });

    expect(onlineManager.isOnline()).toBe(true);
  });

  it('treats an unresolved reachability probe as online', () => {
    emit({ isConnected: true, isInternetReachable: null });

    expect(onlineManager.isOnline()).toBe(true);
  });

  it('reports offline when the network is connected but unreachable', () => {
    emit({ isConnected: true, isInternetReachable: false });

    expect(onlineManager.isOnline()).toBe(false);
  });
});
