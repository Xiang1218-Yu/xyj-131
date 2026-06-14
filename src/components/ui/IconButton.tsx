import * as React from 'react';
import { cn } from '@/utils/cn';
import { type LucideIcon } from 'lucide-react';

export type IconButtonVariant = 'default' | 'solid' | 'ghost' | 'soft' | 'danger';
export type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: LucideIcon;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  shape?: 'circle' | 'square';
  active?: boolean;
  label?: string;
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      icon: Icon,
      variant = 'default',
      size = 'md',
      shape = 'circle',
      active = false,
      label,
      ...props
    },
    ref
  ) => {
    const variants: Record<IconButtonVariant, string> = {
      default:
        'border border-gold/30 text-gold-muted hover:text-gold hover:border-gold/50 bg-background/60 backdrop-blur-sm',
      solid:
        'bg-gold text-background hover:bg-gold-light border border-gold shadow-gold',
      ghost:
        'text-gold-muted hover:text-gold hover:bg-gold/10 border-none bg-transparent',
      soft:
        'bg-gold/20 text-gold border border-gold/40 hover:bg-gold/30',
      danger:
        'border border-red-500/30 text-red-400 hover:text-red-300 hover:border-red-500/50 bg-background/60 backdrop-blur-sm',
    };

    const sizes: Record<IconButtonSize, { container: string; icon: number }> = {
      xs: { container: 'h-7 w-7', icon: 12 },
      sm: { container: 'h-8 w-8', icon: 14 },
      md: { container: 'h-10 w-10', icon: 16 },
      lg: { container: 'h-12 w-12', icon: 18 },
      xl: { container: 'h-14 w-14', icon: 24 },
    };

    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-sm',
    };

    return (
      <button
        ref={ref}
        aria-label={label}
        title={label}
        className={cn(
          'inline-flex items-center justify-center',
          'transition-all duration-300 focus:outline-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'shrink-0',
          variants[variant],
          sizes[size].container,
          shapes[shape],
          active && variant === 'default' && 'bg-gold/20 text-gold border-gold/40',
          active && variant === 'solid' && 'shadow-gold-lg scale-105',
          className
        )}
        {...props}
      >
        <Icon size={sizes[size].icon} className="shrink-0" />
      </button>
    );
  }
);
IconButton.displayName = 'IconButton';

export { IconButton };
