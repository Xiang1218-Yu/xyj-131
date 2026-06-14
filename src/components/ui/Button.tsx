import * as React from 'react';
import { cn } from '@/utils/cn';
import { type LucideIcon } from 'lucide-react';

export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'solid'
  | 'ghost'
  | 'link'
  | 'soft';

export type ButtonSize = 'xs' | 'sm' | 'default' | 'lg' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      asChild = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      loading,
      children,
      disabled,
      onClick,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const variants: Record<ButtonVariant, string> = {
      default:
        'border border-gold text-gold hover:bg-gold hover:text-background focus:ring-2 focus:ring-gold/50',
      outline:
        'border border-gold/30 text-gold-muted hover:border-gold/50 hover:text-gold hover:bg-gold/5 focus:ring-2 focus:ring-gold/30',
      solid:
        'bg-gold text-background hover:bg-gold-light focus:ring-2 focus:ring-gold/50 shadow-gold hover:shadow-gold-lg',
      ghost:
        'text-gold-muted hover:text-gold hover:bg-gold/10 border-none',
      link:
        'text-gold underline-offset-4 hover:underline bg-transparent border-none p-0 h-auto',
      soft:
        'bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 hover:border-gold/50',
    };

    const sizes: Record<ButtonSize, string> = {
      xs: 'h-7 px-3 text-xs gap-1',
      sm: 'h-8 px-4 text-sm gap-1.5',
      default: 'h-10 px-6 text-sm gap-2',
      lg: 'h-14 px-8 text-lg gap-3',
      icon: 'h-10 w-10',
    };

    const baseClasses = cn(
      'inline-flex items-center justify-center font-display tracking-wider',
      'transition-all duration-300 focus:outline-none',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'rounded-sm select-none',
      variants[variant],
      sizes[size],
      className
    );

    const content = (
      <>
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!loading && LeftIcon && (
          <LeftIcon
            size={size === 'icon' ? 18 : size === 'lg' ? 20 : size === 'sm' || size === 'xs' ? 14 : 16}
            className="shrink-0"
          />
        )}
        {children}
        {RightIcon && (
          <RightIcon
            size={size === 'icon' ? 18 : size === 'lg' ? 20 : size === 'sm' || size === 'xs' ? 14 : 16}
            className="shrink-0"
          />
        )}
      </>
    );

    if (asChild && React.isValidElement(children)) {
      const child = children as React.ReactElement;
      return React.cloneElement(child, {
        className: cn(baseClasses, child.props.className),
        onClick: (e: React.MouseEvent) => {
          (onClick as React.MouseEventHandler)?.(e as React.MouseEvent<HTMLButtonElement>);
          child.props.onClick?.(e);
        },
        ...props,
        children: (
          <>
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            )}
            {!loading && LeftIcon && (
              <LeftIcon
                size={size === 'icon' ? 18 : size === 'lg' ? 20 : size === 'sm' || size === 'xs' ? 14 : 16}
                className="shrink-0"
              />
            )}
            {child.props.children}
            {RightIcon && (
              <RightIcon
                size={size === 'icon' ? 18 : size === 'lg' ? 20 : size === 'sm' || size === 'xs' ? 14 : 16}
                className="shrink-0"
              />
            )}
          </>
        ),
      } as React.Attributes);
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={baseClasses}
        onClick={onClick}
        {...props}
      >
        {content}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
