import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Calendar, DollarSign, Sparkles, ArrowRight, Coins, Shield, Gift, Palette } from 'lucide-react';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import RecommendSection from '@/components/banknote/RecommendSection';
import SearchBar from '@/components/common/SearchBar';
import { countries } from '@/data/countries';
import { getYears } from '@/data/banknotes';
import { securityFeatures } from '@/data/securityFeatures';
import { formatNumber } from '@/utils/cn';
import { Button, Panel, SectionTitle, StatCard } from '@/components/ui';

export default function Home() {
  const navigate = useNavigate();
  const { getLatestBanknotes, banknotes } = useBanknoteStore();
  const [searchValue, setSearchValue] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const latestBanknotes = getLatestBanknotes(4);
  const years = getYears();
  const totalBanknotes = banknotes.length;
  const totalCountries = countries.length;
  const totalYears = years.length;

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(`/banknotes?search=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleSearchNavigate = (params: Record<string, string>) => {
    const qs = new URLSearchParams(params).toString();
    navigate(`/banknotes?${qs}`);
  };

  const categoryCards = [
    {
      icon: Globe,
      title: '按国家浏览',
      description: `${totalCountries} 个国家和地区`,
      path: '/countries',
      color: 'from-blue-600/20 to-blue-900/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400',
    },
    {
      icon: Calendar,
      title: '按年份浏览',
      description: `${totalYears} 个发行年份`,
      path: '/years',
      color: 'from-green-600/20 to-green-900/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400',
    },
    {
      icon: DollarSign,
      title: '按面值浏览',
      description: '多种货币面额',
      path: '/denominations',
      color: 'from-purple-600/20 to-purple-900/20',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400',
    },
    {
      icon: Palette,
      title: '设计元素',
      description: '人物、建筑、自然等8大主题',
      path: '/design-elements',
      color: 'from-pink-600/20 to-pink-900/20',
      borderColor: 'border-pink-500/30',
      iconColor: 'text-pink-400',
    },
    {
      icon: Shield,
      title: '防伪百科',
      description: `${securityFeatures.length} 种防伪技术详解`,
      path: '/security-features',
      color: 'from-amber-600/20 to-amber-900/20',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-400',
    },
    {
      icon: Gift,
      title: '幸运抽卡',
      description: '沉浸式随机探索体验',
      path: '/lucky-draw',
      color: 'from-rose-600/20 to-rose-900/20',
      borderColor: 'border-rose-500/30',
      iconColor: 'text-rose-400',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-[120px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-copper rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="absolute inset-0 bg-paper-texture pointer-events-none" />

        <div className="relative z-10 container mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div
              className={`transition-all duration-1000 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="ornament text-2xl">❧</span>
                <span className="text-gold font-display tracking-[0.3em] text-sm">世界纸币数字博物馆</span>
                <span className="ornament text-2xl">❧</span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-parchment mb-6 leading-tight">
                <span className="block">探索</span>
                <span className="gold-gradient-text text-shadow-gold">全球纸币</span>
                <span className="block">的艺术与历史</span>
              </h1>

              <p className="font-body text-xl md:text-2xl text-gold-muted max-w-2xl mx-auto mb-10 leading-relaxed">
                收录来自 {totalCountries} 个国家，跨越 {Math.min(...years)} - {Math.max(...years)} 年的
                <span className="text-gold"> {totalBanknotes} </span>
                张精美纸币，足不出户领略世界货币文化之美
              </p>

              <div className="max-w-2xl mx-auto mb-8">
                <SearchBar
                  value={searchValue}
                  onChange={setSearchValue}
                  onSubmit={handleSearch}
                  onNavigate={handleSearchNavigate}
                  placeholder="搜索国家、面值、年份、图案..."
                  className="animate-glow-pulse"
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                <Button variant="solid" size="lg" asChild>
                  <Link to="/banknotes">开始探索</Link>
                </Button>
                <Button variant="default" size="lg" asChild>
                  <Link to="/countries">按国家浏览</Link>
                </Button>
              </div>
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto transition-all duration-1000 delay-300 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {categoryCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.path}
                    to={card.path}
                    className={`group relative p-8 rounded-sm border ${card.borderColor} bg-gradient-to-br ${card.color} backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-gold-xl hover:border-gold/50`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`w-14 h-14 rounded-full bg-background/50 flex items-center justify-center mb-4 group-hover:bg-gold group-hover:scale-110 transition-all duration-500`}
                    >
                      <Icon
                        size={28}
                        className={`${card.iconColor} group-hover:text-background transition-colors duration-500`}
                      />
                    </div>
                    <h3 className="font-display text-xl text-parchment mb-2 group-hover:text-gold transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-gold-muted font-body">{card.description}</p>
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight size={20} className="text-gold" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gold/30 flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-gold/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      <RecommendSection
        title="智能推荐"
        subtitle="多种推荐维度，发现更多精美纸币"
        limit={8}
        initialDimension="popular"
      />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionTitle
            title="最新收录"
            subtitle="最近新加入收藏馆的珍稀纸币"
            eyebrow="NEW ARRIVALS"
            eyebrowIcon={<Sparkles className="text-gold w-6 h-6" />}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestBanknotes.map((banknote) => (
              <Link
                key={banknote.id}
                to={`/banknote/${banknote.id}`}
                className="group relative overflow-hidden rounded-sm border border-gold/10 bg-background-light transition-all duration-500 hover:border-gold/40 hover:shadow-gold-lg"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={banknote.obverseImage}
                    alt={banknote.country}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{countries.find(c => c.code === banknote.countryCode)?.flag}</span>
                    <span className="font-display text-lg gold-gradient-text">
                      {banknote.denomination} {banknote.currency}
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-parchment group-hover:text-gold transition-colors">
                    {banknote.country}
                  </h3>
                  <p className="text-sm text-gold-muted">{banknote.year}年发行</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-background-light/50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <StatCard value={totalBanknotes} label="收录纸币" />
              <StatCard value={totalCountries} label="国家地区" />
              <StatCard value={totalYears} label="发行年份" />
              <StatCard
                value={formatNumber(banknotes.reduce((sum, b) => sum + b.favoriteCount, 0))}
                label="收藏总数"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Panel
            variant="gradient"
            padding="xl"
            gradientColors="from-gold/5 via-background to-copper/5"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-copper/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                  <Coins className="text-gold w-6 h-6" />
                </div>
                <h2 className="font-display text-3xl md:text-4xl text-parchment">
                  开启您的纸币收藏之旅
                </h2>
              </div>
              <p className="font-body text-lg text-gold-muted mb-8 leading-relaxed">
                无论是资深藏家还是初入门的爱好者，这里都能让您发现纸币之美。
                浏览全球各国的货币文化，了解每张纸币背后的历史故事，
                创建属于您自己的数字收藏夹。
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="solid" size="lg" asChild>
                  <Link to="/banknotes">浏览纸币</Link>
                </Button>
                <Button variant="default" size="lg" asChild>
                  <Link to="/favorites">我的收藏</Link>
                </Button>
              </div>
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
