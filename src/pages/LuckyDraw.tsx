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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowDetail(null)}
          >
            <div
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-background-light border border-gold/30 rounded-sm shadow-gold-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowDetail(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-parchment/70 hover:text-gold hover:bg-gold/10 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                <div className="p-8 bg-gradient-to-br from-gold/5 via-background to-copper/5">
                  <div className="aspect-[16/9] rounded-sm overflow-hidden border border-gold/20 mb-4">
                    <img
                      src={showDetail.obverseImage}
                      alt="正面"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-[16/9] rounded-sm overflow-hidden border border-gold/20">
                    <img
                      src={showDetail.reverseImage}
                      alt="背面"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="p-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn('text-xs font-display tracking-wider px-2 py-1 rounded-sm bg-gold/10', getRarityColor(showDetail.rarity))}>
                      {getRarityLabel(showDetail.rarity)}
                    </span>
                    <span className="text-gold font-display tracking-wider text-sm">{showDetail.year}年发行</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl text-parchment mb-2">
                    {showDetail.country}
                  </h2>
                  <p className="gold-gradient-text font-display text-3xl mb-6">
                    {showDetail.denomination} {showDetail.currency}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <h4 className="text-sm text-gold-muted font-display tracking-wider mb-1">正面设计</h4>
                      <p className="text-parchment/90">{showDetail.obverseDesign}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gold-muted font-display tracking-wider mb-1">背面设计</h4>
                      <p className="text-parchment/90">{showDetail.reverseDesign}</p>
                    </div>
                    <div>
                      <h4 className="text-sm text-gold-muted font-display tracking-wider mb-1">设计元素</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {showDetail.designElements.map((el) => (
                          <span key={el} className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-sm border border-gold/20">
                            {el}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm text-gold-muted font-display tracking-wider mb-1">防伪技术</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {showDetail.securityFeatures.slice(0, 5).map((sf) => (
                          <span key={sf} className="px-3 py-1 bg-emerald-900/20 text-emerald-400 text-sm rounded-sm border border-emerald-500/20 flex items-center gap-1">
                            <Shield size={12} />
                            {sf}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-parchment/80 leading-relaxed mb-6 drop-cap">
                    {showDetail.history}
                  </p>

                  <div className="flex gap-3">
                    <Link
                      to={`/banknote/${showDetail.id}`}
                      className="btn-gold-solid flex-1 flex items-center justify-center gap-2"
                    >
                      查看完整详情
                      <ArrowRight size={18} />
                    </Link>
                    <button
                      onClick={(e) => handleFavoriteClick(e, showDetail)}
                      className={cn(
                        'w-12 h-12 rounded-sm border flex items-center justify-center transition-all duration-300',
                        isFavorite(showDetail.id)
                          ? 'bg-gold text-background border-gold'
                          : 'border-gold/30 text-parchment/70 hover:border-gold hover:text-gold'
                      )}
                    >
                      <Heart size={20} className={cn(isFavorite(showDetail.id) && 'fill-current')} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
