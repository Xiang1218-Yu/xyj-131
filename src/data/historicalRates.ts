import type { HistoricalExchangeRate } from '@/types';

export const historicalRates: HistoricalExchangeRate[] = [
  { currencyCode: 'CNY', currencyName: '人民币', year: 1949, rateToUSD: 2.3, inflationFactor: 500, funFact: '1949年第一套人民币发行，最大面值5万元，相当于后来的5元。' },
  { currencyCode: 'CNY', currencyName: '人民币', year: 1955, rateToUSD: 2.46, inflationFactor: 300, funFact: '1955年第二套人民币发行，1元新币兑换1万元旧币。' },
  { currencyCode: 'CNY', currencyName: '人民币', year: 1978, rateToUSD: 1.72, inflationFactor: 80, funFact: '改革开放初期，1美元仅兑换1.72元人民币。' },
  { currencyCode: 'CNY', currencyName: '人民币', year: 1990, rateToUSD: 4.78, inflationFactor: 25, funFact: '90年代初，100元人民币是普通工人一个月的工资。' },
  { currencyCode: 'CNY', currencyName: '人民币', year: 2000, rateToUSD: 8.28, inflationFactor: 10, funFact: '2000年千禧年，100元可以买150斤大米。' },
  { currencyCode: 'CNY', currencyName: '人民币', year: 2008, rateToUSD: 6.95, inflationFactor: 4.5, funFact: '2008年北京奥运会，一张开幕式门票最低价200元。' },
  { currencyCode: 'CNY', currencyName: '人民币', year: 2015, rateToUSD: 6.23, inflationFactor: 2.2, funFact: '2015年新版100元人民币发行，增加光彩光变技术。' },
  { currencyCode: 'CNY', currencyName: '人民币', year: 2020, rateToUSD: 6.90, inflationFactor: 1.5, funFact: '2020年数字人民币开始试点测试。' },
  { currencyCode: 'CNY', currencyName: '人民币', year: 2024, rateToUSD: 7.24, inflationFactor: 1, funFact: '2024年，100元人民币约可以看3场电影。' },

  { currencyCode: 'USD', currencyName: '美元', year: 1900, rateToUSD: 1, inflationFactor: 35, funFact: '1900年，1美元可以买4磅牛排。' },
  { currencyCode: 'USD', currencyName: '美元', year: 1929, rateToUSD: 1, inflationFactor: 17, funFact: '1929年大萧条前，福特汽车售价约260美元。' },
  { currencyCode: 'USD', currencyName: '美元', year: 1950, rateToUSD: 1, inflationFactor: 12, funFact: '1950年，1美元可以买20瓶可口可乐。' },
  { currencyCode: 'USD', currencyName: '美元', year: 1971, rateToUSD: 1, inflationFactor: 7.5, funFact: '1971年尼克松宣布美元与黄金脱钩，布雷顿森林体系崩溃。' },
  { currencyCode: 'USD', currencyName: '美元', year: 1985, rateToUSD: 1, inflationFactor: 2.8, funFact: '1985年广场协议，美元对日元贬值。' },
  { currencyCode: 'USD', currencyName: '美元', year: 2000, rateToUSD: 1, inflationFactor: 1.8, funFact: '2000年，100美元可以买一台入门级MP3播放器。' },
  { currencyCode: 'USD', currencyName: '美元', year: 2008, rateToUSD: 1, inflationFactor: 1.4, funFact: '2008年金融危机，美联储推出量化宽松政策。' },
  { currencyCode: 'USD', currencyName: '美元', year: 2020, rateToUSD: 1, inflationFactor: 1.2, funFact: '2020年新冠疫情，美国推出史无前例的财政刺激。' },
  { currencyCode: 'USD', currencyName: '美元', year: 2024, rateToUSD: 1, inflationFactor: 1, funFact: '2024年，100美元约可以加40升汽油。' },

  { currencyCode: 'EUR', currencyName: '欧元', year: 1999, rateToUSD: 1.18, inflationFactor: 2.2, funFact: '1999年欧元正式诞生，作为账面货币使用。' },
  { currencyCode: 'EUR', currencyName: '欧元', year: 2002, rateToUSD: 0.90, inflationFactor: 1.8, funFact: '2002年欧元现金开始流通，12个国家首批使用。' },
  { currencyCode: 'EUR', currencyName: '欧元', year: 2008, rateToUSD: 1.47, inflationFactor: 1.4, funFact: '2008年欧元对美元创下历史新高。' },
  { currencyCode: 'EUR', currencyName: '欧元', year: 2015, rateToUSD: 1.09, inflationFactor: 1.2, funFact: '2015年欧洲央行启动量化宽松政策。' },
  { currencyCode: 'EUR', currencyName: '欧元', year: 2024, rateToUSD: 1.08, inflationFactor: 1, funFact: '2024年欧元区已扩展至20个成员国。' },

  { currencyCode: 'JPY', currencyName: '日元', year: 1950, rateToUSD: 360, inflationFactor: 800, funFact: '1950年日本战后重建，固定汇率1美元兑360日元。' },
  { currencyCode: 'JPY', currencyName: '日元', year: 1970, rateToUSD: 360, inflationFactor: 200, funFact: '1970年大阪世博会，日本经济高速增长。' },
  { currencyCode: 'JPY', currencyName: '日元', year: 1985, rateToUSD: 240, inflationFactor: 15, funFact: '1985年广场协议后，日元开始大幅升值。' },
  { currencyCode: 'JPY', currencyName: '日元', year: 1995, rateToUSD: 94, inflationFactor: 2.5, funFact: '1995年日元对美元创下历史最高，1美元仅兑79日元。' },
  { currencyCode: 'JPY', currencyName: '日元', year: 2000, rateToUSD: 107, inflationFactor: 1.8, funFact: '2000年日本发行新版2000日元纸币纪念冲绳峰会。' },
  { currencyCode: 'JPY', currencyName: '日元', year: 2024, rateToUSD: 149, inflationFactor: 1, funFact: '2024年，1000日元约可以买两碗拉面。' },

  { currencyCode: 'GBP', currencyName: '英镑', year: 1900, rateToUSD: 4.87, inflationFactor: 130, funFact: '1900年，1英镑约等于今天的130英镑购买力。' },
  { currencyCode: 'GBP', currencyName: '英镑', year: 1925, rateToUSD: 4.86, inflationFactor: 60, funFact: '1925年英国恢复金本位制，丘吉尔任财政大臣。' },
  { currencyCode: 'GBP', currencyName: '英镑', year: 1945, rateToUSD: 4.03, inflationFactor: 50, funFact: '二战后，英国经济实力被美国超越。' },
  { currencyCode: 'GBP', currencyName: '英镑', year: 1985, rateToUSD: 1.28, inflationFactor: 3.5, funFact: '1985年英镑对美元创下历史新低。' },
  { currencyCode: 'GBP', currencyName: '英镑', year: 2007, rateToUSD: 2.00, inflationFactor: 1.8, funFact: '2007年英镑对美元短暂突破2比1。' },
  { currencyCode: 'GBP', currencyName: '英镑', year: 2016, rateToUSD: 1.35, inflationFactor: 1.3, funFact: '2016年英国脱欧公投，英镑暴跌。' },
  { currencyCode: 'GBP', currencyName: '英镑', year: 2024, rateToUSD: 1.27, inflationFactor: 1, funFact: '2024年，50英镑纸币印有艾伦·图灵头像。' },
];

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  years: number[];
}

export const availableCurrencies: CurrencyInfo[] = [
  { code: 'CNY', name: '人民币', symbol: '¥', years: [1949, 1955, 1978, 1990, 2000, 2008, 2015, 2020, 2024] },
  { code: 'USD', name: '美元', symbol: '$', years: [1900, 1929, 1950, 1971, 1985, 2000, 2008, 2020, 2024] },
  { code: 'EUR', name: '欧元', symbol: '€', years: [1999, 2002, 2008, 2015, 2024] },
  { code: 'JPY', name: '日元', symbol: '¥', years: [1950, 1970, 1985, 1995, 2000, 2024] },
  { code: 'GBP', name: '英镑', symbol: '£', years: [1900, 1925, 1945, 1985, 2007, 2016, 2024] },
];

export function getRate(currencyCode: string, year: number): HistoricalExchangeRate | undefined {
  const rates = historicalRates.filter(r => r.currencyCode === currencyCode);
  if (rates.length === 0) return undefined;
  
  let closest = rates[0];
  let minDiff = Math.abs(closest.year - year);
  
  for (const rate of rates) {
    const diff = Math.abs(rate.year - year);
    if (diff < minDiff) {
      minDiff = diff;
      closest = rate;
    }
  }
  
  return closest;
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  fromYear: number,
  toCurrency: string,
  toYear: number
): { equivalentAmount: number; fromRate: HistoricalExchangeRate; toRate: HistoricalExchangeRate } | null {
  const fromRate = getRate(fromCurrency, fromYear);
  const toRate = getRate(toCurrency, toYear);
  
  if (!fromRate || !toRate) return null;
  
  const usdAmount = (amount / fromRate.rateToUSD) * fromRate.inflationFactor;
  const targetAmount = (usdAmount * toRate.rateToUSD) / toRate.inflationFactor;
  
  return {
    equivalentAmount: Math.round(targetAmount * 100) / 100,
    fromRate,
    toRate,
  };
}

export function getHistoricalComparison(fromRate: HistoricalExchangeRate, toRate: HistoricalExchangeRate, amount: number): string {
  const yearDiff = toRate.year - fromRate.year;
  const currencyDiff = fromRate.currencyCode !== toRate.currencyCode 
    ? `从${fromRate.currencyName}到${toRate.currencyName}` 
    : `${fromRate.currencyName}内部`;
  
  return `${fromRate.year}年的 ${amount} ${fromRate.currencyName}，经过 ${yearDiff} 年的时间跨度，${currencyDiff}换算后，考虑通货膨胀和汇率变动，在${toRate.year}年的等值购买力约为上述计算结果。`;
}

export function getFunFacts(fromRate: HistoricalExchangeRate, toRate: HistoricalExchangeRate): string[] {
  return [fromRate.funFact, toRate.funFact];
}
