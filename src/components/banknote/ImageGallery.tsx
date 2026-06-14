import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  RotateCw,
  RotateCcw,
  Maximize2,
  Download,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import ImageViewerModal, { type ImageItem } from '@/components/common/ImageViewerModal';

interface ImageGalleryProps {
  obverseImage: string;
  reverseImage: string;
  country: string;
  denomination: string;
  currency: string;
  banknoteTitle?: string;
}

export default function ImageGallery({
  obverseImage,
  reverseImage,
  country,
  denomination,
  currency,
  banknoteTitle,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([false, false]);

  const images: ImageItem[] = [
    { src: obverseImage, label: '正面' },
    { src: reverseImage, label: '反面' },
  ];

  const makeAlt = (index: number) =>
    `${country} ${denomination} ${currency} ${images[index].label}`;

  const title = banknoteTitle || `${country} ${denomination}${currency}`;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setRotation(0);
    setScale(1);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setRotation(0);
    setScale(1);
  };

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  const handleThumbClick = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      setRotation(0);
      setScale(1);
    }
  };

  const handleRotateCw = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((r) => r + 90);
  };

  const handleRotateCcw = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRotation((r) => r - 90);
  };

  const handleZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setScale((s) => (s === 1 ? 1.5 : 1));
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const img = currentImage();
      const response = await fetch(img.src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}_${img.label}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(currentImage().src, '_blank');
    }
  };

  const currentImage = () => images[currentIndex];

  return (
    <div className="relative">
      <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-background-lighter group">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              'absolute inset-0 transition-all duration-500',
              currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            )}
          >
            {!loadedImages[index] && (
              <div className="absolute inset-0 bg-background-lighter animate-pulse flex items-center justify-center">
                <div className="w-10 h-10 border-3 border-gold/30 border-t-gold rounded-full animate-spin" />
              </div>
            )}
            <img
              src={image.src}
              alt={makeAlt(index)}
              className={cn(
                'w-full h-full object-contain transition-all duration-300 cursor-pointer',
                loadedImages[index] ? 'opacity-100' : 'opacity-0'
              )}
              style={{
                transform:
                  currentIndex === index
                    ? `scale(${scale}) rotate(${rotation}deg)`
                    : undefined,
                transitionTimingFunction: currentIndex === index ? 'cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
              }}
              onLoad={() => handleImageLoad(index)}
              onClick={() => setViewerOpen(true)}
            />
          </div>
        ))}

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-background/60 backdrop-blur-sm border border-gold/30 flex items-center justify-center text-parchment hover:bg-gold hover:text-background transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="上一张"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-background/60 backdrop-blur-sm border border-gold/30 flex items-center justify-center text-parchment hover:bg-gold hover:text-background transition-all duration-300 opacity-0 group-hover:opacity-100"
          aria-label="下一张"
        >
          <ChevronRight size={22} />
        </button>

        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ToolButton onClick={handleRotateCcw} title="逆时针旋转">
            <RotateCcw size={16} />
          </ToolButton>
          <ToolButton onClick={handleRotateCw} title="顺时针旋转">
            <RotateCw size={16} />
          </ToolButton>
          <ToolButton onClick={handleZoom} title={scale > 1 ? '重置缩放' : '放大查看'}>
            <ZoomIn size={16} />
          </ToolButton>
          <ToolButton onClick={handleDownload} title="下载图片">
            <Download size={16} />
          </ToolButton>
          <ToolButton onClick={() => setViewerOpen(true)} title="全屏查看">
            <Maximize2 size={16} />
          </ToolButton>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background via-background/80 to-transparent p-5">
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
              <span className="text-gold-muted text-sm font-display tracking-wider">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleThumbClick(index)}
            className={cn(
              'relative flex-1 aspect-[16/9] rounded-sm overflow-hidden border-2 transition-all duration-300',
              currentIndex === index
                ? 'border-gold shadow-gold scale-[1.02]'
                : 'border-gold/15 hover:border-gold/40 opacity-70 hover:opacity-100'
            )}
          >
            <img
              src={image.src}
              alt={`${makeAlt(index)} 缩略图`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className={cn(
                'absolute bottom-2 left-2 px-2.5 py-1 rounded-sm font-display text-xs tracking-wider transition-all',
                currentIndex === index
                  ? 'bg-gold text-background'
                  : 'bg-background/80 text-parchment/80'
              )}
            >
              {image.label}
            </div>
          </button>
        ))}
      </div>

      <ImageViewerModal
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={images}
        initialIndex={currentIndex}
        title={title}
      />
    </div>
  );
}

function ToolButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 rounded-full bg-background/60 backdrop-blur-sm border border-gold/30 flex items-center justify-center text-parchment hover:bg-gold hover:text-background transition-all duration-300"
    >
      {children}
    </button>
  );
}
