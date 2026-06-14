import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import BanknoteGrid from '@/components/banknote/BanknoteGrid';
import { cn } from '@/utils/cn';

export default function YearBrowse() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const { getYears, getBanknotesByYear, banknotes } = useBanknoteStore();

  const years = useMemo(() => getYears(), [getYears]);

  const eras = useMemo(() => {
    const eraGroups = [
      { label: '2020年代', range: [2020, 2029] },
      { label: '2010年代', range: [2010, 2019] },
      { label: '2000年代', range: [2000, 2009] },
      { label: '1990年代', range: [1990, 1999] },
      { label: '1980年代及以前', range: [1900, 1989] },
    ];

    return eraGroups.map((era) => ({
      ...era,
      years: years.filter((y) => y >= era.range[0] && y <= era.range[1]),
      count: banknotes.filter((b) => b.year >= era.range[0] && b.year <= era.range[1]).length,
    }));
  }, [years, banknotes]);

  const selectedYearBanknotes = useMemo(() => {
    if (!selectedYear) return [];
    return getBanknotesByYear(selectedYear);
  }, [selectedYear, getBanknotesByYear]);

  const handleYearClick = (year: number) => {
    setSelectedYear(year === selectedYear ? null : year);
  };

  const handleBrowseAll = () => {
    if (selectedYear) {
      navigate(`/banknotes?yearFrom=${selectedYear}&yearTo=${selectedYear}`);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">BROWSE BY YEAR</span>
          </div>
          <h1 className="section-title">按年份浏览</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            穿越时光，探索不同年代的纸币设计和历史变迁
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {eras.map((era) => (
            <div
              key={era.label}
              className="p-6 bg-background-light/50 border border-gold/10 rounded-sm text-center hover:border-gold/30 transition-all cursor-pointer group"
            >
              <Clock className="w-8 h-8 text-gold/50 mx-auto mb-3 group-hover:text-gold transition-colors" />
              <h3 className="font-display text-xl text-parchment mb-1">{era.label}</h3>
              <p className="text-gold-muted text-sm">{era.count} 张纸币</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-background-light/50 border border-gold/10 rounded-sm p-6">
                <h3 className="font-display text-xl text-parchment mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-gold" />
                  年份列表
                </h3>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  {eras.map(
                    (era) =>
                      era.years.length > 0 && (
                        <div key={era.label}>
                          <h4 className="font-display text-lg gold-gradient-text mb-3 sticky top-0 bg-background-light/95 py-1">
                            {era.label}
                          </h4>
                          <div className="grid grid-cols-3 gap-2">
                            {era.years.map((year) => (
                              <button
                                key={year}
                                onClick={() => handleYearClick(year)}
                                className={cn(
                                  'p-3 rounded-sm font-display text-center transition-all duration-300',
                                  selectedYear === year
                                    ? 'bg-gold text-background'
                                    : 'bg-background border border-gold/10 text-parchment hover:border-gold/30 hover:text-gold'
                                )}
                              >
                                {year}
                              </button>
                            ))}
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedYear ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-display text-4xl gold-gradient-text">
                      {selectedYear}年
                    </h2>
                    <p className="text-gold-muted">{selectedYearBanknotes.length} 张纸币</p>
                  </div>
                  <button onClick={handleBrowseAll} className="btn-gold">
                    查看全部
                  </button>
                </div>
                <BanknoteGrid
                  banknotes={selectedYearBanknotes}
                  emptyMessage={`${selectedYear}年暂无收录的纸币`}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Calendar className="w-12 h-12 text-gold/50" />
                </div>
                <h3 className="font-display text-2xl text-parchment mb-3">选择一个年份</h3>
                <p className="font-body text-lg text-gold-muted max-w-md">
                  从左侧列表中选择一个年份，查看该年发行的所有纸币
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
