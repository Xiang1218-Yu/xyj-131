import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Filter, ChevronDown } from 'lucide-react';
import { banknotes } from '@/data/banknotes';
import { countries } from '@/data/countries';
import { cn } from '@/utils/cn';

interface TimelineEvent {
  year: number;
  decade: number;
  banknotes: typeof banknotes;
}

const historicalNotes: Record<number, string> = {
  1999: '欧元区国家开始发行欧元纸币，开启欧洲货币一体化新纪元',
  2002: '欧元纸币正式流通，成为欧盟12国的统一货币',
  2016: '印度实施废钞运动，收回500和1000卢比旧钞',
  2019: '瑞士完成第九版纸币系列发行，以垂直设计独树一帜',
};

export default function Timeline() {
  const [filterContinent, setFilterContinent] = useState<string>('all');
  const [showFilter, setShowFilter] = useState(false);

  const continentList = ['all', '亚洲', '欧洲', '北美洲', '南美洲', '大洋洲'];

  const countryCodeToContinent = useMemo(() => {
    const map: Record<string, string> = {};
    countries.forEach(c => { map[c.code] = c.continent; });
    return map;
  }, []);

  const timelineData = useMemo(() => {
    let filtered = banknotes;
    if (filterContinent !== 'all') {
      filtered = banknotes.filter(
        b => countryCodeToContinent[b.countryCode] === filterContinent
      );
    }

    const yearMap = new Map<number, typeof banknotes>();
    filtered.forEach(b => {
      if (!yearMap.has(b.year)) yearMap.set(b.year, []);
      yearMap.get(b.year)!.push(b);
    });

    const events: TimelineEvent[] = [];
    yearMap.forEach((bns, year) => {
      events.push({
        year,
        decade: Math.floor(year / 10) * 10,
        banknotes: bns.sort((a, b2) => a.country.localeCompare(b2.country)),
      });
    });

    return events.sort((a, b) => a.year - b.year);
  }, [filterContinent, countryCodeToContinent]);

  const decades = [...new Set(timelineData.map(e => e.decade))].sort();

  const getCountryFlag = (code: string) => {
    const c = countries.find(x => x.code === code);
    return c?.flag || '🏳️';
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/30 rounded-full mb-6">
            <Clock className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-display tracking-wider">历史长河</span>
          </div>
          <h1 className="section-title mb-4">世界纸币发行年表</h1>
          <p className="section-subtitle">
            以时间轴形式追溯世界各国纸币的发行历史，纵览货币演变脉络
          </p>
          <div className="gold-divider mt-6" />
        </div>

        <div className="relative mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gold/20 rounded-sm text-gold-muted hover:text-gold hover:border-gold/40 transition-all font-display text-sm tracking-wider"
          >
            <Filter className="w-4 h-4" />
            按大洲筛选{filterContinent !== 'all' ? `: ${filterContinent}` : ''}
            <ChevronDown className={cn('w-3 h-3 transition-transform', showFilter && 'rotate-180')} />
          </button>

          {showFilter && (
            <div className="absolute top-full left-0 mt-2 z-10 bg-background-light border border-gold/20 rounded-sm p-2 shadow-gold-lg animate-fade-in">
              {continentList.map(c => (
                <button
                  key={c}
                  onClick={() => { setFilterContinent(c); setShowFilter(false); }}
                  className={cn(
                    'block w-full text-left px-4 py-2 text-sm font-display tracking-wider rounded-sm transition-all',
                    filterContinent === c
                      ? 'bg-gold/10 text-gold'
                      : 'text-gold-muted hover:text-parchment hover:bg-gold/5'
                  )}
                >
                  {c === 'all' ? '全部大洲' : c}
                </button>
              ))}
            </div>
          )}
        </div>

        {decades.map(decade => {
          const decadeEvents = timelineData.filter(e => e.decade === decade);
          return (
            <div key={decade} className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="px-4 py-2 bg-gold/10 border border-gold/30 rounded-sm">
                  <span className="font-display text-2xl text-gold tracking-wider">{decade}s</span>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-gold/30 to-transparent" />
              </div>

              <div className="relative">
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gold/20" />

                {decadeEvents.map((event, eventIdx) => {
                  const isLeft = eventIdx % 2 === 0;
                  const histNote = historicalNotes[event.year];

                  return (
                    <div key={event.year} className="relative mb-8 animate-fade-in">
                      <div
                        className={cn(
                          'absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-gold bg-background z-10',
                          'shadow-gold'
                        )}
                      />

                      <div
                        className={cn(
                          'ml-14 md:ml-0 md:w-[45%] p-5 bg-background-light border border-gold/20 rounded-sm',
                          'hover:border-gold/40 transition-all duration-300 hover:shadow-gold',
                          isLeft ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                        )}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="px-3 py-1 bg-gold/10 border border-gold/20 rounded-sm">
                            <span className="font-display text-lg text-gold tracking-wider">
                              {event.year}
                            </span>
                          </div>
                          <span className="text-gold-muted text-xs font-display tracking-wider">
                            {event.banknotes.length} 种纸币
                          </span>
                        </div>

                        {histNote && (
                          <p className="text-parchment/70 text-sm mb-3 drop-cap font-body leading-relaxed border-l-2 border-gold/30 pl-3">
                            {histNote}
                          </p>
                        )}

                        <div className="grid gap-2">
                          {event.banknotes.map(b => (
                            <Link
                              key={b.id}
                              to={`/banknote/${b.id}`}
                              className="flex items-center gap-3 p-3 bg-background/50 border border-gold/10 rounded-sm hover:border-gold/30 hover:bg-gold/5 transition-all duration-200 group"
                            >
                              <span className="text-lg">{getCountryFlag(b.countryCode)}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-display text-sm text-parchment group-hover:text-gold transition-colors truncate">
                                    {b.country}
                                  </span>
                                  <span className="text-gold-muted text-xs">·</span>
                                  <span className="text-gold-muted text-xs font-display">
                                    {b.denomination} {b.currency}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-gold-muted/50" />
                                  <span className="text-parchment/40 text-xs truncate">
                                    {b.obverseDesign.split('、')[0]}
                                  </span>
                                </div>
                              </div>
                              <div
                                className="w-8 h-8 rounded-full border shrink-0"
                                style={{
                                  borderColor: `var(--tw-gradient-stops, rgba(201,169,98,0.3))`,
                                  background: `linear-gradient(135deg, ${b.mainColor}22, ${b.mainColor}44)`,
                                }}
                              />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {timelineData.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gold-muted font-display text-lg tracking-wider">
              当前筛选条件下暂无纸币数据
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
