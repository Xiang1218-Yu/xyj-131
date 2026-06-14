import * as React from 'react';
import { cn } from '@/utils/cn';
import { type LucideIcon } from 'lucide-react';

export type BadgeVariant =
  | 'default'
  | 'gold'
  | 'copper'
  | 'burgundy'
  | 'navy'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'amber'
  | 'rose'
  | 'muted';

export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  rounded?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gold/10 text-gold border-gold/20',
  gold: 'bg-gold/10 text-gold border-gold/20',
  copper: 'bg-copper/10 text-copper-light border-copper/30',
  burgundy: 'bg-burgundy/10 text-burgundy-light border-burgundy/30',
  navy: 'bg-navy/10 text-navy-light border-navy/30',
  green: 'bg-emerald-900/20 text-emerald-400 border-emerald-600/30',
  blue: 'bg-blue-900/20 text-blue-400 border-blue-600/30',
  purple: 'bg-purple-900/20 text-purple-400 border-purple-600/30',
  pink: 'bg-pink-900/20 text-pink-400 border-pink-600/30',
  amber: 'bg-amber-900/20 text-amber-400 border-amber-600/30',
  rose: 'bg-rose-900/20 text-rose-400 border-rose-600/30',
  muted: 'bg-background-lighter text-gold-muted border-gold/10',
};

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      className,
      variant = 'default',
      size = 'sm',
      icon: Icon,
      rounded = false,
      children,
      ...props
    },
    ref
  ) => {
    const sizes: Record<BadgeSize, string> = {
      xs: 'text-[10px] px-1.5 py-0.5 gap-0.5',
      sm: 'text-xs px-2 py-0.5 gap-1',
      md: 'text-sm px-3 py-1 gap-1.5',
      lg: 'text-base px-4 py-1.5 gap-2',
    };

    const iconSizes: Record<BadgeSize, number> = {
      xs: 10,
      sm: 12,
      md: 14,
      lg: 16,
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-sans border transition-all duration-300 shrink-0',
          rounded ? 'rounded-full' : 'rounded-sm',
          variantStyles[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {Icon && <Icon size={iconSizes[size]} className="shrink-0" />}
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  active?: boolean;
  prefix?: string;
  showPrefix?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  size?: 'xs' | 'sm' | 'md';
  removable?: boolean;
  onRemove?: () => void;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      className,
      active = false,
      prefix = '#',
      showPrefix = true,
      onClick,
      size = 'sm',
      removable = false,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    const sizes: Record<NonNullable<TagProps['size']>, string> = {
      xs: 'text-[10px] px-1.5 py-0.5',
      sm: 'text-xs px-2 py-0.5',
      md: 'text-sm px-3 py-1.5',
    };

    return (
      <span
        ref={ref}
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1 font-sans rounded-sm border transition-all shrink-0',
          active
            ? 'bg-gold text-background border-gold hover:bg-gold-light'
            : 'bg-background-light text-gold-muted border-gold/10 hover:border-gold/50 hover:bg-gold/10 hover:text-gold',
          onClick && 'cursor-pointer',
          sizes[size],
          className
        )}
        {...props}
      >
        {showPrefix && <span className="opacity-70">{prefix}</span>}
        {children}
        {removable && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-1 hover:opacity-100 opacity-60"
          >
            ×
          </button>
        )}
      </span>
    );
  }
);
Tag.displayName = 'Tag';

export { Badge, Tag };
