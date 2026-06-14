export interface Banknote {
  id: string;
  country: string;
  countryCode: string;
  year: number;
  denomination: string;
  currency: string;
  obverseImage: string;
  reverseImage: string;
  dimensions: string;
  material: string;
  mainColor: string;
  obverseDesign: string;
  reverseDesign: string;
  securityFeatures: string[];
  history: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  favoriteCount: number;
  tags: string[];
  createdAt: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  continent: string;
  banknoteCount: number;
}

export interface FilterState {
  search: string;
  country: string;
  yearFrom: number | null;
  yearTo: number | null;
  denomination: string;
  material: string;
  sortBy: 'year' | 'country' | 'favorite';
  sortOrder: 'asc' | 'desc';
}

export interface FavoriteState {
  ids: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}
