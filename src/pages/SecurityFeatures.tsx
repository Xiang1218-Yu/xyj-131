import { useState, useEffect } from 'react';
import { Shield, Lock, Eye, Droplets, Fingerprint, Barcode, X, ChevronRight, Layers, Palette, Sparkles, EyeOff, Hash, Square, Hand, Zap, Orbit, Magnet, Type, Activity, Building2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { securityFeatures, getSecurityCategories } from '@/data/securityFeatures';
import type { SecurityFeature } from '@/types';
import { cn } from '@/utils/cn';

const iconMap: Record<string, LucideIcon> = {
  Droplets,
  Activity,
  Palette,
  Type,
  Sparkles,
  Lightbulb: Sparkles,
  Diamond: Layers,
  Eye,
  Hash,
  Square,
  Hand,
  Zap,
  EyeOff,
  Rainbow: Sparkles,
  Orbit,
  Magnet,
};

const categoryIcons: Record<string, LucideIcon> = {
  '基材防伪': Layers,
  '印刷防伪': Palette,
  '油墨防伪': Sparkles,
  '光学防伪': Eye,
  '数字防伪': Barcode,
  '触觉防伪': Fingerprint,
};

const categoryColors: Record<string, string> = {
  '基材防伪': 'from-blue-600/20 to-blue-900/20 border-blue-500/30',
  '印刷防伪': 'from-emerald-600/20 to-emerald-900/20 border-emerald-500/30',
  '油墨防伪': 'from-purple-600/20 to-purple-900/20 border-purple-500/30',
  '光学防伪': 'from-amber-600/20 to-amber-900/20 border-amber-500/30',
  '数字防伪': 'from-rose-600/20 to-rose-900/20 border-rose-500/30',
  '触觉防伪': 'from-cyan-600/20 to-cyan-900/20 border-cyan-500/30',
};

const categoryIconColors: Record<string, string> = {
  '基材防伪': 'text-blue-400',
  '印刷防伪': 'text-emerald-400',
  '油墨防伪': 'text-purple-400',
  '光学防伪': 'text-amber-400',
  '数字防伪': 'text-rose-400',
  '触觉防伪': 'text-cyan-400',
};

export default function SecurityFeatures() {
  const categories = getSecurityCategories();
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [selectedFeature, setSelectedFeature] = useState<SecurityFeature | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const filteredFeatures = activeCategory === '全部'
    ? securityFeatures
    : securityFeatures.filter(f => f.category === activeCategory);

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Shield;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">ANTI-COUNTERFEITING</span>
          </div>
          <h1 className="section-title">防伪技术百科</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            系统了解纸币防伪技术，从基材到印刷，从光学到数字，
            探索 {securityFeatures.length} 种核心防伪手段背后的科学原理
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <button
            onClick={() => setActiveCategory('全部')}
            className={cn(
              'px-6 py-2.5 rounded-sm font-display tracking-wider text-sm transition-all duration-300',
              activeCategory === '全部'
                ? 'bg-gold text-background shadow-gold-lg'
                : 'border border-gold/30 text-parchment/70 hover:border-gold/60 hover:text-gold'
            )}
          >
            全部技术
          </button>
          {categories.map((category) => {
            const CatIcon = categoryIcons[category];
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-6 py-2.5 rounded-sm font-display tracking-wider text-sm transition-all duration-300 flex items-center gap-2',
                  activeCategory === category
                    ? 'bg-gold text-background shadow-gold-lg'
                    : 'border border-gold/30 text-parchment/70 hover:border-gold/60 hover:text-gold'
                )}
              >
                {CatIcon && <CatIcon size={16} />}
                {category}
              </button>
            );
          })}
        </div>

        <div
          className={cn(
            'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-1000',
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          )}
        >
          {filteredFeatures.map((feature, index) => {
            const Icon = getIcon(feature.iconName);
            const CatIcon = categoryIcons[feature.category];
            return (
              <div
                key={feature.id}
                onClick={() => setSelectedFeature(feature)}
                className={cn(
                  'group relative overflow-hidden rounded-sm border cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-gold-xl',
                  categoryColors[feature.category] || 'border-gold/20 bg-background-light'
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-full bg-background/50 flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all duration-500">
                      <Icon
                        size={28}
                        className={cn(
                          categoryIconColors[feature.category] || 'text-gold',
                          'group-hover:text-background transition-colors duration-500'
                        )}
                      />
                    </div>
                    <div className={cn(
                      'flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-display tracking-wider',
                      categoryIconColors[feature.category],
                      'bg-background/50'
                    )}>
                      {CatIcon && <CatIcon size={12} />}
                      {feature.category}
                    </div>
                  </div>

                  <h3 className="font-display text-xl text-parchment mb-3 group-hover:text-gold transition-colors">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-gold-muted mb-4 line-clamp-3 leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gold-muted">仿制难度</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-2 h-2 rounded-full transition-colors',
                              i <= feature.difficulty ? 'bg-gold' : 'bg-gold/20'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gold-muted">防伪效果</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-2 h-2 rounded-full transition-colors',
                              i <= feature.effectiveness ? 'bg-emerald-400' : 'bg-emerald-400/20'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="flex items-center gap-1 text-gold text-sm font-display">
                      查看详情
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedFeature && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background/95 backdrop-blur-md animate-fade-in"
            onClick={() => setSelectedFeature(null)}
          >
            <div
              className="relative w-full max-w-4xl h-[90vh] max-h-[800px] flex flex-col bg-background-light border border-gold/30 rounded-sm shadow-gold-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn('flex items-center justify-between px-6 py-4 border-b border-gold/20 flex-shrink-0 bg-gradient-to-br', categoryColors[selectedFeature.category])}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const Icon = getIcon(selectedFeature.iconName);
                      return <Icon size={24} className={categoryIconColors[selectedFeature.category]} />;
                    })()}
                  </div>
                  <div>
                    <div className={cn('flex items-center gap-2 mb-1', categoryIconColors[selectedFeature.category])}>
                      {(() => {
                        const CatIcon = categoryIcons[selectedFeature.category];
                        return CatIcon ? <CatIcon size={14} /> : null;
                      })()}
                      <span className="text-xs font-display tracking-wider">{selectedFeature.category}</span>
                    </div>
                    <h2 className="font-display text-xl md:text-2xl text-parchment">
                      {selectedFeature.name}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex gap-6">
                    <div>
                      <div className="text-xs text-gold-muted mb-1">仿制难度</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-2.5 h-2.5 rounded-full',
                              i <= selectedFeature.difficulty ? 'bg-gold' : 'bg-gold/20'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gold-muted mb-1">防伪效果</div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              'w-2.5 h-2.5 rounded-full',
                              i <= selectedFeature.effectiveness ? 'bg-emerald-400' : 'bg-emerald-400/20'
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedFeature(null)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-parchment/70 hover:text-gold hover:bg-gold/10 transition-all duration-300 flex-shrink-0 border border-gold/20 hover:border-gold/50 bg-background/30 backdrop-blur-sm"
                    title="关闭"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="p-6 md:p-8 space-y-8">
                  <section>
                    <h3 className="font-display text-xl text-gold mb-3 flex items-center gap-2">
                      <Lock size={18} />
                      技术描述
                    </h3>
                    <p className="text-parchment/90 leading-relaxed font-body text-lg">
                      {selectedFeature.description}
                    </p>
                  </section>

                  <section>
                    <h3 className="font-display text-xl text-gold mb-3 flex items-center gap-2">
                      <Building2 size={18} />
                      工作原理
                    </h3>
                    <p className="text-parchment/90 leading-relaxed font-body text-lg">
                      {selectedFeature.principle}
                    </p>
                  </section>

                  <section>
                    <h3 className="font-display text-xl text-gold mb-3 flex items-center gap-2">
                      <Layers size={18} />
                      常见类型
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedFeature.examples.map((example) => (
                        <span
                          key={example}
                          className="px-4 py-2 bg-gold/10 text-gold border border-gold/20 rounded-sm text-sm hover:border-gold/50 transition-colors"
                        >
                          {example}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="font-display text-xl text-gold mb-3 flex items-center gap-2">
                      <Activity size={18} />
                      历史发展
                    </h3>
                    <p className="text-parchment/90 leading-relaxed font-body text-lg drop-cap">
                      {selectedFeature.history}
                    </p>
                  </section>
                </div>
              </div>

              <div className="px-6 py-3 border-t border-gold/20 flex items-center justify-end flex-shrink-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5">
                <div className="flex sm:hidden gap-6 mr-4">
                  <div>
                    <div className="text-xs text-gold-muted mb-1">仿制难度</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            'w-2 h-2 rounded-full',
                            i <= selectedFeature.difficulty ? 'bg-gold' : 'bg-gold/20'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gold-muted mb-1">防伪效果</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            'w-2 h-2 rounded-full',
                            i <= selectedFeature.effectiveness ? 'bg-emerald-400' : 'bg-emerald-400/20'
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="btn-gold-solid h-10 px-5 text-sm"
                >
                  了解更多防伪技术
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
