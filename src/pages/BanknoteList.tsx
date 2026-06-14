import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { useFilterStore } from '@/store/useFilterStore';
import BanknoteGrid from '@/components/banknote/BanknoteGrid';
import FilterBar from '@/components/banknote/FilterBar';
import { Filter } from 'lucide-react';
import type { ViewMode } from '@/types';

export default function BanknoteList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filterBanknotes } = useBanknoteStore();
  const filters = useFilterStore();
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
    setViewMode,
  } = filters;
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const sp = searchParams;
    const searchQuery = sp.get('search');
    const countryParam = sp.get('country');
    const yearFromParam = sp.get('yearFrom');
    const yearToParam = sp.get('yearTo');
    const denominationParam = sp.get('denomination');
    const materialParam = sp.get('material');
    const designElementParam = sp.get('designElement');
    const tagParam = sp.get('tag');
    const viewModeParam = sp.get('viewMode') as ViewMode | null;

    if (searchQuery) setSearch(searchQuery);
    if (countryParam) setCountry(countryParam);
    if (yearFromParam) setYearFrom(Number(yearFromParam));
    if (yearToParam) setYearTo(Number(yearToParam));
    if (denominationParam) setDenomination(denominationParam);
    if (materialParam) setMaterial(materialParam);
    if (designElementParam) setDesignElement(designElementParam);
    if (tagParam) setTag(tagParam);
    if (viewModeParam && ['grid', 'list', 'compact'].includes(viewModeParam)) setViewMode(viewModeParam);
  }, [searchParams, setSearch, setCountry, setYearFrom, setYearTo, setDenomination, setMaterial, setDesignElement, setTag, setViewMode]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (search) params.search = search;
    if (country) params.country = country;
    if (yearFrom !== null) params.yearFrom = yearFrom.toString();
    if (yearTo !== null) params.yearTo = yearTo.toString();
    if (denomination) params.denomination = denomination;
    if (material && material !== '全部') params.material = material;
    if (designElement && designElement !== '全部') params.designElement = designElement;
    if (tag) params.tag = tag;
    if (viewMode !== 'grid') params.viewMode = viewMode;

    setSearchParams(params, { replace: true });
  }, [search, country, yearFrom, yearTo, denomination, material, designElement, tag, viewMode, setSearchParams]);

  const filteredBanknotes = useMemo(() => {
    return filterBanknotes({
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
    });
  }, [filterBanknotes, search, country, yearFrom, yearTo, denomination, material, designElement, tag, sortBy, sortOrder]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Filter className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">BANKNOTE COLLECTION</span>
          </div>
          <h1 className="section-title">全部纸币</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            共收录 {filteredBanknotes.length} 张纸币，使用筛选器快速找到您感兴趣的藏品
          </p>
        </div>

        <FilterBar className="mb-8" />

        <div className="flex items-center justify-between mb-6">
          <p className="text-gold-muted font-body">
            显示 <span className="text-gold font-display">{filteredBanknotes.length}</span> 张纸币
          </p>
        </div>

        <BanknoteGrid
          banknotes={filteredBanknotes}
          emptyMessage="没有找到符合条件的纸币，请尝试调整筛选条件"
          showAction={false}
          viewMode={viewMode}
        />
      </div>
    </div>
  );
}
