import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithRouter, fireEvent, screen, waitFor } from '@/test/test-utils';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import BanknoteList from '@/pages/BanknoteList';
import BanknoteDetail from '@/pages/BanknoteDetail';
import Favorites from '@/pages/Favorites';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useFilterStore } from '@/store/useFilterStore';

describe('简化版用户流程集成测试', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoriteStore.setState({ ids: [] });
    useFilterStore.getState().resetFilters();
  });

  describe('首页浏览', () => {
    it('首页核心内容正常显示', () => {
      renderWithRouter(
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>,
        { initialRoute: '/' }
      );
      
      expect(screen.getByText('探索')).toBeInTheDocument();
      expect(screen.getByText('全球纸币')).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/搜索国家、面值、年份、图案.../)).toBeInTheDocument();
      expect(screen.getByText('最新收录')).toBeInTheDocument();
    });

    it('首页分类入口链接正确', () => {
      renderWithRouter(
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>,
        { initialRoute: '/' }
      );
      
      expect(screen.getByRole('link', { name: /按国家浏览/ })).toHaveAttribute('href', '/countries');
      expect(screen.getByRole('link', { name: /开始探索/ })).toHaveAttribute('href', '/banknotes');
    });
  });

  describe('筛选搜索流程', () => {
    it('列表页搜索框更新筛选状态', () => {
      renderWithRouter(
        <Routes>
          <Route path="/banknotes" element={<BanknoteList />} />
        </Routes>,
        { initialRoute: '/banknotes' }
      );
      
      const searchInput = screen.getByPlaceholderText(/搜索国家、面值、年份、图案、设计元素/);
      fireEvent.change(searchInput, { target: { value: '中国' } });
      
      expect(useFilterStore.getState().search).toBe('中国');
    });

    it('列表页重置筛选按钮', () => {
      useFilterStore.getState().setSearch('test');
      useFilterStore.getState().setCountry('CN');
      
      renderWithRouter(
        <Routes>
          <Route path="/banknotes" element={<BanknoteList />} />
        </Routes>,
        { initialRoute: '/banknotes' }
      );
      
      const resetButtons = screen.getAllByText(/重置筛选/);
      if (resetButtons.length > 0) {
        fireEvent.click(resetButtons[0]);
        
        expect(useFilterStore.getState().search).toBe('');
        expect(useFilterStore.getState().country).toBe('');
      }
    });
  });

  describe('收藏流程', () => {
    it('收藏 Store 可以正确添加收藏', () => {
      const { addFavorite, isFavorite } = useFavoriteStore.getState();
      addFavorite('cn-100-2015');
      
      expect(isFavorite('cn-100-2015')).toBe(true);
      expect(useFavoriteStore.getState().ids.length).toBe(1);
    });

    it('收藏页面空状态', () => {
      renderWithRouter(
        <Routes>
          <Route path="/favorites" element={<Favorites />} />
        </Routes>,
        { initialRoute: '/favorites' }
      );
      
      expect(screen.getByText('收藏夹是空的')).toBeInTheDocument();
    });
  });

  describe('详情页流程', () => {
    it('详情页显示核心信息', async () => {
      renderWithRouter(
        <Routes>
          <Route path="/banknote/:id" element={<BanknoteDetail />} />
        </Routes>,
        { initialRoute: '/banknote/cn-100-2015' }
      );
      
      await waitFor(() => {
        expect(screen.getByText('中国')).toBeInTheDocument();
      });
      
      expect(screen.getByText('发行国家')).toBeInTheDocument();
      expect(screen.getByText('防伪特征')).toBeInTheDocument();
      expect(screen.getByText('历史背景')).toBeInTheDocument();
    });

    it('详情页返回列表链接', async () => {
      renderWithRouter(
        <Routes>
          <Route path="/banknote/:id" element={<BanknoteDetail />} />
        </Routes>,
        { initialRoute: '/banknote/cn-100-2015' }
      );
      
      await waitFor(() => {
        expect(screen.getByText('返回列表')).toBeInTheDocument();
      });
    });
  });
});
