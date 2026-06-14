import { useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, DollarSign, Ruler, Palette, Shield, ArrowLeft, Share2, Tag, Globe, Tags } from 'lucide-react';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useShare } from '@/hooks/useShare';
import ImageGallery from '@/components/banknote/ImageGallery';
import BanknoteGrid from '@/components/banknote/BanknoteGrid';
import NotePanel from '@/components/banknote/NotePanel';
import StarRating from '@/components/common/StarRating';
import EmptyState from '@/components/common/EmptyState';
import ShareModal from '@/components/common/ShareModal';
import TagWithTooltip from '@/components/common/TagWithTooltip';
import { formatNumber, getRarityLabel, getRarityColor, cn } from '@/utils/cn';
import { countries } from '@/data/countries';
import { getRelatedTags } from '@/data/banknotes';

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
                {banknote.tags.map((t) => (
                  <TagWithTooltip key={t} tagName={t} />
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

        <RelatedTagsSection banknote={banknote} />

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

import type { Banknote } from '@/types';
import { getTagCategory } from '@/data/banknotes';
import type { TagCategory } from '@/data/banknotes';

const categoryColorMap: Record<TagCategory, string> = {
  '货币类型': 'border-gold/30 bg-gold/10 text-gold',
  '版别系列': 'border-copper/30 bg-copper/10 text-copper-light',
  '特殊属性': 'border-burgundy/30 bg-burgundy/10 text-burgundy-light',
  '设计主题': 'border-navy/30 bg-navy/10 text-navy-light',
  '地域': 'border-emerald-600/30 bg-emerald-900/20 text-emerald-400',
};

function RelatedTagsSection({ banknote }: { banknote: Banknote }) {
  const allRelatedTags = useMemo(() => {
    const tags: (ReturnType<typeof getRelatedTags>[number] & { coOccurrence: number })[] = [];
    const seen = new Set<string>();
    banknote.tags.forEach(tag => {
      getRelatedTags(tag, 6).forEach(related => {
        if (!seen.has(related.name) && !banknote.tags.includes(related.name)) {
          seen.add(related.name);
          tags.push(related);
        }
      });
    });
    return tags.slice(0, 12);
  }, [banknote.tags]);

  if (allRelatedTags.length === 0) return null;

  return (
    <div className="mb-20">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Tags size={20} className="text-gold" />
          <span className="text-gold font-display tracking-widest text-sm">RELATED TAGS</span>
        </div>
        <h2 className="section-title">相关标签</h2>
        <div className="gold-divider mb-4" />
        <p className="section-subtitle">
          与本纸币标签关联的其他热门标签
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allRelatedTags.map(tag => {
          const category = getTagCategory(tag.name);
          const colorClass = categoryColorMap[category];
          return (
            <Link
              key={tag.name}
              to={`/banknotes?tag=${encodeURIComponent(tag.name)}`}
              className={cn(
                'group flex items-center justify-between p-4 rounded-sm border transition-all duration-300',
                colorClass,
                'hover:-translate-y-1 hover:shadow-gold'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-background/40 flex items-center justify-center text-lg font-display group-hover:scale-110 transition-transform">
                  {tag.name.charAt(0)}
                </div>
                <div>
                  <div className="font-display text-sm text-parchment group-hover:text-gold transition-colors">
                    #{tag.name}
                  </div>
                  <div className="text-xs opacity-70">{category} · 共现 {tag.coOccurrence} 次</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg gold-gradient-text">{tag.count}</div>
                <div className="text-[10px] opacity-60">张纸币</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
