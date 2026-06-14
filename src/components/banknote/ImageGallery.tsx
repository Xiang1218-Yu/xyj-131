import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Maximize2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ImageGalleryProps {
  obverseImage: string;
  reverseImage: string;
  country: string;
  denomination: string;
  currency: string;
}

export default function ImageGallery({
  obverseImage,
  reverseImage,
  country,
  denomination,
  currency,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([false, false]);

  const images = [
    { src: obverseImage, label: '正面' },
    { src: reverseImage, label: '反面' },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  return (
    <div className="relative">
      <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-background-lighter">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              'absolute inset-0 transition-all duration-500',
              currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            {!loadedImages[index] && (
              <div className="absolute inset-0 bg-background-lighter animate-pulse" />
            )}
            <img
              src={image.src}
              alt={`${country} ${denomination} ${currency} ${image.label}`}
              className={cn(
                'w-full h-full object-contain transition-all duration-500',
                isZoomed && 'scale-150 cursor-zoom-out',
                loadedImages[index] ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => handleImageLoad(index)}
              onClick={() => setIsZoomed(!isZoomed)}
            />
          </div>
        ))}

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/60 backdrop-blur-sm border border-gold/30 flex items-center justify-center text-parchment hover:bg-gold hover:text-background transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-background/60 backdrop-blur-sm border border-gold/30 flex items-center justify-center text-parchment hover:bg-gold hover:text-background transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>

        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-background/60 backdrop-blur-sm border border-gold/30 flex items-center justify-center text-parchment hover:bg-gold hover:text-background transition-all duration-300"
        >
          {isZoomed ? <Maximize2 size={18} /> : <ZoomIn size={18} />}
        </button>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/80 to-transparent p-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'px-4 py-2 rounded-sm font-display text-sm tracking-wider transition-all duration-300',
                    currentIndex === index
                      ? 'bg-gold text-background'
                      : 'bg-background/60 text-parchment/70 border border-gold/30 hover:border-gold'
                  )}
                >
                  {image.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gold-muted text-sm">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
