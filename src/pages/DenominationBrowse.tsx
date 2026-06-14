import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DollarSign, ChevronRight, Coins } from 'lucide-react';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import BanknoteGrid from '@/components/banknote/BanknoteGrid';
import { cn } from '@/utils/cn';

interface DenominationGroup {
  currency: string;
  values: string[];
  count: number;
}

export default function DenominationBrowse() {
  const navigate = useNavigate();
  const [selectedDenomination, setSelectedDenomination] = useState<string | null>(null);
  const { banknotes } = useBanknoteStore();

  const denominationGroups = useMemo(() => {
    const groups: Record<string, string[]> = {};
    banknotes.forEach((b) => {
      const key = `${b.denomination} ${b.currency}`;
      if (!groups[b.currency]) groups[b.currency] = [];
      if (!groups[b.currency].includes(key)) {
        groups[b.currency].push(key);
      }
    });

    return Object.entries(groups)
      .map(([currency, values]) => ({
        currency,
        values: values.sort((a, b) => {
          const numA = parseInt(a);
          const numB = parseInt(b);
          return numA - numB;
        }),
        count: banknotes.filter((b) => b.currency === currency).length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [banknotes]);

  const selectedDenominationBanknotes = useMemo(() => {
    if (!selectedDenomination) return [];
    return banknotes.filter(
      (b) => `${b.denomination} ${b.currency}` === selectedDenomination
    );
  }, [selectedDenomination, banknotes]);

  const handleDenominationClick = (denomination: string) => {
    setSelectedDenomination(denomination === selectedDenomination ? null : denomination);
  };

  const handleBrowseAll = () => {
    if (selectedDenomination) {
      navigate(`/banknotes?denomination=${encodeURIComponent(selectedDenomination)}`);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <DollarSign className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">BROWSE BY DENOMINATION</span>
          </div>
          <h1 className="section-title">按面值浏览</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            按货币单位和面值探索，比较不同国家的面额设计
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-background-light/50 border border-gold/10 rounded-sm p-6">
                <h3 className="font-display text-xl text-parchment mb-4 flex items-center gap-2">
                  <Coins size={20} className="text-gold" />
                  货币单位
                </h3>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  {denominationGroups.map((group) => (
                    <div key={group.currency}>
                      <h4 className="font-display text-lg gold-gradient-text mb-3 sticky top-0 bg-background-light/95 py-1 flex items-center justify-between">
                        <span>{group.currency}</span>
                        <span className="text-sm text-gold-muted">{group.count}张</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {group.values.map((denomination) => (
                          <button
                            key={denomination}
                            onClick={() => handleDenominationClick(denomination)}
                            className={cn(
                              'p-2 rounded-sm font-display text-sm text-center transition-all duration-300',
                              selectedDenomination === denomination
                                ? 'bg-gold text-background'
                                : 'bg-background border border-gold/10 text-parchment hover:border-gold/30 hover:text-gold'
                            )}
                          >
                            {denomination.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedDenomination ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-display text-4xl gold-gradient-text">
                      {selectedDenomination}
                    </h2>
                    <p className="text-gold-muted">{selectedDenominationBanknotes.length} 张纸币</p>
                  </div>
                  <button onClick={handleBrowseAll} className="btn-gold">
                    查看全部
                  </button>
                </div>
                <BanknoteGrid
                  banknotes={selectedDenominationBanknotes}
                  emptyMessage={`${selectedDenomination}暂无收录的纸币`}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <DollarSign className="w-12 h-12 text-gold/50" />
                </div>
                <h3 className="font-display text-2xl text-parchment mb-3">选择一个面值</h3>
                <p className="font-body text-lg text-gold-muted max-w-md">
                  从左侧列表中选择一个货币面值，查看各国相应面额的纸币
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
