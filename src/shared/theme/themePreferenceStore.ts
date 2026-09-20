import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { ThemePreference } from './theme';

const cycleOrder: readonly ThemePreference[] = ['system', 'light', 'dark'];

interface ThemePreferenceState {
  readonly preference: ThemePreference;
  readonly setPreference: (preference: ThemePreference) => void;
  readonly cyclePreference: () => void;
}

export const useThemePreferenceStore = create<ThemePreferenceState>()(
  persist(
    (set, get) => ({
      preference: 'system',
      setPreference: preference => set({ preference }),
      cyclePreference: () => {
        const nextIndex = (cycleOrder.indexOf(get().preference) + 1) % cycleOrder.length;
        set({ preference: cycleOrder[nextIndex] ?? 'system' });
      },
    }),
    {
      name: 'theme-preference',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ preference: state.preference }),
    },
  ),
);

export const selectThemePreference = (state: ThemePreferenceState) => state.preference;
export const selectCycleThemePreference = (state: ThemePreferenceState) => state.cyclePreference;
