import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoriteState } from '@/types';

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      ids: [],
      addFavorite: (id: string) => {
        if (!get().ids.includes(id)) {
          set((state) => ({ ids: [...state.ids, id] }));
        }
      },
      removeFavorite: (id: string) => {
        set((state) => ({ ids: state.ids.filter((i) => i !== id) }));
      },
      isFavorite: (id: string) => {
        return get().ids.includes(id);
      },
    }),
    {
      name: 'banknote-favorites',
    }
  )
);
