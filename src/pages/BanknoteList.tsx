import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { useFilterStore } from '@/store/useFilterStore';
import BanknoteGrid from '@/components/banknote/BanknoteGrid';
import FilterBar from '@/components/banknote/FilterBar';
import { Filter } from 'lucide-react';

export default function BanknoteList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { filterBanknotes } = useBanknoteStore();
  const filters = useFilterStore();

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const countryParam = searchParams.get('country');
    const yearFromParam = searchParams.get('yearFrom');
    const yearToParam = searchParams.get('yearTo');
    const denominationParam = searchParams.get('denomination');
    const materialParam = searchParams.get('material');
    const designElementParam = searchParams.get('designElement');

    if (searchQuery) filters.setSearch(searchQuery);
    if (countryParam) filters.setCountry(countryParam);
    if (yearFromParam) filters.setYearFrom(Number(yearFromParam));
    if (yearToParam) filters.setYearTo(Number(yearToParam));
    if (denominationParam) filters.setDenomination(denominationParam);
    if (materialParam) filters.setMaterial(materialParam);
    if (designElementParam) filters.setDesignElement(designElementParam);
  }, [searchParams, filters]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.country) params.country = filters.country;
    if (filters.yearFrom !== null) params.yearFrom = filters.yearFrom.toString();
    if (filters.yearTo !== null) params.yearTo = filters.yearTo.toString();
    if (filters.denomination) params.denomination = filters.denomination;
    if (filters.material && filters.material !== '全部') params.material = filters.material;
    if (filters.designElement && filters.designElement !== '全部') params.designElement = filters.designElement;
    
    setSearchParams(params, { replace: true });
  }, [filters.search, filters.country, filters.yearFrom, filters.yearTo, filters.denomination, filters.material, filters.designElement, setSearchParams]);

  const filteredBanknotes = useMemo(() => {
    return filterBanknotes({
      search: filters.search,
      country: filters.country,
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      denomination: filters.denomination,
      material: filters.material,
      designElement: filters.designElement,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
  }, [filterBanknotes, filters]);

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
        />
      </div>
    </div>
  );
}
