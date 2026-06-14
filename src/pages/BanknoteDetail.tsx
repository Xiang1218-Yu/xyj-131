import { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, DollarSign, Ruler, Palette, Shield, ArrowLeft, Share2, Tag, Globe } from 'lucide-react';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useShare } from '@/hooks/useShare';
import ImageGallery from '@/components/banknote/ImageGallery';
import BanknoteGrid from '@/components/banknote/BanknoteGrid';
import NotePanel from '@/components/banknote/NotePanel';
import StarRating from '@/components/common/StarRating';
import EmptyState from '@/components/common/EmptyState';
import ShareModal from '@/components/common/ShareModal';
import { formatNumber, getRarityLabel, getRarityColor, cn } from '@/utils/cn';
import { countries } from '@/data/countries';

export default function BanknoteDetail() {
  const { id } = useParams<{ id: string }>();
  const { getBanknoteById, getRelatedBanknotes } = useBanknoteStore();
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();

  const banknote = useMemo(() => (id ? getBanknoteById(id) : undefined), [id, getBanknoteById]);
  const relatedBanknotes = useMemo(() => (id ? getRelatedBanknotes(id, 4) : []), [id, getRelatedBanknotes]);
  const favorite = banknote ? isFavorite(banknote.id) : false;
  const countryInfo = banknote ? countries.find(c => c.code === banknote.countryCode) : undefined;

  const share = useShare({
    title: banknote ? `${banknote.country} ${banknote.denomination} ${banknote.currency} - 世界纸币收藏馆` : '世界纸币收藏馆',
    text: banknote ? `${banknote.year}年发行，${banknote.obverseDesign}` : '',
    url: typeof window !== 'undefined' ? window.location.href : '',
    images: banknote ? [banknote.obverseImage, banknote.reverseImage] : [],
  });
  const { setContent: setShareContent } = share;

  useEffect(() => {
    if (banknote) {
      setShareContent({
        title: `${banknote.country} ${banknote.denomination} ${banknote.currency} - 世界纸币收藏馆`,
        text: `${banknote.year}年发行，${banknote.obverseDesign}`,
        url: typeof window !== 'undefined' ? window.location.href : '',
        images: [banknote.obverseImage, banknote.reverseImage],
      });
    }
  }, [banknote, setShareContent]);

  if (!banknote) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4">
          <EmptyState
            title="纸币不存在"
            description="您访问的纸币可能已被移除或ID不正确"
            action={
              <Link to="/banknotes" className="btn-gold-solid">
                返回列表
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(banknote.id);
    } else {
      addFavorite(banknote.id);
    }
  };

  const infoItems = [
    { icon: Globe, label: '发行国家', value: banknote.country, subValue: countryInfo?.continent },
    { icon: Calendar, label: '发行年份', value: `${banknote.year}年` },
    { icon: DollarSign, label: '面值', value: `${banknote.denomination} ${banknote.currency}` },
    { icon: Ruler, label: '尺寸', value: banknote.dimensions },
    { icon: Palette, label: '主色调', value: banknote.mainColor },
    { icon: MapPin, label: '材质', value: banknote.material },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Link
          to="/banknotes"
          className="inline-flex items-center gap-2 text-gold-muted hover:text-gold transition-colors mb-8 group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-display tracking-wider">返回列表</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div className="animate-fade-in-left">
            <ImageGallery
              obverseImage={banknote.obverseImage}
              reverseImage={banknote.reverseImage}
              country={banknote.country}
              denomination={banknote.denomination}
              currency={banknote.currency}
              banknoteTitle={`${banknote.country} ${banknote.denomination}${banknote.currency} (${banknote.year}年)`}
            />
          </div>

          <div className="animate-fade-in-right">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{countryInfo?.flag}</span>
                  <div>
                    <p className="text-gold-muted font-display tracking-widest text-sm">
                      {countryInfo?.continent}
                    </p>
                    <h1 className="font-display text-4xl text-parchment">
                      {banknote.country}
                    </h1>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-display text-5xl gold-gradient-text">
                    {banknote.denomination}
                    <span className="text-2xl text-gold-muted ml-2">{banknote.currency}</span>
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleFavoriteClick}
                  className={cn(
                    'w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                    favorite
                      ? 'bg-gold border-gold text-background animate-bounce'
                      : 'border-gold/30 text-gold hover:border-gold hover:bg-gold/10'
                  )}
                  aria-label={favorite ? '取消收藏' : '收藏'}
                >
                  <Heart size={24} className={cn(favorite && 'fill-current')} />
                </button>
                <button
                  onClick={share.open}
                  className="w-14 h-14 rounded-full border-2 border-gold/30 flex items-center justify-center text-gold hover:border-gold hover:bg-gold/10 transition-all duration-300"
                  aria-label="分享"
                >
                  <Share2 size={24} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8 p-4 bg-background-light/50 rounded-sm border border-gold/10">
              <div className="flex items-center gap-2">
                <span className="text-gold-muted text-sm">稀有度:</span>
                <StarRating rating={banknote.rarity} size={18} />
                <span className={cn('font-display tracking-wider', getRarityColor(banknote.rarity))}>
                  {getRarityLabel(banknote.rarity)}
                </span>
              </div>
              <div className="h-6 w-px bg-gold/20" />
              <div className="flex items-center gap-2">
                <Heart size={16} className="fill-gold/30 text-gold" />
                <span className="text-parchment">{formatNumber(banknote.favoriteCount)} 人收藏</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {infoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="p-4 bg-background-light/30 rounded-sm border border-gold/10 hover:border-gold/30 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon size={16} className="text-gold" />
                      <span className="text-sm text-gold-muted font-display tracking-wider">
                        {item.label}
                      </span>
                    </div>
                    <p className="font-display text-xl text-parchment">{item.value}</p>
                    {item.subValue && (
                      <p className="text-sm text-gold-muted">{item.subValue}</p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mb-8">
              <h3 className="font-display text-xl text-parchment mb-4 flex items-center gap-2">
                <Shield size={20} className="text-gold" />
                防伪特征
              </h3>
              <div className="flex flex-wrap gap-2">
                {banknote.securityFeatures.map((feature, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gold/10 text-gold rounded-sm font-body text-sm border border-gold/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-display text-xl text-parchment mb-4 flex items-center gap-2">
                <Tag size={20} className="text-gold" />
                标签
              </h3>
              <div className="flex flex-wrap gap-2">
                {banknote.tags.map((t, index) => (
                  <Link
                    key={index}
                    to={`/banknotes?tag=${encodeURIComponent(t)}`}
                    className="px-3 py-1.5 bg-background-light text-gold-muted rounded-sm font-sans text-xs border border-gold/10 hover:border-gold/50 hover:bg-gold/10 hover:text-gold transition-all"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="p-8 bg-background-light/30 rounded-sm border border-gold/10">
            <h3 className="font-display text-2xl text-parchment mb-6">正面图案</h3>
            <p className="font-body text-lg text-gold-muted leading-relaxed">
              {banknote.obverseDesign}
            </p>
          </div>
          <div className="p-8 bg-background-light/30 rounded-sm border border-gold/10">
            <h3 className="font-display text-2xl text-parchment mb-6">背面图案</h3>
            <p className="font-body text-lg text-gold-muted leading-relaxed">
              {banknote.reverseDesign}
            </p>
          </div>
        </div>

        <div className="mb-20">
          <div className="relative overflow-hidden rounded-sm border border-gold/20 bg-gradient-to-br from-parchment/5 via-background to-parchment/5 p-8 md:p-12">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px]" />
            
            <h2 className="font-display text-3xl md:text-4xl text-parchment mb-6 flex items-center gap-3">
              <span className="ornament text-3xl">❧</span>
              历史背景
              <span className="ornament text-3xl">❧</span>
            </h2>
            
            <div className="prose prose-invert max-w-none">
              <p className="font-body text-xl text-gold-muted leading-relaxed drop-cap">
                {banknote.history}
              </p>
            </div>
          </div>
        </div>

        <NotePanel
          banknoteId={banknote.id}
          banknoteTitle={`${banknote.country} ${banknote.denomination}${banknote.currency}`}
        />

        {relatedBanknotes.length > 0 && (
          <div>
            <div className="text-center mb-12">
              <h2 className="section-title">相关纸币</h2>
              <div className="gold-divider mb-4" />
              <p className="section-subtitle">
                来自同一国家或同一年份的其他精美纸币
              </p>
            </div>
            <BanknoteGrid banknotes={relatedBanknotes} showAction={false} />
          </div>
        )}
      </div>

      {banknote && (
        <ShareModal
          isOpen={share.isOpen}
          onClose={share.close}
          content={share.content}
          onCopyLink={share.copyLink}
          onShareNative={share.shareNative}
          onSaveImage={share.saveImage}
          copied={share.copied}
          canShareNative={share.canShareNative}
          title="分享纸币"
          description={`${banknote.country} ${banknote.denomination} ${banknote.currency}`}
          showSaveImage={true}
        />
      )}
    </div>
  );
}
