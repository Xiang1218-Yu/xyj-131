import { describe, it, expect, beforeEach } from 'vitest';
import { useFilterStore } from '../useFilterStore';

describe('useFilterStore', () => {
  beforeEach(() => {
    useFilterStore.setState(useFilterStore.getState());
    useFilterStore.getState().resetFilters();
  });

  it('初始化时使用默认筛选值', () => {
    const state = useFilterStore.getState();
    expect(state.search).toBe('');
    expect(state.country).toBe('');
    expect(state.yearFrom).toBeNull();
    expect(state.yearTo).toBeNull();
    expect(state.denomination).toBe('');
    expect(state.material).toBe('全部');
    expect(state.designElement).toBe('全部');
    expect(state.tag).toBe('');
    expect(state.sortBy).toBe('favorite');
    expect(state.sortOrder).toBe('desc');
    expect(state.viewMode).toBe('grid');
  });

  it('setSearch: 设置搜索关键字', () => {
    const { setSearch } = useFilterStore.getState();
    setSearch('人民币');
    
    expect(useFilterStore.getState().search).toBe('人民币');
    
    setSearch('');
    expect(useFilterStore.getState().search).toBe('');
  });

  it('setCountry: 设置国家筛选', () => {
    const { setCountry } = useFilterStore.getState();
    setCountry('CN');
    expect(useFilterStore.getState().country).toBe('CN');
    
    setCountry('');
    expect(useFilterStore.getState().country).toBe('');
  });

  it('setYearFrom / setYearTo: 设置年份范围', () => {
    const { setYearFrom, setYearTo } = useFilterStore.getState();
    
    setYearFrom(2000);
    setYearTo(2020);
    
    expect(useFilterStore.getState().yearFrom).toBe(2000);
    expect(useFilterStore.getState().yearTo).toBe(2020);
    
    setYearFrom(null);
    setYearTo(null);
    
    expect(useFilterStore.getState().yearFrom).toBeNull();
    expect(useFilterStore.getState().yearTo).toBeNull();
  });

  it('setDenomination: 设置面值筛选', () => {
    const { setDenomination } = useFilterStore.getState();
    setDenomination('100 元');
    expect(useFilterStore.getState().denomination).toBe('100 元');
  });

  it('setMaterial: 设置材质筛选', () => {
    const { setMaterial } = useFilterStore.getState();
    setMaterial('棉麻');
    expect(useFilterStore.getState().material).toBe('棉麻');
    
    setMaterial('全部');
    expect(useFilterStore.getState().material).toBe('全部');
  });

  it('setDesignElement: 设置设计元素筛选', () => {
    const { setDesignElement } = useFilterStore.getState();
    setDesignElement('人物');
    expect(useFilterStore.getState().designElement).toBe('人物');
    
    setDesignElement('全部');
    expect(useFilterStore.getState().designElement).toBe('全部');
  });

  it('setTag: 设置标签筛选', () => {
    const { setTag } = useFilterStore.getState();
    setTag('流通钞');
    expect(useFilterStore.getState().tag).toBe('流通钞');
    
    setTag('');
    expect(useFilterStore.getState().tag).toBe('');
  });

  it('setSortBy / setSortOrder: 设置排序方式', () => {
    const { setSortBy, setSortOrder } = useFilterStore.getState();
    
    setSortBy('year');
    setSortOrder('asc');
    
    expect(useFilterStore.getState().sortBy).toBe('year');
    expect(useFilterStore.getState().sortOrder).toBe('asc');
  });

  it('setViewMode: 设置视图模式', () => {
    const { setViewMode } = useFilterStore.getState();
    
    setViewMode('list');
    expect(useFilterStore.getState().viewMode).toBe('list');
    
    setViewMode('compact');
    expect(useFilterStore.getState().viewMode).toBe('compact');
    
    setViewMode('grid');
    expect(useFilterStore.getState().viewMode).toBe('grid');
  });

  it('resetFilters: 重置所有筛选条件到默认值', () => {
    const { setSearch, setCountry, setYearFrom, setYearTo, setViewMode, resetFilters } = useFilterStore.getState();
    
    setSearch('test');
    setCountry('US');
    setYearFrom(2010);
    setYearTo(2020);
    setViewMode('list');
    
    resetFilters();
    
    const state = useFilterStore.getState();
    expect(state.search).toBe('');
    expect(state.country).toBe('');
    expect(state.yearFrom).toBeNull();
    expect(state.yearTo).toBeNull();
    expect(state.viewMode).toBe('grid');
    expect(state.material).toBe('全部');
    expect(state.designElement).toBe('全部');
    expect(state.sortBy).toBe('favorite');
    expect(state.sortOrder).toBe('desc');
  });

  it('可以组合使用多个筛选条件', () => {
    const { setSearch, setCountry, setYearFrom, setYearTo, setMaterial, setTag } = useFilterStore.getState();
    
    setSearch('100');
    setCountry('CN');
    setYearFrom(2010);
    setYearTo(2020);
    setMaterial('棉麻');
    setTag('流通钞');
    
    const state = useFilterStore.getState();
    expect(state.search).toBe('100');
    expect(state.country).toBe('CN');
    expect(state.yearFrom).toBe(2010);
    expect(state.yearTo).toBe(2020);
    expect(state.material).toBe('棉麻');
    expect(state.tag).toBe('流通钞');
  });
});
