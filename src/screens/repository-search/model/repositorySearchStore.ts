import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { RepositorySortOption } from '@/shared/api/github';

interface RepositorySearchState {
  readonly term: string;
  readonly sort: RepositorySortOption;
  readonly setTerm: (term: string) => void;
  readonly setSort: (sort: RepositorySortOption) => void;
}

export const useRepositorySearchStore = create<RepositorySearchState>()(
  persist(
    set => ({
      term: '',
      sort: 'best-match',
      setTerm: term => set({ term: term.trim() }),
      setSort: sort => set({ sort }),
    }),
    {
      name: 'repository-search',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ term: state.term, sort: state.sort }),
    },
  ),
);

export const selectTerm = (state: RepositorySearchState) => state.term;
export const selectSort = (state: RepositorySearchState) => state.sort;
export const selectSetTerm = (state: RepositorySearchState) => state.setTerm;
export const selectSetSort = (state: RepositorySearchState) => state.setSort;
