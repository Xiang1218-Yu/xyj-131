import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Sparkles, Heart, ArrowRight, RotateCcw, Eye, Shield, MapPin, Calendar, Star, X } from 'lucide-react';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import type { Banknote } from '@/types';
import { cn, formatNumber, getRarityLabel, getRarityColor } from '@/utils/cn';

export default function LuckyDraw() {
  const navigate = useNavigate();
  const { getRandomBanknotes, banknotes } = useBanknoteStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();

  const [drawnBanknotes, setDrawnBanknotes] = useState<Banknote[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);
  const [drawCount, setDrawCount] = useState(0);
  const [cardFlipping, setCardFlipping] = useState<number | null>(null);
  const [showDetail, setShowDetail] = useState<Banknote | null>(null);

  const handleDraw = useCallback((count: number = 3) => {
    if (isDrawing) return;
    setIsDrawing(true);
    setRevealedIndex(null);

    const drawnIds = drawnBanknotes.map(b => b.id);
    let available = banknotes.filter(b => !drawnIds.includes(b.id));

    if (available.length < count) {
      setDrawnBanknotes([]);
      available = [...banknotes];
    }

    const newDrawn = getRandomBanknotes(count, drawnBanknotes.length > 0 && available.length >= count ? drawnIds : []);

    setTimeout(() => {
      setDrawnBanknotes(newDrawn);
      setDrawCount(prev => prev + count);
      setIsDrawing(false);
      newDrawn.forEach((_, index) => {
        setTimeout(() => {
          setRevealedIndex(index);
        }, index * 400);
      });
    }, 1500);
  }, [isDrawing, drawnBanknotes, banknotes, getRandomBanknotes]);

  const handleCardClick = (banknote: Banknote, index: number) => {
    if (cardFlipping === index) return;
    setCardFlipping(index);
    setTimeout(() => {
      setShowDetail(banknote);
      setCardFlipping(null);
    }, 600);
  };

  const handleFavoriteClick = (e: React.MouseEvent, banknote: Banknote) => {
    e.stopPropagation();
    if (isFavorite(banknote.id)) {
      removeFavorite(banknote.id);
    } else {
      addFavorite(banknote.id);
    }
  };

  const handleReset = () => {
    setDrawnBanknotes([]);
    setRevealedIndex(null);
    setShowDetail(null);
  };

  return (
    <div className="min-h-screen py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-copper rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>
      <div className="absolute inset-0 bg-paper-texture pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">LUCKY DRAW</span>
            <Sparkles className="text-gold w-6 h-6" />
          </div>
          <h1 className="section-title">幸运抽卡</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            开启沉浸式探索之旅，随机发现来自世界各地的珍稀纸币，
            每一次抽卡都是一次未知的惊喜
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => handleDraw(1)}
            disabled={isDrawing}
            className={cn(
              'group relative px-8 py-4 rounded-sm font-display tracking-wider text-lg transition-all duration-500 overflow-hidden',
              isDrawing
                ? 'bg-gold/50 text-background/70 cursor-not-allowed'
                : 'btn-gold-solid hover:scale-105 hover:shadow-gold-xl'
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Gift size={20} />
              单抽 x1
            </span>
            {isDrawing && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={20} className="animate-spin" />
              </div>
            )}
          </button>
          <button
            onClick={() => handleDraw(3)}
            disabled={isDrawing}
            className={cn(
              'group relative px-8 py-4 rounded-sm font-display tracking-wider text-lg transition-all duration-500 overflow-hidden animate-glow-pulse',
              isDrawing
                ? 'bg-gold/50 text-background/70 cursor-not-allowed'
                : 'btn-gold-solid hover:scale-105'
            )}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={20} />
              三连抽 x3
            </span>
          </button>
          {drawnBanknotes.length > 0 && (
            <button
              onClick={handleReset}
              className="px-8 py-4 rounded-sm border border-gold/30 text-parchment/70 font-display tracking-wider text-lg transition-all duration-300 hover:border-gold hover:text-gold flex items-center gap-2"
            >
              <RotateCcw size={20} />
              重置
            </button>
          )}
        </div>

        <div className="text-center mb-8">
          <p className="text-gold-muted font-body">
            已抽取 <span className="text-gold font-display text-xl">{drawCount}</span> 张纸币
          </p>
        </div>

        <div className="flex justify-center">
          <div
            className={cn(
              'grid gap-8 transition-all duration-500',
              drawnBanknotes.length === 1
                ? 'grid-cols-1'
                : drawnBanknotes.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            )}
          >
            {drawnBanknotes.length === 0 && !isDrawing && (
              <div className="col-span-full py-24">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gold/10 flex items-center justify-center border-2 border-dashed border-gold/30">
                    <Gift size={48} className="text-gold/50" />
                  </div>
                  <h3 className="font-display text-2xl text-parchment/70 mb-3">
                    点击上方按钮开启抽卡
                  </h3>
                  <p className="text-gold-muted max-w-md mx-auto">
                    每次抽卡都会随机展示来自全球各国的精美纸币，
                    探索未知的货币文化之美
                  </p>
                </div>
              </div>
            )}

            {isDrawing && (
              <>
                {Array.from({ length: drawnBanknotes.length > 0 ? drawnBanknotes.length : 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-72 h-[450px] rounded-sm border border-gold/20 bg-background-light/50 flex items-center justify-center"
                  >
                    <div className="text-center">
                      <Sparkles size={40} className="text-gold animate-spin mx-auto mb-4" />
                      <p className="text-gold font-display tracking-wider">抽取中...</p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {!isDrawing && drawnBanknotes.map((banknote, index) => {
              const isRevealed = revealedIndex !== null && revealedIndex >= index;
              const favorite = isFavorite(banknote.id);

              return (
                <div
                  key={banknote.id}
                  className={cn(
                    'w-72 h-[450px] relative group cursor-pointer transition-all duration-500',
                    isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleCardClick(banknote, index)}
                >
                  <div
                    className={cn(
                      'absolute inset-0 preserve-3d transition-transform duration-700',
                      cardFlipping === index && 'rotate-y-180'
                    )}
                  >
                    <div className="absolute inset-0 backface-hidden">
                      <div
                        className={cn(
                          'relative w-full h-full rounded-sm overflow-hidden border-2 transition-all duration-500 group-hover:shadow-gold-xl group-hover:-translate-y-2',
                          banknote.rarity >= 4
                            ? 'border-gold shadow-gold-lg'
                            : banknote.rarity >= 3
                            ? 'border-purple-500/50'
                            : 'border-gold/30'
                        )}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-background to-copper/5" />
                        {banknote.rarity >= 4 && (
                          <div className="absolute inset-0 opacity-30">
                            <div className="absolute inset-0 bg-gradient-to-br from-gold/20 via-transparent to-gold/20 animate-shimmer"
                              style={{ backgroundSize: '200% 100%' }}
                            />
                          </div>
                        )}

                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={banknote.obverseImage}
                            alt={`${banknote.country} ${banknote.denomination}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                            onClick={(e) => handleFavoriteClick(e, banknote)}
                            className={cn(
                              'absolute top-3 right-3 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-background/60 backdrop-blur-sm border border-gold/30',
                              favorite
                                ? 'text-gold hover:bg-gold hover:text-background'
                                : 'text-parchment/70 hover:text-gold hover:border-gold'
                            )}
                          >
                            <Heart size={18} className={cn('transition-all', favorite && 'fill-current')} />
                          </button>
                        </div>

                        <div className="relative p-5">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="font-display text-xl text-parchment group-hover:text-gold transition-colors">
                              {banknote.country}
                            </h3>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: banknote.rarity }).map((_, i) => (
                                <Star key={i} size={12} className="text-gold fill-gold/30" />
                              ))}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="flex items-center gap-1.5 text-sm text-gold-muted">
                              <Calendar size={14} />
                              <span>{banknote.year}年</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gold-muted">
                              <MapPin size={14} />
                              <span>{banknote.material}</span>
                            </div>
                          </div>

                          <p className="text-sm text-parchment/70 line-clamp-2 mb-4 leading-relaxed">
                            {banknote.obverseDesign}
                          </p>

                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {banknote.designElements.slice(0, 3).map((el) => (
                              <span
                                key={el}
                                className="text-xs px-2 py-0.5 bg-gold/10 text-gold/70 rounded-sm font-sans"
                              >
                                {el}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gold/10">
                            <div className="flex items-center gap-1 text-sm text-gold-muted">
                              <Eye size={14} />
                              <span className="text-parchment/50 group-hover:text-gold transition-colors">点击查看详情</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gold-muted">
                              <Heart size={14} className="fill-gold/30 text-gold/50" />
                              <span>{formatNumber(banknote.favoriteCount)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="absolute inset-0 pointer-events-none border-2 border-gold/0 group-hover:border-gold/50 transition-all duration-500 rounded-sm" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showDetail && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-background/95 backdrop-blur-md animate-fade-in"
            onClick={() => setShowDetail(null)}
          >
            <div
              className="relative w-full max-w-5xl h-[90vh] max-h-[800px] flex flex-col bg-background-light border border-gold/30 rounded-sm shadow-gold-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-gold/20 flex-shrink-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5">
                <div className="flex items-center gap-3">
                  <span className={cn('text-xs font-display tracking-wider px-2 py-1 rounded-sm bg-gold/10', getRarityColor(showDetail.rarity))}>
                    {getRarityLabel(showDetail.rarity)}
                  </span>
                  <h2 className="font-display text-xl md:text-2xl text-parchment">
                    {showDetail.country} · {showDetail.denomination} {showDetail.currency}
                  </h2>
                </div>
                <button
                  onClick={() => setShowDetail(null)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-parchment/70 hover:text-gold hover:bg-gold/10 transition-all duration-300 flex-shrink-0 border border-gold/20 hover:border-gold/50"
                  title="关闭"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overflow-x-hidden">
                <div className="grid md:grid-cols-2 gap-0 h-full">
                  <div className="p-6 md:p-8 bg-gradient-to-br from-gold/5 via-background to-copper/5 border-b md:border-b-0 md:border-r border-gold/10">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm text-gold-muted font-display tracking-wider mb-3 flex items-center gap-2">
                          <Eye size={14} />
                          正面图案
                        </h4>
                        <div className="aspect-[16/9] rounded-sm overflow-hidden border border-gold/20 shadow-gold-lg group">
                          <img
                            src={showDetail.obverseImage}
                            alt="正面"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm text-gold-muted font-display tracking-wider mb-3 flex items-center gap-2">
                          <Eye size={14} />
                          背面图案
                        </h4>
                        <div className="aspect-[16/9] rounded-sm overflow-hidden border border-gold/20 shadow-gold-lg group">
                          <img
                            src={showDetail.reverseImage}
                            alt="背面"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-sm bg-background/50 border border-gold/10">
                          <h5 className="text-xs text-gold-muted mb-1 font-display tracking-wider">发行年份</h5>
                          <p className="font-display text-xl text-parchment">{showDetail.year}年</p>
                        </div>
                        <div className="p-4 rounded-sm bg-background/50 border border-gold/10">
                          <h5 className="text-xs text-gold-muted mb-1 font-display tracking-wider">材质</h5>
                          <p className="font-display text-xl text-parchment">{showDetail.material}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-sm text-gold-muted font-display tracking-wider mb-2">正面设计</h4>
                        <p className="text-parchment/90 leading-relaxed">{showDetail.obverseDesign}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gold-muted font-display tracking-wider mb-2">背面设计</h4>
                        <p className="text-parchment/90 leading-relaxed">{showDetail.reverseDesign}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gold-muted font-display tracking-wider mb-2 flex items-center gap-2">
                          <Sparkles size={14} />
                          设计元素
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {showDetail.designElements.map((el) => (
                            <span key={el} className="px-3 py-1.5 bg-gold/10 text-gold text-sm rounded-sm border border-gold/20 hover:border-gold/50 transition-colors">
                              {el}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm text-gold-muted font-display tracking-wider mb-2 flex items-center gap-2">
                          <Shield size={14} />
                          防伪技术
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {showDetail.securityFeatures.map((sf) => (
                            <span key={sf} className="px-3 py-1.5 bg-emerald-900/20 text-emerald-400 text-sm rounded-sm border border-emerald-500/20 flex items-center gap-1 hover:border-emerald-500/40 transition-colors">
                              <Shield size={12} />
                              {sf}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gold/10">
                        <h4 className="text-sm text-gold-muted font-display tracking-wider mb-2">历史背景</h4>
                        <p className="text-parchment/80 leading-relaxed drop-cap">
                          {showDetail.history}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gold/20 flex items-center justify-between gap-4 flex-shrink-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5">
                <div className="flex items-center gap-2 text-sm text-gold-muted">
                  <Heart size={14} className="fill-gold/30 text-gold/50" />
                  <span>已有 <span className="text-gold font-display">{formatNumber(showDetail.favoriteCount)}</span> 人收藏</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={(e) => handleFavoriteClick(e, showDetail)}
                    className={cn(
                      'px-5 h-11 rounded-sm border flex items-center justify-center gap-2 transition-all duration-300 font-display tracking-wider text-sm',
                      isFavorite(showDetail.id)
                        ? 'bg-gold text-background border-gold hover:bg-gold-light'
                        : 'border-gold/30 text-parchment/70 hover:border-gold hover:text-gold hover:bg-gold/5'
                    )}
                  >
                    <Heart size={18} className={cn(isFavorite(showDetail.id) && 'fill-current')} />
                    {isFavorite(showDetail.id) ? '已收藏' : '收藏'}
                  </button>
                  <Link
                    to={`/banknote/${showDetail.id}`}
                    onClick={() => setShowDetail(null)}
                    className="btn-gold-solid flex items-center justify-center gap-2 h-11 px-6"
                  >
                    查看完整详情
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
