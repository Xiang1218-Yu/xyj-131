import { useState, useMemo } from 'react';
import { ArrowRight, Clock, Lightbulb, TrendingUp, RefreshCw, Info } from 'lucide-react';
import {
  availableCurrencies,
  convertCurrency,
  getHistoricalComparison,
  getFunFacts,
  getRate,
} from '@/data/historicalRates';
import type { CurrencyConversionResult } from '@/types';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState('CNY');
  const [fromYear, setFromYear] = useState(1990);
  const [toCurrency, setToCurrency] = useState('CNY');
  const [toYear, setToYear] = useState(2024);
  const [result, setResult] = useState<CurrencyConversionResult | null>(null);

  const fromCurrencyInfo = useMemo(
    () => availableCurrencies.find(c => c.code === fromCurrency),
    [fromCurrency]
  );

  const toCurrencyInfo = useMemo(
    () => availableCurrencies.find(c => c.code === toCurrency),
    [toCurrency]
  );

  const handleConvert = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    const conversion = convertCurrency(
      numAmount,
      fromCurrency,
      fromYear,
      toCurrency,
      toYear
    );

    if (conversion) {
      const comparison = getHistoricalComparison(conversion.fromRate, conversion.toRate, numAmount);
      const funFacts = getFunFacts(conversion.fromRate, conversion.toRate);

      setResult({
        originalAmount: numAmount,
        originalCurrency: fromCurrency,
        originalYear: fromYear,
        targetCurrency: toCurrency,
        targetYear: toYear,
        equivalentAmount: conversion.equivalentAmount,
        historicalComparison: comparison,
        funFacts,
      });
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromYear(toYear);
    setToYear(fromYear);
    setResult(null);
  };

  const formatAmount = (num: number): string => {
    return num.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getCurrencySymbol = (code: string): string => {
    return availableCurrencies.find(c => c.code === code)?.symbol || '';
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="section-title">
            <span className="ornament text-3xl">❧</span>
            历史货币换算器
            <span className="ornament text-3xl">❧</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            穿越时空的货币之旅，体验不同年代的购买力变化
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2 card-gold p-6">
              <h3 className="font-display text-xl text-parchment mb-6 flex items-center gap-2">
                <Clock size={20} className="text-gold" />
                原始货币
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                    货币类型
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => {
                      setFromCurrency(e.target.value);
                      const currency = availableCurrencies.find(c => c.code === e.target.value);
                      if (currency && !currency.years.includes(fromYear)) {
                        setFromYear(currency.years[currency.years.length - 1]);
                      }
                      setResult(null);
                    }}
                    className="input-elegant cursor-pointer"
                  >
                    {availableCurrencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                    发行年代
                  </label>
                  <select
                    value={fromYear}
                    onChange={(e) => {
                      setFromYear(parseInt(e.target.value));
                      setResult(null);
                    }}
                    className="input-elegant cursor-pointer"
                  >
                    {fromCurrencyInfo?.years.map((year) => (
                      <option key={year} value={year}>
                        {year}年
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                    金额
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-display text-xl">
                      {getCurrencySymbol(fromCurrency)}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setResult(null);
                      }}
                      className="input-elegant pl-12"
                      placeholder="输入金额"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex lg:flex-col items-center justify-center gap-4 py-4">
              <button
                onClick={handleSwap}
                className="w-14 h-14 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center text-gold hover:bg-gold/20 hover:border-gold/50 transition-all duration-300 group"
                title="交换货币"
              >
                <RefreshCw size={22} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>
              <ArrowRight size={28} className="text-gold/50 hidden lg:block" />
              <ArrowRight size={28} className="text-gold/50 lg:hidden rotate-90" />
            </div>

            <div className="lg:col-span-2 card-gold p-6">
              <h3 className="font-display text-xl text-parchment mb-6 flex items-center gap-2">
                <TrendingUp size={20} className="text-gold" />
                目标货币
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                    货币类型
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => {
                      setToCurrency(e.target.value);
                      const currency = availableCurrencies.find(c => c.code === e.target.value);
                      if (currency && !currency.years.includes(toYear)) {
                        setToYear(currency.years[currency.years.length - 1]);
                      }
                      setResult(null);
                    }}
                    className="input-elegant cursor-pointer"
                  >
                    {availableCurrencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                    目标年代
                  </label>
                  <select
                    value={toYear}
                    onChange={(e) => {
                      setToYear(parseInt(e.target.value));
                      setResult(null);
                    }}
                    className="input-elegant cursor-pointer"
                  >
                    {toCurrencyInfo?.years.map((year) => (
                      <option key={year} value={year}>
                        {year}年
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleConvert}
                    className="btn-gold-solid w-full text-lg py-4"
                    disabled={!amount || parseFloat(amount) <= 0}
                  >
                    开始换算
                  </button>
                </div>
              </div>
            </div>
          </div>

          {result && (
            <div className="animate-fade-in">
              <div className="relative overflow-hidden rounded-sm border-2 border-gold/30 bg-gradient-to-br from-gold/10 via-background-light/50 to-gold/10 p-8 md:p-12 mb-8">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px]" />

                <div className="relative">
                  <div className="text-center mb-8">
                    <p className="text-gold-muted font-display tracking-widest mb-2">
                      换算结果
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-4xl md:text-5xl font-display">
                      <span className="text-parchment">
                        {getCurrencySymbol(result.originalCurrency)}
                        {formatAmount(result.originalAmount)}
                      </span>
                      <span className="text-gold/50">≈</span>
                      <span className="gold-gradient-text">
                        {getCurrencySymbol(result.targetCurrency)}
                        {formatAmount(result.equivalentAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {getRate(result.originalCurrency, result.originalYear) && (
                      <div className="bg-background/50 p-4 rounded-sm border border-gold/20">
                        <p className="text-gold-muted text-sm mb-1">
                          {result.originalYear}年 {result.originalCurrency} 对美元汇率
                        </p>
                        <p className="font-display text-2xl text-parchment">
                          1 USD = {getRate(result.originalCurrency, result.originalYear)?.rateToUSD} {result.originalCurrency}
                        </p>
                      </div>
                    )}
                    {getRate(result.targetCurrency, result.targetYear) && (
                      <div className="bg-background/50 p-4 rounded-sm border border-gold/20">
                        <p className="text-gold-muted text-sm mb-1">
                          {result.targetYear}年 {result.targetCurrency} 对美元汇率
                        </p>
                        <p className="font-display text-2xl text-parchment">
                          1 USD = {getRate(result.targetCurrency, result.targetYear)?.rateToUSD} {result.targetCurrency}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-start gap-3 p-6 bg-background-light/30 rounded-sm border border-gold/20">
                    <Info size={20} className="text-gold flex-shrink-0 mt-1" />
                    <p className="font-body text-gold-muted leading-relaxed">
                      {result.historicalComparison}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card-gold p-6">
                <h3 className="font-display text-xl text-parchment mb-6 flex items-center gap-2">
                  <Lightbulb size={20} className="text-gold" />
                  历史趣闻
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {result.funFacts.map((fact, index) => (
                    <div
                      key={index}
                      className="p-6 bg-gradient-to-br from-parchment/5 via-background to-parchment/5 rounded-sm border border-gold/10"
                    >
                      <p className="font-body text-gold-muted leading-relaxed">
                        {fact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!result && (
            <div className="card-gold p-12 text-center">
              <TrendingUp size={48} className="text-gold/30 mx-auto mb-4" />
              <p className="text-gold-muted font-body text-lg mb-4">
                选择货币、年代和金额开始换算
              </p>
              <p className="text-gold-muted/60 font-body text-sm">
                支持人民币、美元、欧元、日元、英镑五种货币的跨年代购买力换算
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
