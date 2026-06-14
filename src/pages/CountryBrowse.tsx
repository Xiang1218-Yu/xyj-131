import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, ChevronRight, Map } from 'lucide-react';
import { countries, continents } from '@/data/countries';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import BanknoteGrid from '@/components/banknote/BanknoteGrid';
import { cn } from '@/utils/cn';

export default function CountryBrowse() {
  const navigate = useNavigate();
  const [selectedContinent, setSelectedContinent] = useState('全部');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const { getBanknotesByCountry } = useBanknoteStore();

  const filteredCountries = useMemo(() => {
    if (selectedContinent === '全部') return countries;
    return countries.filter((c) => c.continent === selectedContinent);
  }, [selectedContinent]);

  const alphabetGroups = useMemo(() => {
    const groups: Record<string, typeof countries> = {};
    filteredCountries.forEach((country) => {
      const letter = country.name[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(country);
    });
    return Object.keys(groups)
      .sort()
      .map((letter) => ({ letter, countries: groups[letter] }));
  }, [filteredCountries]);

  const selectedCountryBanknotes = useMemo(() => {
    if (!selectedCountry) return [];
    return getBanknotesByCountry(selectedCountry);
  }, [selectedCountry, getBanknotesByCountry]);

  const selectedCountryInfo = useMemo(() => {
    if (!selectedCountry) return null;
    return countries.find((c) => c.code === selectedCountry);
  }, [selectedCountry]);

  const scrollToLetter = (letter: string) => {
    const element = document.getElementById(`letter-${letter}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCountryClick = (countryCode: string) => {
    setSelectedCountry(countryCode === selectedCountry ? null : countryCode);
  };

  const handleBrowseAll = () => {
    if (selectedCountry) {
      navigate(`/banknotes?country=${selectedCountry}`);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">BROWSE BY COUNTRY</span>
          </div>
          <h1 className="section-title">按国家浏览</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            按国家和地区探索全球纸币，发现不同文化的货币之美
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {continents.map((continent) => (
            <button
              key={continent}
              onClick={() => {
                setSelectedContinent(continent);
                setSelectedCountry(null);
              }}
              className={cn(
                'px-5 py-2 rounded-sm font-display text-sm tracking-wider transition-all duration-300',
                selectedContinent === continent
                  ? 'bg-gold text-background'
                  : 'bg-background-light text-gold-muted border border-gold/20 hover:border-gold/50 hover:text-gold'
              )}
            >
              {continent}
            </button>
          ))}
        </div>

        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {alphabetGroups.map(({ letter }) => (
            <button
              key={letter}
              onClick={() => scrollToLetter(letter)}
              className="w-9 h-9 rounded-sm bg-background-light border border-gold/20 text-gold-muted font-display hover:bg-gold hover:text-background hover:border-gold transition-all duration-300"
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="bg-background-light/50 border border-gold/10 rounded-sm p-6">
                <h3 className="font-display text-xl text-parchment mb-4 flex items-center gap-2">
                  <Map size={20} className="text-gold" />
                  国家列表
                </h3>
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  {alphabetGroups.map(({ letter, countries: groupCountries }) => (
                    <div key={letter} id={`letter-${letter}`}>
                      <h4 className="font-display text-lg gold-gradient-text mb-3 sticky top-0 bg-background-light/95 py-1">
                        {letter}
                      </h4>
                      <div className="space-y-1">
                        {groupCountries.map((country) => (
                          <button
                            key={country.code}
                            onClick={() => handleCountryClick(country.code)}
                            className={cn(
                              'w-full flex items-center justify-between p-3 rounded-sm transition-all duration-300 text-left',
                              selectedCountry === country.code
                                ? 'bg-gold/10 border border-gold/30'
                                : 'hover:bg-gold/5 border border-transparent'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{country.flag}</span>
                              <div>
                                <p className="font-display text-parchment">{country.name}</p>
                                <p className="text-xs text-gold-muted">
                                  {country.banknoteCount} 张纸币
                                </p>
                              </div>
                            </div>
                            <ChevronRight
                              size={16}
                              className={cn(
                                'text-gold-muted transition-transform',
                                selectedCountry === country.code && 'rotate-90 text-gold'
                              )}
                            />
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
            {selectedCountry ? (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{selectedCountryInfo?.flag}</span>
                    <div>
                      <h2 className="font-display text-3xl text-parchment">
                        {selectedCountryInfo?.name}
                      </h2>
                      <p className="text-gold-muted">
                        {selectedCountryInfo?.continent} · {selectedCountryBanknotes.length} 张纸币
                      </p>
                    </div>
                  </div>
                  <button onClick={handleBrowseAll} className="btn-gold">
                    查看全部
                  </button>
                </div>
                <BanknoteGrid
                  banknotes={selectedCountryBanknotes}
                  emptyMessage={`${selectedCountryInfo?.name}暂无收录的纸币`}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center mb-6">
                  <Globe className="w-12 h-12 text-gold/50" />
                </div>
                <h3 className="font-display text-2xl text-parchment mb-3">选择一个国家</h3>
                <p className="font-body text-lg text-gold-muted max-w-md">
                  从左侧列表中选择一个国家，查看该国家发行的所有纸币
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
