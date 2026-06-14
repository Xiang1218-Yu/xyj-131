import { useMemo, useEffect } from 'react';
import { Search, Filter, X, ArrowUpDown, LayoutGrid, List, LayoutList } from 'lucide-react';
import { useFilterStore } from '@/store/useFilterStore';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { countries } from '@/data/countries';
import type { ViewMode } from '@/types';
import { cn } from '@/utils/cn';
import { Panel, Select, Input, IconButton, Button } from '@/components/ui';

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
    <Panel padding="lg" className={cn('bg-background-light/50 backdrop-blur-sm', className)}>
      {showSearch && (
        <div className="mb-6">
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索国家、面值、年份、图案、设计元素..."
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
        <Select
          label="国家"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">全部国家</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </Select>

        <Select
          label="起始年份"
          value={yearFrom || ''}
          onChange={(e) => setYearFrom(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">不限</option>
          {availableYears.map((y) => (
            <option key={`from-${y}`} value={y}>
              {y}年
            </option>
          ))}
        </Select>

        <Select
          label="结束年份"
          value={yearTo || ''}
          onChange={(e) => setYearTo(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">不限</option>
          {availableYears.map((y) => (
            <option key={`to-${y}`} value={y}>
              {y}年
            </option>
          ))}
        </Select>

        <Select
          label="面值"
          value={denomination}
          onChange={(e) => setDenomination(e.target.value)}
        >
          <option value="">全部面值</option>
          {availableDenominations.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>

        <Select
          label="材质"
          value={material}
          onChange={(e) => setMaterial(e.target.value)}
        >
          {availableMaterials.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>

        <Select
          label="设计元素"
          value={designElement}
          onChange={(e) => setDesignElement(e.target.value)}
        >
          {availableDesignElements.map((d) => (
            <option key={d} value={d}>
              {d === '全部' ? '全部设计' : d}
            </option>
          ))}
        </Select>

        <div>
          <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">排序</label>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'year' | 'country' | 'favorite')}
              className="flex-1 bg-background border border-gold/20 rounded-sm px-3 py-2.5 text-parchment focus:outline-none focus:border-gold/50 transition-all cursor-pointer text-sm"
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
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <IconButton
              icon={ArrowUpDown}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={cn(
                'shrink-0',
                sortOrder === 'desc' && '[&>svg]:rotate-180 [&>svg]:transition-transform [&>svg]:duration-300'
              )}
              label={sortOrder === 'asc' ? '升序' : '降序'}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gold/10">
        <div className="flex flex-wrap items-center gap-2">
          {tag && (
            <Button
              variant="soft"
              size="sm"
              rightIcon={X}
              onClick={() => setTag('')}
            >
              标签: {tag}
            </Button>
          )}
          {hasActiveFilters && !tag && (
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gold" />
              <span className="text-sm text-gold-muted">已启用筛选条件</span>
            </div>
          )}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={X}
              onClick={resetFilters}
            >
              重置筛选
            </Button>
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
    </Panel>
  );
}
