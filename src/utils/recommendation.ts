import type {
  Banknote,
  RecommendDimension,
  RecommendedBanknote,
  RecommendationReason,
  RecommendFilterOptions,
} from '@/types';
import { banknotes } from '@/data/banknotes';
import { formatNumber } from './cn';

const DIMENSION_LABELS: Record<RecommendDimension, { label: string; icon: string; description: string }> = {
  popular: { label: '热门推荐', icon: '🔥', description: '最受欢迎的纸币' },
  latest: { label: '最新收录', icon: '✨', description: '最新加入收藏馆的纸币' },
  rare: { label: '珍稀纸币', icon: '💎', description: '稀有的珍稀纸币' },
  sameCountry: { label: '同国推荐', icon: '🌍', description: '来自同一国家的纸币' },
  similarDesign: { label: '设计相似', icon: '🎨', description: '设计元素相近的纸币' },
  sameTag: { label: '标签相关', icon: '🏷️', description: '具有相同标签的纸币' },
  sameMaterial: { label: '同材质', icon: '📜', description: '相同材质的纸币' },
  sameEra: { label: '同年代', icon: '📅', description: '相近年代发行的纸币' },
  random: { label: '随机发现', icon: '🎲', description: '随机探索未知的惊喜' },
};

export function getDimensionInfo(dimension: RecommendDimension) {
  return DIMENSION_LABELS[dimension];
}

export function getAvailableDimensions(): RecommendDimension[] {
  return Object.keys(DIMENSION_LABELS) as RecommendDimension[];
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

function getMinMax(banknoteList: Banknote[], key: keyof Banknote) {
  const values = banknoteList.map((b) => b[key] as number);
  return { min: Math.min(...values), max: Math.max(...values) };
}

function dedupeById(notes: Banknote[], excludeIds: string[]): Banknote[] {
  return notes.filter((n) => !excludeIds.includes(n.id));
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function generateReason(
  dimension: RecommendDimension,
  note: Banknote,
  refNote?: Banknote
): RecommendationReason {
  const info = DIMENSION_LABELS[dimension];
  const rarityLabels: Record<number, string> = {
    1: '普通',
    2: '少见',
    3: '稀少',
    4: '罕见',
    5: '孤品',
  };

  switch (dimension) {
    case 'popular':
      return {
        type: dimension,
        label: info.label,
        icon: info.icon,
        detail: `已有 ${formatNumber(note.favoriteCount)} 人收藏，广受藏家青睐`,
      };
    case 'latest':
      return {
        type: dimension,
        label: info.label,
        icon: info.icon,
        detail: `${note.year}年发行，收录于 ${note.createdAt.slice(0, 10)}`,
      };
    case 'rare':
      return {
        type: dimension,
        label: info.label,
        icon: info.icon,
        detail: `珍稀度 ${rarityLabels[note.rarity] || '未知'}，值得珍藏`,
      };
    case 'sameCountry':
      return {
        type: dimension,
        label: info.label,
        icon: info.icon,
        detail: `与 ${refNote?.country || note.country} 的其他精美纸币`,
      };
    case 'similarDesign': {
      const commonElements = refNote
        ? note.designElements.filter((e) => refNote.designElements.includes(e))
        : note.designElements.slice(0, 2);
      return {
        type: dimension,
        label: info.label,
        icon: info.icon,
        detail: `共同设计元素：${commonElements.join('、') || '艺术风格相近'}`,
      };
    }
    case 'sameTag': {
      const commonTags = refNote
        ? note.tags.filter((t) => refNote.tags.includes(t))
        : note.tags.slice(0, 2);
      return {
        type: dimension,
        label: info.label,
        icon: info.icon,
        detail: `相同标签：${commonTags.join('、') || '主题相关'}`,
      };
    }
    case 'sameMaterial':
      return {
        type: dimension,
        label: info.label,
        icon: info.icon,
        detail: `${note.material}材质，触感独特`,
      };
    case 'sameEra': {
      const decade = Math.floor(note.year / 10) * 10;
      return {
        type: dimension,
        label: info.label,
        icon: info.icon,
        detail: `${decade}年代发行，同时期的经典设计`,
      };
    }
    case 'random':
      return {
        type: dimension,
        label: info.label,
        icon: info.icon,
        detail: '随机发现，探索未知的惊喜',
      };
    default:
      return {
        type: dimension,
        label: info.label,
        icon: info.icon,
        detail: '精心为您推荐',
      };
  }
}

export function recommendByDimension(
  dimension: RecommendDimension,
  options: {
    limit?: number;
    excludeIds?: string[];
    refBanknoteId?: string;
    filters?: RecommendFilterOptions;
  } = {}
): RecommendedBanknote[] {
  const { limit = 8, excludeIds = [], refBanknoteId, filters = {} } = options;

  let available = dedupeById(banknotes, excludeIds);

  if (filters.country) {
    available = available.filter((b) => b.countryCode === filters.country);
  }
  if (filters.designElement && filters.designElement !== '全部') {
    available = available.filter((b) =>
      b.designElements.includes(filters.designElement as (typeof b.designElements)[number])
    );
  }
  if (filters.tag) {
    available = available.filter((b) => b.tags.includes(filters.tag!));
  }
  if (filters.material && filters.material !== '全部') {
    available = available.filter((b) => b.material === filters.material);
  }
  if (filters.yearFrom !== null && filters.yearFrom !== undefined) {
    available = available.filter((b) => b.year >= filters.yearFrom!);
  }
  if (filters.yearTo !== null && filters.yearTo !== undefined) {
    available = available.filter((b) => b.year <= filters.yearTo!);
  }

  const refNote = refBanknoteId ? banknotes.find((b) => b.id === refBanknoteId) : undefined;

  let scored: { note: Banknote; score: number }[] = [];

  switch (dimension) {
    case 'popular': {
      const { min, max } = getMinMax(available, 'favoriteCount');
      scored = available.map((note) => ({
        note,
        score: normalize(note.favoriteCount, min, max) * 100,
      }));
      scored.sort((a, b) => b.score - a.score);
      break;
    }
    case 'latest': {
      const dates = available.map((b) => new Date(b.createdAt).getTime());
      const min = Math.min(...dates);
      const max = Math.max(...dates);
      scored = available.map((note) => ({
        note,
        score: normalize(new Date(note.createdAt).getTime(), min, max) * 100,
      }));
      scored.sort((a, b) => b.score - a.score);
      break;
    }
    case 'rare': {
      scored = available.map((note) => ({
        note,
        score: (note.rarity / 5) * 100,
      }));
      scored.sort((a, b) => b.score - a.score);
      break;
    }
    case 'sameCountry': {
      const country = refNote?.countryCode || available[0]?.countryCode;
      scored = available.map((note) => {
        const match = note.countryCode === country ? 100 : 0;
        const popularityBonus = normalize(note.favoriteCount, 0, 5000) * 20;
        return { note, score: match + popularityBonus };
      });
      scored.sort((a, b) => b.score - a.score);
      break;
    }
    case 'similarDesign': {
      const refElements = refNote?.designElements || available[0]?.designElements || [];
      scored = available.map((note) => {
        const commonElements = note.designElements.filter((e) => refElements.includes(e));
        const similarity = (commonElements.length / Math.max(refElements.length, 1)) * 80;
        const popularityBonus = normalize(note.favoriteCount, 0, 5000) * 20;
        return { note, score: similarity + popularityBonus };
      });
      scored.sort((a, b) => b.score - a.score);
      break;
    }
    case 'sameTag': {
      const refTags = refNote?.tags || available[0]?.tags || [];
      scored = available.map((note) => {
        const commonTags = note.tags.filter((t) => refTags.includes(t));
        const similarity = (commonTags.length / Math.max(refTags.length, 1)) * 80;
        const popularityBonus = normalize(note.favoriteCount, 0, 5000) * 20;
        return { note, score: similarity + popularityBonus };
      });
      scored.sort((a, b) => b.score - a.score);
      break;
    }
    case 'sameMaterial': {
      const material = refNote?.material || available[0]?.material || '棉麻';
      scored = available.map((note) => {
        const match = note.material === material ? 80 : 0;
        const popularityBonus = normalize(note.favoriteCount, 0, 5000) * 20;
        return { note, score: match + popularityBonus };
      });
      scored.sort((a, b) => b.score - a.score);
      break;
    }
    case 'sameEra': {
      const refYear = refNote?.year || available[0]?.year || 2000;
      scored = available.map((note) => {
        const yearDiff = Math.abs(note.year - refYear);
        const eraScore = Math.max(0, 100 - yearDiff * 5);
        const popularityBonus = normalize(note.favoriteCount, 0, 5000) * 20;
        return { note, score: eraScore + popularityBonus };
      });
      scored.sort((a, b) => b.score - a.score);
      break;
    }
    case 'random':
    default: {
      const shuffled = shuffle(available);
      scored = shuffled.map((note) => ({ note, score: Math.random() * 100 }));
      break;
    }
  }

  const sortBy = filters.sortBy || 'score';
  const sortOrder = filters.sortOrder || 'desc';

  if (sortBy !== 'score') {
    scored.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'favorite':
          comparison = a.note.favoriteCount - b.note.favoriteCount;
          break;
        case 'year':
          comparison = a.note.year - b.note.year;
          break;
        case 'rarity':
          comparison = a.note.rarity - b.note.rarity;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  } else if (sortOrder === 'asc') {
    scored.reverse();
  }

  return scored.slice(0, limit).map((item) => ({
    ...item.note,
    score: Math.round(item.score * 10) / 10,
    recommendationReason: generateReason(dimension, item.note, refNote),
  }));
}

export function getNextBatch(
  dimension: RecommendDimension,
  seenIds: string[],
  limit: number = 8
): RecommendedBanknote[] {
  return recommendByDimension(dimension, { limit, excludeIds: seenIds });
}

export function hasMoreRecommendations(
  dimension: RecommendDimension,
  seenIds: string[],
  filters?: RecommendFilterOptions
): boolean {
  const result = recommendByDimension(dimension, { limit: 1, excludeIds: seenIds, filters });
  return result.length > 0;
}
