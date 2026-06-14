import { create } from 'zustand';
import type { RecommendDimension, RecommendedBanknote, RecommendFilterOptions } from '@/types';
import {
  recommendByDimension,
  hasMoreRecommendations,
  getAvailableDimensions,
} from '@/utils/recommendation';

interface RecommendState {
  dimension: RecommendDimension;
  recommendations: RecommendedBanknote[];
  seenIds: string[];
  isLoading: boolean;
  limit: number;
  filters: RecommendFilterOptions;
  setDimension: (dimension: RecommendDimension) => void;
  loadRecommendations: () => void;
  refreshBatch: () => void;
  resetSeen: () => void;
  setLimit: (limit: number) => void;
  setFilters: (filters: Partial<RecommendFilterOptions>) => void;
  resetFilters: () => void;
}

const defaultFilters: RecommendFilterOptions = {
  sortBy: 'score',
  sortOrder: 'desc',
};

export const useRecommendStore = create<RecommendState>((set, get) => ({
  dimension: 'popular',
  recommendations: [],
  seenIds: [],
  isLoading: false,
  limit: 8,
  filters: defaultFilters,

  setDimension: (dimension) => {
    set({ dimension, seenIds: [] });
    get().loadRecommendations();
  },

  loadRecommendations: () => {
    const { dimension, limit, seenIds, filters } = get();
    set({ isLoading: true });
    const results = recommendByDimension(dimension, {
      limit,
      excludeIds: seenIds,
      filters,
    });
    const newSeenIds = [...seenIds, ...results.map((r) => r.id)];
    set({
      recommendations: results,
      seenIds: newSeenIds,
      isLoading: false,
    });
  },

  refreshBatch: () => {
    const { dimension, seenIds, filters } = get();
    if (!hasMoreRecommendations(dimension, seenIds, filters)) {
      set({ seenIds: [] });
    }
    get().loadRecommendations();
  },

  resetSeen: () => {
    set({ seenIds: [] });
    get().loadRecommendations();
  },

  setLimit: (limit) => {
    set({ limit });
    get().loadRecommendations();
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      seenIds: [],
    }));
    get().loadRecommendations();
  },

  resetFilters: () => {
    set({ filters: defaultFilters, seenIds: [] });
    get().loadRecommendations();
  },
}));

export { getAvailableDimensions };
