import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useFavoriteStore } from '../useFavoriteStore';

describe('useFavoriteStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoriteStore.setState({ ids: [] });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('初始化时收藏列表为空', () => {
    const { ids } = useFavoriteStore.getState();
    expect(ids).toEqual([]);
  });

  it('addFavorite: 添加新收藏成功', () => {
    const { addFavorite, isFavorite } = useFavoriteStore.getState();
    addFavorite('cn-100-2015');
    
    const state = useFavoriteStore.getState();
    expect(state.ids).toContain('cn-100-2015');
    expect(state.ids.length).toBe(1);
    expect(isFavorite('cn-100-2015')).toBe(true);
  });

  it('addFavorite: 不重复添加已存在的收藏', () => {
    const { addFavorite } = useFavoriteStore.getState();
    addFavorite('cn-100-2015');
    addFavorite('cn-100-2015');
    addFavorite('cn-100-2015');
    
    const state = useFavoriteStore.getState();
    expect(state.ids.length).toBe(1);
  });

  it('removeFavorite: 移除收藏成功', () => {
    const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore.getState();
    addFavorite('cn-100-2015');
    addFavorite('us-100-2009');
    
    expect(useFavoriteStore.getState().ids.length).toBe(2);
    
    removeFavorite('cn-100-2015');
    
    const state = useFavoriteStore.getState();
    expect(state.ids.length).toBe(1);
    expect(isFavorite('cn-100-2015')).toBe(false);
    expect(isFavorite('us-100-2009')).toBe(true);
  });

  it('removeFavorite: 移除不存在的收藏不报错', () => {
    const { removeFavorite } = useFavoriteStore.getState();
    expect(() => removeFavorite('non-existent-id')).not.toThrow();
    expect(useFavoriteStore.getState().ids.length).toBe(0);
  });

  it('isFavorite: 正确判断收藏状态', () => {
    const { addFavorite, isFavorite } = useFavoriteStore.getState();
    addFavorite('cn-100-2015');
    
    expect(isFavorite('cn-100-2015')).toBe(true);
    expect(isFavorite('us-100-2009')).toBe(false);
    expect(isFavorite('')).toBe(false);
  });

  it('支持批量添加和移除多个收藏', () => {
    const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore.getState();
    
    ['cn-100-2015', 'us-100-2009', 'cn-50-2019', 'jp-1000-2004'].forEach(id => {
      addFavorite(id);
    });
    
    expect(useFavoriteStore.getState().ids.length).toBe(4);
    
    removeFavorite('cn-50-2019');
    removeFavorite('jp-1000-2004');
    
    expect(useFavoriteStore.getState().ids.length).toBe(2);
    expect(isFavorite('cn-100-2015')).toBe(true);
    expect(isFavorite('us-100-2009')).toBe(true);
    expect(isFavorite('cn-50-2019')).toBe(false);
  });
});
