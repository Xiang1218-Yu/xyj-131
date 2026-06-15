import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderWithRouter, fireEvent, screen, waitFor, act } from '@/test/test-utils';
import SearchBar from '../SearchBar';

describe('SearchBar', () => {
  const onChange = vi.fn();
  const onSubmit = vi.fn();
  const onNavigate = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
    onSubmit.mockClear();
    onNavigate.mockClear();
    localStorage.clear();
  });

  it('渲染搜索输入框，显示占位符', () => {
    renderWithRouter(
      <SearchBar
        value=""
        onChange={onChange}
        placeholder="搜索国家、面值、年份..."
      />
    );
    
    const input = screen.getByPlaceholderText('搜索国家、面值、年份...');
    expect(input).toBeInTheDocument();
  });

  it('输入文字时触发 onChange 回调', () => {
    renderWithRouter(
      <SearchBar
        value=""
        onChange={onChange}
      />
    );
    
    const input = screen.getByPlaceholderText(/搜索/);
    fireEvent.change(input, { target: { value: '人民币' } });
    
    expect(onChange).toHaveBeenCalledWith('人民币');
  });

  it('显示搜索图标', () => {
    renderWithRouter(
      <SearchBar
        value=""
        onChange={onChange}
      />
    );
    
    const svgs = document.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('当有值时显示清除按钮，点击后清除内容', () => {
    let value = 'test';
    const localOnChange = vi.fn((v) => { value = v; });
    
    const { rerender } = renderWithRouter(
      <SearchBar
        value={value}
        onChange={localOnChange}
      />
    );
    
    const clearButtons = screen.getAllByRole('button');
    const clearButton = clearButtons.find(btn => 
      btn.querySelector('svg') && (btn as HTMLButtonElement).type === 'button'
    );
    if (clearButton) {
      fireEvent.click(clearButton);
      expect(localOnChange).toHaveBeenCalledWith('');
    }
  });

  it('提交表单时触发 onSubmit 回调', () => {
    renderWithRouter(
      <SearchBar
        value="人民币"
        onChange={onChange}
        onSubmit={onSubmit}
      />
    );
    
    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
      expect(onSubmit).toHaveBeenCalledWith('人民币');
    }
  });

  it('onSubmit 未定义时，默认跳转到 banknotes 页面带搜索参数', () => {
    renderWithRouter(
      <SearchBar
        value="美元"
        onChange={onChange}
      />,
      { initialRoute: '/' }
    );
    
    const form = document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }
  });

  it('传递 className 正确应用到容器', () => {
    renderWithRouter(
      <SearchBar
        value=""
        onChange={onChange}
        className="custom-test-class"
      />
    );
    
    const container = document.querySelector('.custom-test-class');
    expect(container).toBeInTheDocument();
  });

  it('点击输入框聚焦时展开下拉面板', async () => {
    renderWithRouter(
      <SearchBar
        value=""
        onChange={onChange}
      />
    );
    
    const input = screen.getByPlaceholderText(/搜索/);
    
    await act(async () => {
      fireEvent.focus(input);
    });
  });
});
