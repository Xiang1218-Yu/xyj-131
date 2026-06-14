import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Calendar, DollarSign } from 'lucide-react';
import type { Banknote } from '@/types';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import StarRating from '@/components/common/StarRating';
import { cn, formatNumber, getRarityLabel, getRarityColor } from '@/utils/cn';

interface BanknoteCardProps {
  banknote: Banknote;
  index?: number;
}

export default function BanknoteCard({ banknote, index = 0 }: BanknoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isFavorite, addFavorite, removeFavorite } = useFavoriteStore();
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
              <span className="text-2xl">{banknote.countryCode === 'CN' ? '🇨🇳' : banknote.countryCode === 'US' ? '🇺🇸' : '🏳️'}</span>
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
            {banknote.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 bg-gold/10 text-gold/70 rounded-sm font-sans"
              >
                {tag}
              </span>
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
