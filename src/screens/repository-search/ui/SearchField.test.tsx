import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { SEARCH_DEBOUNCE_MS } from '@/shared/config/github';
import { ThemeProvider } from '@/shared/theme/ThemeProvider';
import { useRepositorySearchStore } from '../model/repositorySearchStore';
import { SearchField } from './SearchField';

jest.mock('@react-native-async-storage/async-storage', () => {
  const entries = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => entries.get(key) ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        entries.set(key, value);
      }),
      removeItem: jest.fn(async (key: string) => {
        entries.delete(key);
      }),
    },
  };
});

function renderField() {
  return render(
    <ThemeProvider>
      <SearchField />
    </ThemeProvider>,
  );
}

const getInput = () => screen.getByLabelText('Search GitHub repositories');

beforeEach(() => {
  useRepositorySearchStore.setState({ term: '', sort: 'best-match' });
});

describe('SearchField', () => {
  it('shows the persisted term once storage hydrates after the first render', async () => {
    await AsyncStorage.setItem(
      'repository-search',
      JSON.stringify({ state: { term: 'zustand', sort: 'best-match' }, version: 0 }),
    );

    renderField();
    expect(getInput().props.value).toBe('');

    await act(async () => {
      await useRepositorySearchStore.persist.rehydrate();
    });

    expect(getInput().props.value).toBe('zustand');
    expect(useRepositorySearchStore.getState().term).toBe('zustand');
  });

  it('shows the persisted term when hydration lands before the field ever renders', async () => {
    await AsyncStorage.setItem(
      'repository-search',
      JSON.stringify({ state: { term: 'flashlist', sort: 'best-match' }, version: 0 }),
    );
    await act(async () => {
      await useRepositorySearchStore.persist.rehydrate();
    });

    renderField();

    expect(getInput().props.value).toBe('flashlist');
  });

  it('keeps what the user typed when a later hydration restores a different term', async () => {
    await AsyncStorage.setItem(
      'repository-search',
      JSON.stringify({ state: { term: 'zustand', sort: 'best-match' }, version: 0 }),
    );

    renderField();
    fireEvent.changeText(getInput(), 'reanimated');

    await act(async () => {
      await useRepositorySearchStore.persist.rehydrate();
    });

    expect(getInput().props.value).toBe('reanimated');
  });

  it('commits the typed term once the debounce elapses', () => {
    jest.useFakeTimers();
    try {
      renderField();

      fireEvent.changeText(getInput(), 'flashlist');
      expect(useRepositorySearchStore.getState().term).toBe('');

      act(() => {
        jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS);
      });

      expect(useRepositorySearchStore.getState().term).toBe('flashlist');
    } finally {
      jest.useRealTimers();
    }
  });

  it('drops the pending keystroke when the field is cleared', () => {
    jest.useFakeTimers();
    try {
      renderField();

      fireEvent.changeText(getInput(), 'flashlist');
      fireEvent.press(screen.getByLabelText('Clear search'));

      act(() => {
        jest.advanceTimersByTime(SEARCH_DEBOUNCE_MS * 2);
      });

      expect(useRepositorySearchStore.getState().term).toBe('');
      expect(getInput().props.value).toBe('');
    } finally {
      jest.useRealTimers();
    }
  });
});
