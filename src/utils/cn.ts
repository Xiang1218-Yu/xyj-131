import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return num.toLocaleString('zh-CN');
}

export function getRarityLabel(rarity: number): string {
  const labels: Record<number, string> = {
    1: '普通',
    2: '少见',
    3: '稀少',
    4: '罕见',
    5: '孤品',
  };
  return labels[rarity] || '未知';
}

export function getRarityColor(rarity: number): string {
  const colors: Record<number, string> = {
    1: 'text-gray-400',
    2: 'text-green-400',
    3: 'text-blue-400',
    4: 'text-purple-400',
    5: 'text-gold',
  };
  return colors[rarity] || 'text-gray-400';
}
