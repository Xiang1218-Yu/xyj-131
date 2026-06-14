import type { Country } from '@/types';

export const countries: Country[] = [
  { code: 'CN', name: '中国', flag: '🇨🇳', continent: '亚洲', banknoteCount: 12 },
  { code: 'US', name: '美国', flag: '🇺🇸', continent: '北美洲', banknoteCount: 8 },
  { code: 'JP', name: '日本', flag: '🇯🇵', continent: '亚洲', banknoteCount: 6 },
  { code: 'GB', name: '英国', flag: '🇬🇧', continent: '欧洲', banknoteCount: 7 },
  { code: 'DE', name: '德国', flag: '🇩🇪', continent: '欧洲', banknoteCount: 5 },
  { code: 'FR', name: '法国', flag: '🇫🇷', continent: '欧洲', banknoteCount: 5 },
  { code: 'IT', name: '意大利', flag: '🇮🇹', continent: '欧洲', banknoteCount: 4 },
  { code: 'ES', name: '西班牙', flag: '🇪🇸', continent: '欧洲', banknoteCount: 4 },
  { code: 'RU', name: '俄罗斯', flag: '🇷🇺', continent: '欧洲', banknoteCount: 5 },
  { code: 'KR', name: '韩国', flag: '🇰🇷', continent: '亚洲', banknoteCount: 5 },
  { code: 'IN', name: '印度', flag: '🇮🇳', continent: '亚洲', banknoteCount: 6 },
  { code: 'BR', name: '巴西', flag: '🇧🇷', continent: '南美洲', banknoteCount: 5 },
  { code: 'CA', name: '加拿大', flag: '🇨🇦', continent: '北美洲', banknoteCount: 5 },
  { code: 'AU', name: '澳大利亚', flag: '🇦🇺', continent: '大洋洲', banknoteCount: 5 },
  { code: 'CH', name: '瑞士', flag: '🇨🇭', continent: '欧洲', banknoteCount: 5 },
  { code: 'SG', name: '新加坡', flag: '🇸🇬', continent: '亚洲', banknoteCount: 4 },
  { code: 'HK', name: '中国香港', flag: '🇭🇰', continent: '亚洲', banknoteCount: 4 },
  { code: 'MY', name: '马来西亚', flag: '🇲🇾', continent: '亚洲', banknoteCount: 4 },
  { code: 'TH', name: '泰国', flag: '🇹🇭', continent: '亚洲', banknoteCount: 4 },
  { code: 'ID', name: '印度尼西亚', flag: '🇮🇩', continent: '亚洲', banknoteCount: 4 },
];

export const continents = ['全部', '亚洲', '欧洲', '北美洲', '南美洲', '大洋洲', '非洲'];

export const materials = ['全部', '纸质', '棉麻', '聚合物'];

export const designElementOptions = ['全部', '人物', '建筑', '自然', '动物', '艺术', '科技', '历史', '符号'];
