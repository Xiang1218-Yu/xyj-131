import { useMemo } from 'react';
import { Search, Filter, X, ArrowUpDown } from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { countries, materials } from '@/data/countries';
import { getDenominations } from '@/data/banknotes';
import { cn } from '@/utils/cn';

interface FilterBarProps {
  showSearch?: boolean;
  className?: string;
}

export default function FilterBar({ showSearch = true, className }: FilterBarProps) {
  const {
    search,
    country,
    yearFrom,
    yearTo,
    denomination,
    material,
    sortBy,
    sortOrder,
    setSearch,
    setCountry,
    setYearFrom,
    setYearTo,
    setDenomination,
    setMaterial,
    setSortBy,
    setSortOrder,
    resetFilters,
  } = useFilterStore();

  const { getYears } = useBanknoteStore();
  const years = useMemo(() => getYears(), [getYears]);
  const denoms = useMemo(() => getDenominations(), []);

  const hasActiveFilters = search || country || yearFrom || yearTo || denomination || (material && material !== '全部');

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
            placeholder="搜索国家、面值、年份、图案..."
            className="w-full bg-background border border-gold/20 rounded-sm pl-12 pr-4 py-3 text-parchment placeholder:text-gold-muted/50 focus:outline-none focus:border-gold/50 transition-all"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
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
            {years.map((y) => (
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
            {years.map((y) => (
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
            {denoms.map((d) => (
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
            {materials.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">排序</label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
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

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-4 border-t border-gold/10">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gold" />
            <span className="text-sm text-gold-muted">已启用筛选条件</span>
          </div>
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors"
          >
            <X size={16} />
            重置筛选
          </button>
        </div>
      )}
    </div>
  );
}
