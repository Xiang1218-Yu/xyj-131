import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ArrowRight, X, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { useRecommendStore } from '@/store/useRecommendStore';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { getDimensionInfo, getAvailableDimensions } from '@/utils/recommendation';
import type { RecommendDimension, RecommendFilterOptions } from '@/types';
import BanknoteCard from './BanknoteCard';
import EmptyState from '@/components/common/EmptyState';
import { countries } from '@/data/countries';
import { cn } from '@/utils/cn';

interface RecommendSectionProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  initialDimension?: RecommendDimension;
  showFilters?: boolean;
  showRefresh?: boolean;
  className?: string;
}

export default function RecommendSection({
  title,
  subtitle,
  limit = 8,
  initialDimension = 'popular',
  showFilters = true,
  showRefresh = true,
  className,
}: RecommendSectionProps) {
  const {
    dimension,
    recommendations,
    isLoading,
    filters,
    setDimension,
    refreshBatch,
    setLimit,
    setFilters,
    resetFilters,
    loadRecommendations,
  } = useRecommendStore();

  const { banknotes } = useBanknoteStore();

  const dimensions = getAvailableDimensions();

  useEffect(() => {
    setLimit(limit);
    if (initialDimension && dimension !== initialDimension) {
      setDimension(initialDimension);
    } else {
      loadRecommendations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dimInfo = getDimensionInfo(dimension);

  const displayTitle = title || dimInfo.label;
  const displaySubtitle = subtitle || dimInfo.description;

  const filteredByCountry = useMemo(() => {
    if (!filters.country) return banknotes;
    return banknotes.filter((b) => b.countryCode === filters.country);
  }, [banknotes, filters.country]);

  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    filteredByCountry.forEach((b) => set.add(b.material));
    return ['全部', ...Array.from(set).sort()];
  }, [filteredByCountry]);

  const availableDesignElements = useMemo(() => {
    const set = new Set<string>();
    filteredByCountry.forEach((b) => b.designElements.forEach((e) => set.add(e)));
    return ['全部', ...Array.from(set).sort()];
  }, [filteredByCountry]);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    filteredByCountry.forEach((b) => set.add(b.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [filteredByCountry]);

  const sortOptions = [
    { value: 'score', label: '推荐度' },
    { value: 'favorite', label: '收藏数' },
    { value: 'year', label: '发行年份' },
    { value: 'rarity', label: '珍稀度' },
  ];

  const hasActiveFilters =
    filters.country ||
    (filters.designElement && filters.designElement !== '全部') ||
    (filters.material && filters.material !== '全部') ||
    filters.yearFrom ||
    filters.yearTo ||
    filters.tag;

  return (
    <section className={cn('py-20 bg-background-light/30', className)}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl">{dimInfo.icon}</span>
            <span className="text-gold font-display tracking-widest text-sm">
              RECOMMENDED FOR YOU
            </span>
          </div>
          <h2 className="section-title">{displayTitle}</h2>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">{displaySubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {dimensions.map((dim) => {
            const info = getDimensionInfo(dim);
            const isActive = dimension === dim;
            return (
              <button
                key={dim}
                onClick={() => setDimension(dim)}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 rounded-sm border transition-all duration-300',
                  isActive
                    ? 'bg-gold text-background border-gold shadow-gold-lg'
                    : 'bg-background/50 text-gold-muted border-gold/20 hover:border-gold/50 hover:text-gold'
                )}
              >
                <span>{info.icon}</span>
                <span className="font-display text-sm tracking-wider">{info.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-3">
            {showFilters && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={16} className="text-gold-muted" />
                  <select
                    value={filters.country || ''}
                    onChange={(e) => setFilters({ country: e.target.value || undefined })}
                    className="bg-background border border-gold/20 rounded-sm px-3 py-2 text-sm text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
                  >
                    <option value="">全部国家</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={filters.designElement || '全部'}
                  onChange={(e) =>
                    setFilters({
                      designElement: e.target.value === '全部' ? undefined : e.target.value,
                    })
                  }
                  className="bg-background border border-gold/20 rounded-sm px-3 py-2 text-sm text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
                >
                  {availableDesignElements.map((d) => (
                    <option key={d} value={d}>
                      {d === '全部' ? '全部设计' : d}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.material || '全部'}
                  onChange={(e) =>
                    setFilters({
                      material: e.target.value === '全部' ? undefined : e.target.value,
                    })
                  }
                  className="bg-background border border-gold/20 rounded-sm px-3 py-2 text-sm text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
                >
                  {availableMaterials.map((m) => (
                    <option key={m} value={m}>
                      {m === '全部' ? '全部材质' : m}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <select
                    value={filters.yearFrom || ''}
                    onChange={(e) =>
                      setFilters({
                        yearFrom: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="bg-background border border-gold/20 rounded-sm px-3 py-2 text-sm text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
                  >
                    <option value="">起始年份</option>
                    {availableYears.map((y) => (
                      <option key={`from-${y}`} value={y}>
                        {y}年
                      </option>
                    ))}
                  </select>
                  <span className="text-gold-muted">至</span>
                  <select
                    value={filters.yearTo || ''}
                    onChange={(e) =>
                      setFilters({
                        yearTo: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="bg-background border border-gold/20 rounded-sm px-3 py-2 text-sm text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
                  >
                    <option value="">结束年份</option>
                    {availableYears.map((y) => (
                      <option key={`to-${y}`} value={y}>
                        {y}年
                      </option>
                    ))}
                  </select>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gold-muted hover:text-gold transition-colors"
                  >
                    <X size={14} />
                    重置
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-gold-muted" />
              <select
                value={filters.sortBy || 'score'}
                onChange={(e) =>
                  setFilters({
                    sortBy: e.target.value as RecommendFilterOptions['sortBy'],
                  })
                }
                className="bg-background border border-gold/20 rounded-sm px-3 py-2 text-sm text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    按{o.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() =>
                  setFilters({
                    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                  })
                }
                className="w-9 h-9 bg-background border border-gold/20 rounded-sm flex items-center justify-center text-gold-muted hover:text-gold hover:border-gold/50 transition-all"
              >
                <ArrowUpDown
                  size={16}
                  className={cn(
                    'transition-transform duration-300',
                    filters.sortOrder === 'desc' && 'rotate-180'
                  )}
                />
              </button>
            </div>

            {showRefresh && (
              <button
                onClick={refreshBatch}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-sm text-gold hover:bg-gold/20 hover:border-gold/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  size={16}
                  className={cn('transition-transform', isLoading && 'animate-spin')}
                />
                <span className="font-display text-sm tracking-wider">换一批</span>
              </button>
            )}
          </div>
        </div>

        {recommendations.length === 0 ? (
          <EmptyState
            title="暂无推荐"
            description="尝试调整筛选条件或换一批试试"
            action={
              <button onClick={resetFilters} className="btn-gold">
                重置筛选
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recommendations.map((banknote, index) => (
              <BanknoteCard
                key={banknote.id}
                banknote={banknote}
                index={index}
                recommendationReason={banknote.recommendationReason}
                showRecommendationBadge={true}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/banknotes" className="btn-gold inline-flex items-center gap-2">
            查看全部纸币
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
