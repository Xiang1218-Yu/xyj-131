import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Move,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export interface ImageItem {
  src: string;
  label: string;
}

interface ImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: ImageItem[];
  initialIndex?: number;
  title?: string;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const SCALE_STEP = 0.25;

export default function ImageViewerModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  title,
}: ImageViewerModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const resetTransform = useCallback(() => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (images.length === 0) return;
      let next = index;
      if (next < 0) next = images.length - 1;
      if (next >= images.length) next = 0;
      setCurrentIndex(next);
      resetTransform();
      setLoaded(false);
    },
    [images.length, resetTransform]
  );

  const handlePrev = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  const handleNext = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  const handleZoomIn = useCallback(() => {
    setScale((s) => Math.min(s + SCALE_STEP, MAX_SCALE));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((s) => {
      const newScale = Math.max(s - SCALE_STEP, MIN_SCALE);
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  const handleRotateCw = useCallback(() => {
    setRotation((r) => r + 90);
  }, []);

  const handleRotateCcw = useCallback(() => {
    setRotation((r) => r - 90);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -SCALE_STEP : SCALE_STEP;
    setScale((s) => {
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, s + delta));
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      }
      return newScale;
    });
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (scale <= 1) return;
      e.preventDefault();
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    },
    [scale, position]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDoubleClick = useCallback(() => {
    setScale((s) => {
      if (s > 1) {
        setPosition({ x: 0, y: 0 });
        return 1;
      }
      return 2;
    });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement && containerRef.current) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.fullscreenElement) {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen not supported
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      switch (e.key) {
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          onClose();
          break;
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
        case '_':
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          handleRotateCw();
          break;
        case '0':
          resetTransform();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext, handleZoomIn, handleZoomOut, handleRotateCw, resetTransform, toggleFullscreen]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isOpen) {
      goTo(initialIndex);
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen, initialIndex, goTo]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col animate-fade-in"
    >
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-20">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-lg md:text-xl text-parchment tracking-wider">
            {title || '图片查看器'}
          </h2>
          {images.length > 1 && (
            <span className="px-3 py-1 rounded-sm bg-gold/15 text-gold font-display text-sm tracking-wider">
              {currentIndex + 1} / {images.length}
            </span>
          )}
          {images.length > 1 && (
            <span className="px-3 py-1 rounded-sm bg-gold/10 text-gold-muted font-body text-sm">
              {currentImage.label}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-parchment/80 hover:text-parchment transition-all border border-white/10"
          aria-label="关闭"
        >
          <X size={20} />
        </button>
      </div>

      <div
        ref={imageContainerRef}
        className={cn(
          'flex-1 flex items-center justify-center relative overflow-hidden select-none',
          isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-zoom-in'
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
          </div>
        )}
        <img
          key={currentImage.src}
          src={currentImage.src}
          alt={currentImage.label}
          className={cn(
            'max-w-[90vw] max-h-[80vh] object-contain transition-opacity duration-300',
            loaded ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-out, opacity 0.3s ease-out',
          }}
          draggable={false}
          onLoad={() => setLoaded(true)}
        />

        {scale > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-gold/20 text-sm text-parchment/80 font-display tracking-wider pointer-events-none flex items-center gap-2">
            <Move size={14} className="text-gold" />
            拖动查看细节 · 双击还原
          </div>
        )}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/40 flex items-center justify-center text-parchment/70 hover:text-gold transition-all"
            aria-label="上一张"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/40 flex items-center justify-center text-parchment/70 hover:text-gold transition-all"
            aria-label="下一张"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div className="px-6 py-5 bg-gradient-to-t from-black/80 to-transparent absolute bottom-0 left-0 right-0 z-20">
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10">
            <ToolbarButton onClick={handleZoomOut} title="缩小 (-)">
              <ZoomOut size={18} />
            </ToolbarButton>
            <span className="w-16 text-center text-sm text-parchment font-display tracking-wider">
              {Math.round(scale * 100)}%
            </span>
            <ToolbarButton onClick={handleZoomIn} title="放大 (+)">
              <ZoomIn size={18} />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10">
            <ToolbarButton onClick={handleRotateCcw} title="逆时针旋转">
              <RotateCcw size={18} />
            </ToolbarButton>
            <ToolbarButton onClick={handleRotateCw} title="顺时针旋转 (R)">
              <RotateCw size={18} />
            </ToolbarButton>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/5 border border-white/10">
            <ToolbarButton onClick={resetTransform} title="重置 (0)">
              <RefreshCw size={18} />
            </ToolbarButton>
            <ToolbarButton onClick={toggleFullscreen} title="全屏 (F)">
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </ToolbarButton>
          </div>
        </div>

        {images.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-5">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  currentIndex === index ? 'w-8 bg-gold' : 'w-1.5 bg-white/20 hover:bg-white/40'
                )}
                aria-label={`切换到第 ${index + 1} 张 - ${img.label}`}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-4 text-xs text-parchment/40 font-body tracking-wide">
          ← → 切换图片 · ± 缩放 · R 旋转 · F 全屏 · 0 重置 · ESC 关闭
        </div>
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 rounded-full flex items-center justify-center text-parchment/70 hover:text-gold hover:bg-gold/15 transition-all"
    >
      {children}
    </button>
  );
}
