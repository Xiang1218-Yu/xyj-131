import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: number;
}

export default function StarRating({ rating, maxStars = 5, size = 16 }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            'transition-all duration-300',
            i < rating ? 'fill-gold text-gold' : 'fill-transparent text-gold/30'
          )}
        />
      ))}
    </div>
  );
}
