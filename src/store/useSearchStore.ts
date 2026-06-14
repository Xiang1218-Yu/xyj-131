import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { banknotes } from '@/data/banknotes';
import { countries } from '@/data/countries';

export interface SearchSuggestion {
  type: 'country' | 'year' | 'denomination' | 'tag' | 'design';
  value: string;
  label: string;
  count?: number;
  flag?: string;
  filterParams?: Record<string, string>;
}

interface SearchStore {
  history: string[];
  addToHistory: (query: string) => void;
  removeFromHistory: (query: string) => void;
  clearHistory: () => void;
  getSuggestions: (query: string) => SearchSuggestion[];
  getHotSearches: () => SearchSuggestion[];
}

const MAX_HISTORY = 10;

const getHotSearchesInternal = (): SearchSuggestion[] => {
  const tagCount: Record<string, number> = {};
  const countryCount: Record<string, { name: string; flag: string; count: number }> = {};
  const denominationCount: Record<string, number> = {};
  const yearCount: Record<number, number> = {};
  const designCount: Record<string, number> = {};

  banknotes.forEach((b) => {
    b.tags.forEach((t) => {
      tagCount[t] = (tagCount[t] || 0) + 1;
    });
    const country = countries.find((c) => c.code === b.countryCode);
    if (country) {
      if (!countryCount[b.countryCode]) {
        countryCount[b.countryCode] = { name: country.name, flag: country.flag, count: 0 };
      }
      countryCount[b.countryCode].count++;
    }
    const denomKey = `${b.denomination} ${b.currency}`;
    denominationCount[denomKey] = (denominationCount[denomKey] || 0) + 1;
    yearCount[b.year] = (yearCount[b.year] || 0) + 1;
    b.designElements.forEach((e) => {
      designCount[e] = (designCount[e] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([tag, count]) => ({
      type: 'tag' as const,
      value: tag,
      label: tag,
      count,
      filterParams: { search: tag },
    }));

  const topCountries = Object.entries(countryCount)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 3)
    .map(([code, c]) => ({
      type: 'country' as const,
      value: c.name,
      label: `${c.flag} ${c.name}`,
      count: c.count,
      filterParams: { country: code },
    }));

  const topDenoms = Object.entries(denominationCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([denom, count]) => ({
      type: 'denomination' as const,
      value: denom,
      label: denom,
      count,
      filterParams: { denomination: denom },
    }));

  return [...topCountries, ...topTags, ...topDenoms].slice(0, 8);
};

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      history: [],
      addToHistory: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;
        set((state) => {
          const filtered = state.history.filter((h) => h !== trimmed);
          return {
            history: [trimmed, ...filtered].slice(0, MAX_HISTORY),
          };
        });
      },
      removeFromHistory: (query) => {
        set((state) => ({
          history: state.history.filter((h) => h !== query),
        }));
      },
      clearHistory: () => set({ history: [] }),
      getSuggestions: (query) => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) return [];

        const suggestions: SearchSuggestion[] = [];
        const seen = new Set<string>();

        countries.forEach((c) => {
          if (c.name.toLowerCase().includes(trimmed) || c.code.toLowerCase().includes(trimmed)) {
            const key = `country-${c.code}`;
            if (!seen.has(key)) {
              seen.add(key);
              const count = banknotes.filter((b) => b.countryCode === c.code).length;
              suggestions.push({
                type: 'country',
                value: c.name,
                label: `${c.flag} ${c.name}`,
                count,
                filterParams: { country: c.code },
              });
            }
          }
        });

        Object.entries(
          banknotes.reduce<Record<number, number>>((acc, b) => {
            acc[b.year] = (acc[b.year] || 0) + 1;
            return acc;
          }, {})
        ).forEach(([year, count]) => {
          if (year.includes(trimmed)) {
            const key = `year-${year}`;
            if (!seen.has(key)) {
              seen.add(key);
              suggestions.push({
                type: 'year',
                value: year,
                label: `${year} 年`,
                count,
                filterParams: { yearFrom: year, yearTo: year },
              });
            }
          }
        });

        const denomSet = new Set<string>();
        banknotes.forEach((b) => {
          const denomStr = `${b.denomination} ${b.currency}`;
          const denomKey = b.denomination;
          if (
            denomStr.toLowerCase().includes(trimmed) ||
            b.currency.toLowerCase().includes(trimmed) ||
            denomKey.includes(trimmed)
          ) {
            const key = `denom-${denomStr}`;
            if (!seen.has(key) && !denomSet.has(denomStr)) {
              seen.add(key);
              denomSet.add(denomStr);
              const count = banknotes.filter(
                (x) => `${x.denomination} ${x.currency}` === denomStr
              ).length;
              suggestions.push({
                type: 'denomination',
                value: denomStr,
                label: denomStr,
                count,
                filterParams: { denomination: denomStr },
              });
            }
          }
        });

        const tagSet = new Set<string>();
        banknotes.forEach((b) => {
          b.tags.forEach((t) => {
            if (t.toLowerCase().includes(trimmed)) {
              const key = `tag-${t}`;
              if (!seen.has(key) && !tagSet.has(t)) {
                seen.add(key);
                tagSet.add(t);
                const count = banknotes.filter((x) => x.tags.includes(t)).length;
                suggestions.push({
                  type: 'tag',
                  value: t,
                  label: `#${t}`,
                  count,
                  filterParams: { search: t },
                });
              }
            }
          });
        });

        const designSet = new Set<string>();
        banknotes.forEach((b) => {
          b.designElements.forEach((e) => {
            if (e.toLowerCase().includes(trimmed)) {
              const key = `design-${e}`;
              if (!seen.has(key) && !designSet.has(e)) {
                seen.add(key);
                designSet.add(e);
                const count = banknotes.filter((x) => x.designElements.includes(e)).length;
                suggestions.push({
                  type: 'design',
                  value: e,
                  label: e,
                  count,
                  filterParams: { designElement: e },
                });
              }
            }
          });
        });

        return suggestions.slice(0, 10);
      },
      getHotSearches: getHotSearchesInternal,
    }),
    {
      name: 'search-history',
      partialize: (state) => ({ history: state.history }),
    }
  )
);
