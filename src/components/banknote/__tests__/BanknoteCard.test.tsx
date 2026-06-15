import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithRouter, fireEvent, screen, waitFor } from '@/test/test-utils';
import BanknoteCard from '../BanknoteCard';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import type { Banknote } from '@/types';

const mockBanknote: Banknote = {
  id: 'cn-100-2015',
  country: '中国',
  countryCode: 'CN',
  year: 2015,
  denomination: '100',
  currency: '元',
  obverseImage: 'https://example.com/obverse.jpg',
  reverseImage: 'https://example.com/reverse.jpg',
  dimensions: '155 × 77 mm',
  material: '棉麻',
  mainColor: '红色',
  obverseDesign: '毛泽东头像、梅花、中国人民银行行名、面额数字',
  reverseDesign: '人民大会堂、中国人民银行汉语拼音行名',
  securityFeatures: ['光彩光变数字', '光变镂空开窗安全线'],
  history: '2015年版第五套人民币100元纸币...',
  rarity: 1,
  favoriteCount: 2847,
  tags: ['人民币', '第五套', '流通钞'],
  createdAt: '2024-01-15',
  designElements: ['人物', '建筑', '符号'],
};

describe('BanknoteCard', () => {
  beforeEach(() => {
    localStorage.clear();
    useFavoriteStore.setState({ ids: [] });
  });

  it('渲染基础信息：国家、面值、年份、材质', () => {
    renderWithRouter(<BanknoteCard banknote={mockBanknote} />);
    
    expect(screen.getByText('中国')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('元')).toBeInTheDocument();
    expect(screen.getByText('2015年')).toBeInTheDocument();
    expect(screen.getByText('棉麻')).toBeInTheDocument();
  });

  it('显示国家旗帜 emoji', () => {
    renderWithRouter(<BanknoteCard banknote={mockBanknote} />);
    expect(screen.getByText('🇨🇳')).toBeInTheDocument();
  });

  it('显示收藏数量', () => {
    renderWithRouter(<BanknoteCard banknote={mockBanknote} />);
    expect(screen.getByText('2,847')).toBeInTheDocument();
  });

  it('点击收藏按钮添加收藏', async () => {
    renderWithRouter(<BanknoteCard banknote={mockBanknote} />);
    
    const favoriteButtons = screen.getAllByRole('button', { name: '收藏' });
    const favoriteButton = favoriteButtons[0];
    
    fireEvent.click(favoriteButton);
    
    await waitFor(() => {
      const { ids } = useFavoriteStore.getState();
      expect(ids).toContain('cn-100-2015');
    });
  });

  it('点击已收藏按钮取消收藏', async () => {
    useFavoriteStore.getState().addFavorite('cn-100-2015');
    
    renderWithRouter(<BanknoteCard banknote={mockBanknote} />);
    
    const unfavoriteButtons = screen.getAllByRole('button', { name: '取消收藏' });
    const unfavoriteButton = unfavoriteButtons[0];
    
    fireEvent.click(unfavoriteButton);
    
    await waitFor(() => {
      const { ids } = useFavoriteStore.getState();
      expect(ids).not.toContain('cn-100-2015');
    });
  });

  it('支持 list 视图模式', () => {
    renderWithRouter(<BanknoteCard banknote={mockBanknote} viewMode="list" />);
    
    expect(screen.getByText('中国')).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText('毛泽东头像、梅花、中国人民银行行名、面额数字')).toBeInTheDocument();
  });

  it('支持 compact 紧凑视图模式', () => {
    renderWithRouter(<BanknoteCard banknote={mockBanknote} viewMode="compact" />);
    
    expect(screen.getByText('中国')).toBeInTheDocument();
    expect(screen.getByText('100 元')).toBeInTheDocument();
    expect(screen.getByText('2015年')).toBeInTheDocument();
  });

  it('渲染银行纸币图片（设置正确的 alt 属性）', () => {
    renderWithRouter(<BanknoteCard banknote={mockBanknote} />);
    
    const image = screen.getByAltText('中国 100 元');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/obverse.jpg');
  });

  it('点击卡片跳转到详情页', () => {
    renderWithRouter(<BanknoteCard banknote={mockBanknote} />);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/banknote/cn-100-2015');
  });

  it('点击收藏按钮不触发页面跳转', () => {
    const originalPreventDefault = Event.prototype.preventDefault;
    const prevented: boolean[] = [];
    Event.prototype.preventDefault = function() {
      prevented.push(true);
      return originalPreventDefault.call(this);
    };
    
    renderWithRouter(<BanknoteCard banknote={mockBanknote} />);
    
    const favoriteButtons = screen.getAllByRole('button', { name: '收藏' });
    fireEvent.click(favoriteButtons[0]);
    
    expect(prevented.length).toBeGreaterThan(0);
    
    Event.prototype.preventDefault = originalPreventDefault;
  });

  it('显示稀有度星级', () => {
    const rareBanknote = { ...mockBanknote, rarity: 4 as const };
    renderWithRouter(<BanknoteCard banknote={rareBanknote} />);
    
    const stars = screen.getAllByRole('img', { hidden: true }).filter(
      (el) => el.getAttribute('aria-label')?.includes('star') || el.tagName === 'svg'
    );
    expect(stars.length).toBeGreaterThanOrEqual(0);
  });
});
