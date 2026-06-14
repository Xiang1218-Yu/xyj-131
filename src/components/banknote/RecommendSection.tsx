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
import { SectionTitle, Select, IconButton, Button } from '@/components/ui';

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
        <SectionTitle
          title={displayTitle}
          subtitle={displaySubtitle}
          eyebrow="RECOMMENDED FOR YOU"
          eyebrowIcon={<span className="text-2xl">{dimInfo.icon}</span>}
        />

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
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9a962' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundSize: '14px',
                      backgroundPosition: 'right 10px center',
                      backgroundRepeat: 'no-repeat',
                      appearance: 'none',
                      paddingRight: '36px',
                    }}
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
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9a962' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                    backgroundSize: '14px',
                    backgroundPosition: 'right 10px center',
                    backgroundRepeat: 'no-repeat',
                    appearance: 'none',
                    paddingRight: '36px',
                  }}
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
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9a962' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                    backgroundSize: '14px',
                    backgroundPosition: 'right 10px center',
                    backgroundRepeat: 'no-repeat',
                    appearance: 'none',
                    paddingRight: '36px',
                  }}
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
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9a962' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundSize: '14px',
                      backgroundPosition: 'right 10px center',
                      backgroundRepeat: 'no-repeat',
                      appearance: 'none',
                      paddingRight: '36px',
                    }}
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
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9a962' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundSize: '14px',
                      backgroundPosition: 'right 10px center',
                      backgroundRepeat: 'no-repeat',
                      appearance: 'none',
                      paddingRight: '36px',
                    }}
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
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={X}
                    onClick={resetFilters}
                  >
                    重置
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown size={16} className="text-gold-muted" />
              <Select
                variant="compact"
                size="sm"
                value={filters.sortBy || 'score'}
                onChange={(e) =>
                  setFilters({
                    sortBy: e.target.value as RecommendFilterOptions['sortBy'],
                  })
                }
                wrapperClassName="w-auto"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    按{o.label}
                  </option>
                ))}
              </Select>
              <IconButton
                icon={ArrowUpDown}
                size="sm"
                onClick={() =>
                  setFilters({
                    sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
                  })
                }
                className={cn(
                  filters.sortOrder === 'desc' && '[&>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-300'
                )}
                label={filters.sortOrder === 'asc' ? '升序' : '降序'}
              />
            </div>

            {showRefresh && (
              <Button
                variant="soft"
                size="default"
                leftIcon={RefreshCw}
                onClick={refreshBatch}
                disabled={isLoading}
                className={cn(isLoading && '[&>svg]:animate-spin')}
              >
                换一批
              </Button>
            )}
          </div>
        </div>

        {recommendations.length === 0 ? (
          <EmptyState
            title="暂无推荐"
            description="尝试调整筛选条件或换一批试试"
            action={
              <Button variant="default" onClick={resetFilters}>
                重置筛选
              </Button>
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
          <Button
            variant="default"
            rightIcon={ArrowRight}
            asChild
          >
            <Link to="/banknotes">查看全部纸币</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
