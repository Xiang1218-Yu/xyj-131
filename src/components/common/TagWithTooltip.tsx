import { useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { getTagInfo } from '@/data/banknotes';
import { cn, formatNumber } from '@/utils/cn';
import type { TagInfo } from '@/data/banknotes';

interface TagWithTooltipProps {
  tagName: string;
  className?: string;
  style?: React.CSSProperties;
  prefix?: string;
  onClick?: (e: React.MouseEvent, tagName: string) => void;
  active?: boolean;
  bare?: boolean;
  showPrefix?: boolean;
}

export default function TagWithTooltip({
  tagName,
  className,
  style,
  prefix = '#',
  onClick,
  active,
  bare = false,
  showPrefix = true,
}: TagWithTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [tagInfo, setTagInfo] = useState<TagInfo | undefined>(undefined);
  const [tooltipRect, setTooltipRect] = useState<{ top: number; left: number; position: 'top' | 'bottom'; width: number } | null>(null);
  const tagRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const TOOLTIP_WIDTH = 224;

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      const info = getTagInfo(tagName);
      setTagInfo(info);
      if (tagRef.current) {
        const rect = tagRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        const position = spaceAbove < 160 ? 'bottom' : 'top';
        let left = rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2;
        const maxLeft = window.innerWidth - TOOLTIP_WIDTH - 8;
        left = Math.max(8, Math.min(left, maxLeft));
        const top = position === 'top'
          ? rect.top - 10
          : rect.bottom + 10;
        setTooltipRect({ top, left, position, width: rect.width });
      }
      setVisible(true);
    }, 300);
  }, [tagName]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
    setTooltipRect(null);
  }, []);

  const content = (
    <span
      ref={tagRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick ? (e) => onClick(e, tagName) : undefined}
      style={style}
      className={cn(
        bare
          ? 'inline-block font-display transition-all duration-300 hover:scale-110 hover:opacity-100 cursor-pointer'
          : 'inline-flex items-center gap-1 px-3 py-1.5 bg-background-light text-gold-muted rounded-sm font-sans text-xs border border-gold/10 hover:border-gold/50 hover:bg-gold/10 hover:text-gold transition-all cursor-pointer',
        active && !bare && 'bg-gold text-background border-gold hover:bg-gold-light',
        className
      )}
    >
      {showPrefix && prefix}{tagName}
    </span>
  );

  const tooltipPortal = (
    <>
      {visible && tagInfo && tooltipRect && typeof document !== 'undefined' && createPortal(
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed z-[9999] w-56 p-4 bg-background-lighter/95 backdrop-blur-md border border-gold/30 rounded-sm shadow-gold-xl animate-fade-in"
          style={{
            top: tooltipRect.position === 'top' ? `${tooltipRect.top - 104}px` : `${tooltipRect.top + 8}px`,
            left: `${tooltipRect.left}px`,
          }}
        >
          <div
            className="absolute w-3 h-3 bg-background-lighter/95 border-gold/30 rotate-45 -translate-x-1/2"
            style={{
              left: tooltipRect.position === 'top' ? '50%' : '50%',
              top: tooltipRect.position === 'top' ? '100%' : '-6px',
              [tooltipRect.position === 'top' ? 'marginTop' : 'marginBottom']: tooltipRect.position === 'top' ? '-5px' : '0',
              borderLeft: tooltipRect.position === 'top' ? '1px solid rgba(201,169,98,0.3)' : 'none',
              borderRight: tooltipRect.position === 'bottom' ? '1px solid rgba(201,169,98,0.3)' : 'none',
              borderBottom: tooltipRect.position === 'top' ? '1px solid rgba(201,169,98,0.3)' : 'none',
              borderTop: tooltipRect.position === 'bottom' ? '1px solid rgba(201,169,98,0.3)' : 'none',
              borderLeftWidth: tooltipRect.position === 'bottom' ? '0' : undefined,
              borderRightWidth: tooltipRect.position === 'top' ? '0' : undefined,
              borderBottomWidth: tooltipRect.position === 'bottom' ? '0' : undefined,
              borderTopWidth: tooltipRect.position === 'top' ? '0' : undefined,
            }}
          />
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-sm text-parchment">#{tagInfo.name}</span>
              <span className="font-display text-lg gold-gradient-text">{tagInfo.count}</span>
            </div>
            <div className="text-xs text-gold-muted space-y-1">
              <div className="flex items-center justify-between">
                <span>关联纸币</span>
                <span className="text-parchment">{tagInfo.count} 张</span>
              </div>
              <div className="flex items-center justify-between">
                <span>收藏热度</span>
                <span className="text-parchment">{formatNumber(tagInfo.totalFavorites)}</span>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gold/10">
              <span className="text-[10px] text-gold-muted/70">点击查看该标签下的所有纸币</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );

  return (
    <>
      {onClick ? content : <Link to={`/banknotes?tag=${encodeURIComponent(tagName)}`}>{content}</Link>}
      {tooltipPortal}
    </>
  );
}
