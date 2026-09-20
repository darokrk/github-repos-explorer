import { act, render, screen } from '@testing-library/react-native';
import { onlineManager } from '@tanstack/react-query';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { OfflineBanner } from './OfflineBanner';

function renderBanner() {
  return render(
    <ThemeProvider>
      <OfflineBanner />
    </ThemeProvider>,
  );
}

function setOnline(isOnline: boolean) {
  act(() => {
    onlineManager.setOnline(isOnline);
  });
}

afterEach(() => {
  onlineManager.setOnline(true);
});

describe('OfflineBanner', () => {
  it('stays hidden while the device is online', () => {
    setOnline(true);
    renderBanner();

    expect(screen.queryByTestId('offline-banner')).toBeNull();
  });

  it('appears when the device goes offline', () => {
    setOnline(true);
    renderBanner();

    setOnline(false);

    expect(screen.getByTestId('offline-banner')).toBeVisible();
    expect(screen.getByText('No connection — requests are paused')).toBeVisible();
  });

  it('disappears once the connection returns', () => {
    setOnline(false);
    renderBanner();
    expect(screen.getByTestId('offline-banner')).toBeVisible();

    setOnline(true);

    expect(screen.queryByTestId('offline-banner')).toBeNull();
  });
});
