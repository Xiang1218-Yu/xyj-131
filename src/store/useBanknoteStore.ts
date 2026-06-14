import { create } from 'zustand';
import { banknotes, getBanknoteById, getBanknotesByCountry, getBanknotesByYear, getPopularBanknotes, getLatestBanknotes, getRelatedBanknotes, getYears, getBanknotesByDesignElement, getRandomBanknotes, getDesignElementCounts } from '@/data/banknotes';
import type { Banknote } from '@/types';

interface BanknoteStore {
  banknotes: Banknote[];
  getBanknoteById: (id: string) => Banknote | undefined;
  getBanknotesByCountry: (countryCode: string) => Banknote[];
  getBanknotesByYear: (year: number) => Banknote[];
  getPopularBanknotes: (limit?: number) => Banknote[];
  getLatestBanknotes: (limit?: number) => Banknote[];
  getRelatedBanknotes: (currentId: string, limit?: number) => Banknote[];
  getYears: () => number[];
  getBanknotesByDesignElement: (element: string) => Banknote[];
  getRandomBanknotes: (count?: number, excludeIds?: string[]) => Banknote[];
  getDesignElementCounts: () => Record<string, number>;
  filterBanknotes: (filters: {
    search?: string;
    country?: string;
    yearFrom?: number | null;
    yearTo?: number | null;
    denomination?: string;
    material?: string;
    designElement?: string;
    sortBy?: 'year' | 'country' | 'favorite';
    sortOrder?: 'asc' | 'desc';
  }) => Banknote[];
}

export const useBanknoteStore = create<BanknoteStore>(() => ({
  banknotes,
  getBanknoteById,
  getBanknotesByCountry,
  getBanknotesByYear,
  getPopularBanknotes,
  getLatestBanknotes,
  getRelatedBanknotes,
  getYears,
  getBanknotesByDesignElement,
  getRandomBanknotes,
  getDesignElementCounts,
  filterBanknotes: (filters) => {
    let result = [...banknotes];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (b) =>
          b.country.toLowerCase().includes(searchLower) ||
          b.denomination.toLowerCase().includes(searchLower) ||
          b.currency.toLowerCase().includes(searchLower) ||
          b.year.toString().includes(searchLower) ||
          b.obverseDesign.toLowerCase().includes(searchLower) ||
          b.reverseDesign.toLowerCase().includes(searchLower) ||
          b.tags.some((t) => t.toLowerCase().includes(searchLower)) ||
          b.designElements.some((e) => e.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.country) {
      result = result.filter((b) => b.countryCode === filters.country);
    }
    
    if (filters.yearFrom !== null) {
      result = result.filter((b) => b.year >= filters.yearFrom!);
    }
    
    if (filters.yearTo !== null) {
      result = result.filter((b) => b.year <= filters.yearTo!);
    }
    
    if (filters.denomination) {
      result = result.filter((b) => `${b.denomination} ${b.currency}` === filters.denomination);
    }
    
    if (filters.material && filters.material !== '全部') {
      result = result.filter((b) => b.material === filters.material);
    }
    
    if (filters.designElement && filters.designElement !== '全部') {
      result = result.filter((b) => b.designElements.includes(filters.designElement as any));
    }
    
    if (filters.sortBy) {
      result.sort((a, b) => {
        let comparison = 0;
        switch (filters.sortBy) {
          case 'year':
            comparison = a.year - b.year;
            break;
          case 'country':
            comparison = a.country.localeCompare(b.country, 'zh-CN');
            break;
          case 'favorite':
            comparison = a.favoriteCount - b.favoriteCount;
            break;
        }
        return filters.sortOrder === 'asc' ? comparison : -comparison;
      });
    }
    
    return result;
  },
}));
