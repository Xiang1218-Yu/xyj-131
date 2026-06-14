import { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTagInfo } from '@/data/banknotes';
import { cn, formatNumber } from '@/utils/cn';
import type { TagInfo } from '@/data/banknotes';

interface TagWithTooltipProps {
  tagName: string;
  className?: string;
  prefix?: string;
  onClick?: (e: React.MouseEvent, tagName: string) => void;
  active?: boolean;
}

export default function TagWithTooltip({ tagName, className, prefix = '#', onClick, active }: TagWithTooltipProps) {
  const [visible, setVisible] = useState(false);
  const [tagInfo, setTagInfo] = useState<TagInfo | undefined>(undefined);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const tagRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseEnter = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      const info = getTagInfo(tagName);
      setTagInfo(info);
      if (tagRef.current) {
        const rect = tagRef.current.getBoundingClientRect();
        const spaceAbove = rect.top;
        setPosition(spaceAbove < 120 ? 'bottom' : 'top');
      }
      setVisible(true);
    }, 300);
  }, [tagName]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  const content = (
    <span
      ref={tagRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick ? (e) => onClick(e, tagName) : undefined}
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1.5 bg-background-light text-gold-muted rounded-sm font-sans text-xs border border-gold/10 hover:border-gold/50 hover:bg-gold/10 hover:text-gold transition-all cursor-pointer',
        active && 'bg-gold text-background border-gold hover:bg-gold-light',
        className
      )}
    >
      {prefix}{tagName}
    </span>
  );

  return (
    <span className="relative inline-flex">
      {onClick ? content : <Link to={`/banknotes?tag=${encodeURIComponent(tagName)}`}>{content}</Link>}

      {visible && tagInfo && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={cn(
            'absolute z-50 left-1/2 -translate-x-1/2 w-56 p-4 bg-background-lighter/95 backdrop-blur-md border border-gold/30 rounded-sm shadow-gold-xl animate-fade-in',
            position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          )}
        >
          <div className="absolute w-3 h-3 bg-background-lighter/95 border-gold/30 rotate-45 -translate-x-1/2 left-1/2"
            style={{
              [position === 'top' ? 'bottom' : 'top']: '-7px',
              borderLeft: position === 'top' ? '1px solid rgba(201,169,98,0.3)' : 'none',
              borderRight: position === 'bottom' ? '1px solid rgba(201,169,98,0.3)' : 'none',
              borderBottom: position === 'top' ? '1px solid rgba(201,169,98,0.3)' : 'none',
              borderTop: position === 'bottom' ? '1px solid rgba(201,169,98,0.3)' : 'none',
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
        </div>
      )}
    </span>
  );
}
