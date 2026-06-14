import { create } from 'zustand';
import type { FilterState, ViewMode } from '@/types';

interface FilterStore extends FilterState {
  setSearch: (search: string) => void;
  setCountry: (country: string) => void;
  setYearFrom: (year: number | null) => void;
  setYearTo: (year: number | null) => void;
  setDenomination: (denomination: string) => void;
  setMaterial: (material: string) => void;
  setDesignElement: (designElement: string) => void;
  setTag: (tag: string) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  setSortOrder: (sortOrder: FilterState['sortOrder']) => void;
  setViewMode: (viewMode: ViewMode) => void;
  resetFilters: () => void;
}

const initialState: FilterState = {
  search: '',
  country: '',
  yearFrom: null,
  yearTo: null,
  denomination: '',
  material: '全部',
  designElement: '全部',
  tag: '',
  sortBy: 'favorite',
  sortOrder: 'desc',
  viewMode: 'grid',
};

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setCountry: (country) => set({ country }),
  setYearFrom: (yearFrom) => set({ yearFrom }),
  setYearTo: (yearTo) => set({ yearTo }),
  setDenomination: (denomination) => set({ denomination }),
  setMaterial: (material) => set({ material }),
  setDesignElement: (designElement) => set({ designElement }),
  setTag: (tag) => set({ tag }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setViewMode: (viewMode) => set({ viewMode }),
  resetFilters: () => set(initialState),
}));
