import { create } from 'zustand';
import type { FilterState } from '@/types';

interface FilterStore extends FilterState {
  setSearch: (search: string) => void;
  setCountry: (country: string) => void;
  setYearFrom: (year: number | null) => void;
  setYearTo: (year: number | null) => void;
  setDenomination: (denomination: string) => void;
  setMaterial: (material: string) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  setSortOrder: (sortOrder: FilterState['sortOrder']) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  search: '',
  country: '',
  yearFrom: null,
  yearTo: null,
  denomination: '',
  material: '',
  sortBy: 'favorite',
  sortOrder: 'desc',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setCountry: (country) => set({ country }),
  setYearFrom: (yearFrom) => set({ yearFrom }),
  setYearTo: (yearTo) => set({ yearTo }),
  setDenomination: (denomination) => set({ denomination }),
  setMaterial: (material) => set({ material }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  resetFilters: () => set(initialState),
}));
