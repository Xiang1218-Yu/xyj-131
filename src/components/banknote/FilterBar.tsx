import { useMemo, useEffect } from 'react';
import { Search, Filter, X, ArrowUpDown, LayoutGrid, List, LayoutList } from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { countries } from '@/data/countries';
import type { ViewMode } from '@/types';
import { cn } from '@/utils/cn';

interface FilterBarProps {
  showSearch?: boolean;
  showViewMode?: boolean;
  className?: string;
}

export default function FilterBar({ showSearch = true, showViewMode = true, className }: FilterBarProps) {
  const {
    search,
    country,
    yearFrom,
    yearTo,
    denomination,
    material,
    designElement,
    tag,
    sortBy,
    sortOrder,
    viewMode,
    setSearch,
    setCountry,
    setYearFrom,
    setYearTo,
    setDenomination,
    setMaterial,
    setDesignElement,
    setTag,
    setSortBy,
    setSortOrder,
    setViewMode,
    resetFilters,
  } = useFilterStore();

  const { banknotes } = useBanknoteStore();

  const filteredByCountry = useMemo(() => {
    if (!country) return banknotes;
    return banknotes.filter((b) => b.countryCode === country);
  }, [banknotes, country]);

  const availableDenominations = useMemo(() => {
    const set = new Set<string>();
    filteredByCountry.forEach((b) => set.add(`${b.denomination} ${b.currency}`));
    return Array.from(set).sort();
  }, [filteredByCountry]);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    filteredByCountry.forEach((b) => set.add(b.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [filteredByCountry]);

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

  useEffect(() => {
    if (denomination && !availableDenominations.includes(denomination)) {
      setDenomination('');
    }
  }, [country, denomination, availableDenominations, setDenomination]);

  useEffect(() => {
    if (yearFrom && !availableYears.includes(yearFrom)) {
      setYearFrom(null);
    }
  }, [country, yearFrom, availableYears, setYearFrom]);

  useEffect(() => {
    if (yearTo && !availableYears.includes(yearTo)) {
      setYearTo(null);
    }
  }, [country, yearTo, availableYears, setYearTo]);

  useEffect(() => {
    if (material && material !== '全部' && !availableMaterials.includes(material)) {
      setMaterial('全部');
    }
  }, [country, material, availableMaterials, setMaterial]);

  useEffect(() => {
    if (designElement && designElement !== '全部' && !availableDesignElements.includes(designElement)) {
      setDesignElement('全部');
    }
  }, [country, designElement, availableDesignElements, setDesignElement]);

  const hasActiveFilters = search || country || yearFrom || yearTo || denomination || (material && material !== '全部') || (designElement && designElement !== '全部') || tag;

  const viewModes: { value: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
    { value: 'grid', label: '网格', icon: LayoutGrid },
    { value: 'list', label: '列表', icon: List },
    { value: 'compact', label: '紧凑', icon: LayoutList },
  ];

  const sortOptions = [
    { value: 'favorite', label: '收藏数' },
    { value: 'year', label: '发行年份' },
    { value: 'country', label: '国家' },
  ];

  return (
    <div className={cn('bg-background-light/50 backdrop-blur-sm border border-gold/10 rounded-sm p-6', className)}>
      {showSearch && (
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索国家、面值、年份、图案、设计元素..."
            className="w-full bg-background border border-gold/20 rounded-sm pl-12 pr-4 py-3 text-parchment placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-all"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">国家</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full bg-background border border-gold/20 rounded-sm px-4 py-2.5 text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
          >
            <option value="">全部国家</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">起始年份</label>
          <select
            value={yearFrom || ''}
            onChange={(e) => setYearFrom(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-background border border-gold/20 rounded-sm px-4 py-2.5 text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
          >
            <option value="">不限</option>
            {availableYears.map((y) => (
              <option key={`from-${y}`} value={y}>
                {y}年
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">结束年份</label>
          <select
            value={yearTo || ''}
            onChange={(e) => setYearTo(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-background border border-gold/20 rounded-sm px-4 py-2.5 text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
          >
            <option value="">不限</option>
            {availableYears.map((y) => (
              <option key={`to-${y}`} value={y}>
                {y}年
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">面值</label>
          <select
            value={denomination}
            onChange={(e) => setDenomination(e.target.value)}
            className="w-full bg-background border border-gold/20 rounded-sm px-4 py-2.5 text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
          >
            <option value="">全部面值</option>
            {availableDenominations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">材质</label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full bg-background border border-gold/20 rounded-sm px-4 py-2.5 text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
          >
            {availableMaterials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">设计元素</label>
          <select
            value={designElement}
            onChange={(e) => setDesignElement(e.target.value)}
            className="w-full bg-background border border-gold/20 rounded-sm px-4 py-2.5 text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer"
          >
            {availableDesignElements.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">排序</label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'year' | 'country' | 'favorite')}
              className="flex-1 bg-background border border-gold/20 rounded-sm px-3 py-2.5 text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer text-sm"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="w-10 bg-background border border-gold/20 rounded-sm flex items-center justify-center text-gold hover:border-gold/50 transition-all"
            >
              <ArrowUpDown
                size={18}
                className={cn('transition-transform duration-300', sortOrder === 'desc' && 'rotate-180')}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gold/10">
        <div className="flex flex-wrap items-center gap-2">
          {tag && (
            <button
              onClick={() => setTag('')}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 bg-gold/20 text-gold rounded-sm hover:bg-gold/30 transition-colors"
            >
              <span>标签: {tag}</span>
              <X size={12} />
            </button>
          )}
          {hasActiveFilters && !tag && (
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gold" />
              <span className="text-sm text-gold-muted">已启用筛选条件</span>
            </div>
          )}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
            >
              <X size={16} />
              重置筛选
            </button>
          )}
        </div>

        {showViewMode && (
          <div className="flex items-center gap-1 p-1 bg-background border border-gold/20 rounded-sm">
            {viewModes.map((vm) => {
              const Icon = vm.icon;
              const isActive = viewMode === vm.value;
              return (
                <button
                  key={vm.value}
                  onClick={() => setViewMode(vm.value)}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-display tracking-wider transition-all duration-200',
                    isActive
                      ? 'bg-gold text-background'
                      : 'text-gold-muted hover:text-gold hover:bg-gold/10'
                  )}
                  title={vm.label}
                >
                  <Icon size={14} />
                  <span className="hidden sm:inline">{vm.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
