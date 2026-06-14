export type DesignElementCategory = '人物' | '建筑' | '自然' | '动物' | '艺术' | '科技' | '历史' | '符号';

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
  designElements: DesignElementCategory[];
}

export interface SecurityFeature {
  id: string;
  name: string;
  category: '基材防伪' | '印刷防伪' | '油墨防伪' | '光学防伪' | '数字防伪' | '触觉防伪';
  description: string;
  principle: string;
  examples: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  effectiveness: 1 | 2 | 3 | 4 | 5;
  history: string;
  iconName: string;
}

export interface DesignElementInfo {
  category: DesignElementCategory;
  description: string;
  iconName: string;
  color: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  continent: string;
  banknoteCount: number;
}

export type ViewMode = 'grid' | 'list' | 'compact';

export interface FilterState {
  search: string;
  country: string;
  yearFrom: number | null;
  yearTo: number | null;
  denomination: string;
  material: string;
  designElement: string;
  tag: string;
  sortBy: 'year' | 'country' | 'favorite';
  sortOrder: 'asc' | 'desc';
  viewMode: ViewMode;
}

export interface FavoriteState {
  ids: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export type QuizCategory = 'country' | 'security' | 'history' | 'design' | 'material';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  banknoteId?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizResult {
  categories: QuizCategory[];
  totalQuestions: number;
  correctCount: number;
  totalTime: number;
  answers: QuizAnswer[];
  questions: QuizQuestion[];
}

export interface Note {
  id: string;
  banknoteId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface NoteState {
  notes: Note[];
  addNote: (banknoteId: string, note: Omit<Note, 'id' | 'banknoteId' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (noteId: string, updates: Partial<Omit<Note, 'id' | 'banknoteId' | 'createdAt'>>) => void;
  deleteNote: (noteId: string) => void;
  getNotesByBanknoteId: (banknoteId: string) => Note[];
  getAllNotes: () => Note[];
}

export interface HistoricalExchangeRate {
  currencyCode: string;
  currencyName: string;
  year: number;
  rateToUSD: number;
  inflationFactor: number;
  funFact: string;
}

export interface CurrencyConversionResult {
  originalAmount: number;
  originalCurrency: string;
  originalYear: number;
  targetCurrency: string;
  targetYear: number;
  equivalentAmount: number;
  historicalComparison: string;
  funFacts: string[];
}
