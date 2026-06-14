import { useState, useEffect } from 'react';
import { User, Building2, Mountain, Cat, Palette, Rocket, Clock, Flag, Layers, ArrowRight, Heart, Calendar } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { designElementInfos } from '@/data/securityFeatures';
import { Link } from 'react-router-dom';
import type { Banknote, DesignElementCategory } from '@/types';
import { cn, formatNumber, getRarityLabel, getRarityColor } from '@/utils/cn';

const iconMap: Record<string, LucideIcon> = {
  User,
  Building2,
  Mountain,
  Cat,
  Palette,
  Rocket,
  Clock,
  Flag,
};

export default function DesignElements() {
  const { getBanknotesByDesignElement, getDesignElementCounts } = useBanknoteStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const [activeCategory, setActiveCategory] = useState<DesignElementCategory | null>(null);
  const [banknotes, setBanknotes] = useState<Banknote[]>([]);
  const [loaded, setLoaded] = useState(false);

  const counts = getDesignElementCounts();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (activeCategory) {
      setBanknotes(getBanknotesByDesignElement(activeCategory));
    } else {
      setBanknotes([]);
    }
  }, [activeCategory, getBanknotesByDesignElement]);

  const handleFavoriteClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">DESIGN ELEMENTS</span>
          </div>
          <h1 className="section-title">设计元素分类</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            按照纸币上的设计主题浏览，发现人物、建筑、自然、动物、艺术等
            {designElementInfos.length} 大设计元素分类
          </p>
        </div>

        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          {designElementInfos.map((info, index) => {
            const Icon = iconMap[info.iconName] || Layers;
            const count = counts[info.category] || 0;
            const isActive = activeCategory === info.category;

            return (
              <button
                key={info.category}
                onClick={() => setActiveCategory(isActive ? null : info.category)}
                className={cn(
                  'group relative overflow-hidden rounded-sm border text-left p-6 transition-all duration-500',
                  `bg-gradient-to-br ${info.color}`,
                  isActive
                    ? 'border-gold shadow-gold-xl -translate-y-2'
                    : 'border-gold/20 hover:border-gold/50 hover:-translate-y-2 hover:shadow-gold-lg'
                )}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    'w-14 h-14 rounded-full bg-background/50 flex items-center justify-center group-hover:scale-110 transition-all duration-500',
                    isActive && 'bg-gold'
                  )}>
                    <Icon
                      size={28}
                      className={cn(
                        'group-hover:text-gold transition-colors duration-500',
                        isActive ? 'text-background' : 'text-parchment/70'
                      )}
                    />
                  </div>
                  <div className="text-right">
                    <div className="font-display text-3xl gold-gradient-text">{count}</div>
                    <div className="text-xs text-gold-muted tracking-wider">张纸币</div>
                  </div>
                </div>

                <h3 className="font-display text-2xl text-parchment mb-2 group-hover:text-gold transition-colors">
                  {info.category}
                </h3>
                <p className="text-sm text-gold-muted leading-relaxed">
                  {info.description}
                </p>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="flex items-center gap-1 text-gold text-sm font-display">
                    {isActive ? '收起' : '浏览'}
                    <ArrowRight size={16} className={cn(isActive && 'rotate-180', 'transition-transform')} />
                  </div>
                </div>

                {isActive && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
                )}
              </button>
            );
          })}
        </div>

        {activeCategory && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                {(() => {
                  const info = designElementInfos.find(d => d.category === activeCategory);
                  if (!info) return null;
                  const Icon = iconMap[info.iconName] || Layers;
                  return (
                    <>
                      <Icon className="text-gold" size={24} />
                      <span className="text-gold font-display tracking-widest">
                        {activeCategory}主题
                      </span>
                    </>
                  );
                })()}
              </div>
              <h2 className="section-title mb-2">
                {activeCategory}设计纸币
              </h2>
              <div className="gold-divider mb-4" />
              <p className="section-subtitle mb-0">
                共收录 <span className="text-gold font-display">{banknotes.length}</span> 张包含{activeCategory}设计元素的纸币
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {banknotes.map((banknote, index) => {
                const favorite = isFavorite(banknote.id);
                const info = designElementInfos.find(d => d.category === activeCategory);
                return (
                  <Link
                    key={banknote.id}
                    to={`/banknote/${banknote.id}`}
                    className={cn(
                      'group relative overflow-hidden rounded-sm border transition-all duration-500 hover:-translate-y-2 hover:shadow-gold-xl',
                      info ? `bg-gradient-to-br ${info.color} border-gold/30` : 'border-gold/20 bg-background-light',
                      'animate-stagger'
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="aspect-[16/9] overflow-hidden relative">
                      <img
                        src={banknote.obverseImage}
                        alt={`${banknote.country} ${banknote.denomination}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

                      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <div className="bg-gold/90 text-background px-3 py-1 rounded-sm font-display text-sm tracking-wider">
                          {banknote.denomination} {banknote.currency}
                        </div>
                        <span className={cn('text-xs font-display tracking-wider px-2 py-1 rounded-sm bg-background/60', getRarityColor(banknote.rarity))}>
                          {getRarityLabel(banknote.rarity)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleFavoriteClick(e, banknote.id)}
                        className={cn(
                          'absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-background/60 backdrop-blur-sm border border-gold/30',
                          favorite
                            ? 'text-gold hover:bg-gold hover:text-background'
                            : 'text-parchment/70 hover:text-gold hover:border-gold opacity-0 group-hover:opacity-100'
                        )}
                      >
                        <Heart size={18} className={cn('transition-all', favorite && 'fill-current')} />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-display text-xl text-parchment group-hover:text-gold transition-colors">
                          {banknote.country}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gold-muted">
                          <Calendar size={14} />
                          <span>{banknote.year}</span>
                        </div>
                      </div>

                      <p className="text-sm text-parchment/70 line-clamp-2 mb-4 leading-relaxed">
                        {banknote.obverseDesign}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {banknote.designElements.slice(0, 3).map((el) => (
                          <span
                            key={el}
                            className={cn(
                              'text-xs px-2 py-0.5 rounded-sm font-sans',
                              el === activeCategory
                                ? 'bg-gold text-background'
                                : 'bg-gold/10 text-gold/70'
                            )}
                          >
                            {el}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-4 border-t border-gold/10">
                        <div className="text-xs text-gold-muted">
                          {banknote.material}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gold-muted">
                          <Heart size={14} className="fill-gold/30 text-gold/50" />
                          <span>{formatNumber(banknote.favoriteCount)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="absolute inset-0 border-2 border-gold/0 group-hover:border-gold/50 transition-all duration-500 rounded-sm pointer-events-none" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {!activeCategory && (
          <div className="text-center py-16 border-t border-gold/10">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center border-2 border-dashed border-gold/30">
              <Palette size={36} className="text-gold/50" />
            </div>
            <h3 className="font-display text-2xl text-parchment/70 mb-3">
              选择上方分类开始浏览
            </h3>
            <p className="text-gold-muted max-w-md mx-auto">
              点击任意设计元素分类，即可查看该主题下的所有精美纸币
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
