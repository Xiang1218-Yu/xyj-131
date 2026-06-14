import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, DollarSign } from 'lucide-react';
import type { Banknote, ViewMode } from '@/types';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useFilterStore } from '@/store/useFilterStore';
import StarRating from '@/components/common/StarRating';
import TagWithTooltip from '@/components/common/TagWithTooltip';
import { cn, formatNumber, getRarityLabel, getRarityColor } from '@/utils/cn';

interface BanknoteCardProps {
  banknote: Banknote;
  index?: number;
  viewMode?: ViewMode;
}

export default function BanknoteCard({ banknote, index = 0, viewMode = 'grid' }: BanknoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
  const { tag, setTag } = useFilterStore();
  const favorite = isFavorite(banknote.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(banknote.id);
    } else {
      addFavorite(banknote.id);
    }
  };

  const handleTagClick = (e: React.MouseEvent, tagName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setTag(tag === tagName ? '' : tagName);
  };

  const flagEmoji = banknote.countryCode === 'CN' ? '🇨🇳' : banknote.countryCode === 'US' ? '🇺🇸' : '🏳️';

  if (viewMode === 'compact') {
    return (
      <Link
        to={`/banknote/${banknote.id}`}
        className={cn(
          'group flex items-center gap-4 p-3 card-gold relative animate-stagger',
          'hover:border-gold/50 transition-all duration-200'
        )}
        style={{ animationDelay: `${index * 0.03}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-20 h-12 flex-shrink-0 overflow-hidden rounded-sm">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-background-lighter animate-pulse" />
          )}
          <img
            src={banknote.obverseImage}
            alt={`${banknote.country} ${banknote.denomination}`}
            className={cn(
              'w-full h-full object-cover transition-all duration-300',
              isHovered && 'scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{flagEmoji}</span>
            <h3 className="font-display text-sm text-parchment group-hover:text-gold transition-colors truncate">
              {banknote.country}
            </h3>
            <span className="font-display text-gold text-sm flex-shrink-0">
              {banknote.denomination} {banknote.currency}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gold-muted">
            <span>{banknote.year}年</span>
            <span>·</span>
            <span>{banknote.material}</span>
            <span>·</span>
            <StarRating rating={banknote.rarity} size={10} />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex flex-wrap gap-1 max-w-[140px] justify-end">
            {banknote.tags.slice(0, 2).map((t) => (
              <TagWithTooltip
                key={t}
                tagName={t}
                prefix=""
                onClick={handleTagClick}
                active={tag === t}
                className="text-[10px] px-1.5 py-0.5"
              />
            ))}
          </div>
          <button
            onClick={handleFavoriteClick}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200',
              'border border-gold/20',
              favorite
                ? 'bg-gold/20 text-gold border-gold/40'
                : 'bg-background text-gold-muted hover:text-gold hover:border-gold/40'
            )}
          >
            <Heart
              size={14}
              className={cn('transition-all', favorite && 'fill-current')}
            />
          </button>
        </div>
      </Link>
    );
  }

  if (viewMode === 'list') {
    return (
      <Link
        to={`/banknote/${banknote.id}`}
        className={cn(
          'group card-gold overflow-hidden relative flex animate-stagger',
          'hover:border-gold/50 transition-all duration-300'
        )}
        style={{ animationDelay: `${index * 0.04}s` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden w-[280px] flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-background-lighter animate-pulse" />
          )}
          <img
            src={banknote.obverseImage}
            alt={`${banknote.country} ${banknote.denomination} ${banknote.currency}`}
            className={cn(
              'w-full h-full object-cover transition-all duration-500',
              isHovered && 'scale-105',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent transition-opacity duration-300',
              isHovered ? 'opacity-60' : 'opacity-30'
            )}
          />

          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gold/90 text-background px-3 py-1 rounded-sm font-display text-sm tracking-wider">
              {banknote.denomination} {banknote.currency}
            </div>
          </div>

          <div className="absolute bottom-3 left-3 z-10">
            <div className="flex items-center gap-1.5">
              <span className="text-xl">{flagEmoji}</span>
              <StarRating rating={banknote.rarity} size={12} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display text-xl text-parchment group-hover:text-gold transition-colors leading-tight mb-1">
                {banknote.country}
              </h3>
              <p className={cn('text-xs font-display tracking-wider', getRarityColor(banknote.rarity))}>
                {getRarityLabel(banknote.rarity)}
              </p>
            </div>
            <button
              onClick={handleFavoriteClick}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10',
                'bg-background/60 backdrop-blur-sm border border-gold/30',
                favorite
                  ? 'text-gold bg-gold/20 border-gold/50'
                  : 'text-parchment/70 hover:text-gold hover:border-gold'
              )}
            >
              <Heart
                size={18}
                className={cn('transition-all duration-300', favorite && 'fill-current')}
              />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <div className="flex items-center gap-1.5 text-sm text-gold-muted">
              <Calendar size={14} />
              <span>{banknote.year}年</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gold-muted">
              <MapPin size={14} />
              <span>{banknote.material}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gold-muted">
              <DollarSign size={14} />
              <span>{banknote.mainColor}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gold-muted">
              <span className="text-xs">尺寸:</span>
              <span>{banknote.dimensions}</span>
            </div>
          </div>

          <p className="text-sm text-gold-muted/80 line-clamp-2 mb-4 flex-1">
            {banknote.obverseDesign}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-gold/10">
            <div className="flex flex-wrap gap-1.5">
              {banknote.tags.map((t) => (
                <TagWithTooltip
                  key={t}
                  tagName={t}
                  prefix=""
                  onClick={handleTagClick}
                  active={tag === t}
                  className="text-xs px-2 py-0.5"
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-sm text-gold-muted">
              <Heart size={14} className="fill-gold/30 text-gold/50" />
              <span>{formatNumber(banknote.favoriteCount)}</span>
            </div>
          </div>
        </div>

        <div
          className={cn(
            'absolute inset-0 border-2 border-gold pointer-events-none transition-all duration-300',
            isHovered ? 'opacity-100' : 'opacity-0'
          )}
        />
      </Link>
    );
  }

  return (
    <Link
      to={`/banknote/${banknote.id}`}
      className={cn(
        'group card-gold overflow-hidden relative',
        'animate-stagger'
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[16/9]">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-background-lighter animate-pulse" />
        )}
        <img
          src={banknote.obverseImage}
          alt={`${banknote.country} ${banknote.denomination} ${banknote.currency}`}
          className={cn(
            'w-full h-full object-cover transition-all duration-700',
            isHovered && 'scale-105',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent transition-opacity duration-300',
            isHovered ? 'opacity-80' : 'opacity-40'
          )}
        />

        <button
          onClick={handleFavoriteClick}
          className={cn(
            'absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10',
            'bg-background/60 backdrop-blur-sm border border-gold/30',
            favorite
              ? 'text-gold hover:bg-gold hover:text-background'
              : 'text-parchment/70 hover:text-gold hover:border-gold',
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          )}
        >
          <Heart
            size={18}
            className={cn('transition-all duration-300', favorite && 'fill-current')}
          />
        </button>

        <div className="absolute bottom-3 left-3 right-3 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl">{flagEmoji}</span>
              <StarRating rating={banknote.rarity} size={12} />
            </div>
            <span className={cn('text-xs font-display tracking-wider', getRarityColor(banknote.rarity))}>
              {getRarityLabel(banknote.rarity)}
            </span>
          </div>
        </div>

        <div className="absolute top-3 left-3 z-10">
          <div className="bg-gold/90 text-background px-3 py-1 rounded-sm font-display text-sm tracking-wider">
            {banknote.denomination} {banknote.currency}
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-display text-xl text-parchment group-hover:text-gold transition-colors leading-tight">
            {banknote.country}
          </h3>
          <div className="text-right">
            <p className="font-display text-2xl gold-gradient-text">
              {banknote.denomination}
            </p>
            <p className="text-xs text-gold-muted font-sans">{banknote.currency}</p>
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
          <div className="flex items-center gap-1.5 text-sm text-gold-muted">
            <DollarSign size={14} />
            <span>{banknote.mainColor}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gold/10">
          <div className="flex flex-wrap gap-1.5">
            {banknote.tags.slice(0, 2).map((t) => (
              <TagWithTooltip
                key={t}
                tagName={t}
                prefix=""
                onClick={handleTagClick}
                active={tag === t}
                className="text-xs px-2 py-0.5"
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-sm text-gold-muted">
            <Heart size={14} className="fill-gold/30 text-gold/50" />
            <span>{formatNumber(banknote.favoriteCount)}</span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'absolute inset-0 border-2 border-gold pointer-events-none transition-all duration-300',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      />
    </Link>
  );
}
