import * as React from 'react';
import { cn } from '@/utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'minimal';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  wrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      variant = 'default',
      leftIcon,
      rightIcon,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    const variants = {
      default:
        'bg-background border border-gold/20 text-parchment placeholder:text-gold-muted/50 focus:border-gold/50 focus:ring-1 focus:ring-gold/50',
      filled:
        'bg-background-light/50 border border-gold/20 text-parchment placeholder:text-gold-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/50',
      minimal:
        'bg-transparent border-b border-gold/20 text-parchment placeholder:text-gold-muted/50 focus:border-gold rounded-none px-0',
    };

    return (
      <div className={cn('relative w-full', wrapperClassName)}>
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gold-muted">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full px-4 py-3 font-body text-lg rounded-sm',
            'transition-all duration-300 focus:outline-none',
            variants[variant],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gold-muted">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled';
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default:
        'bg-background border border-gold/20 text-parchment placeholder:text-gold-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/50',
      filled:
        'bg-background-light/50 border border-gold/20 text-parchment placeholder:text-gold-muted/50 focus:border-gold focus:ring-1 focus:ring-gold/50',
    };

    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-3 font-body text-lg rounded-sm resize-y',
          'transition-all duration-300 focus:outline-none',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'default' | 'filled' | 'compact';
  size?: 'sm' | 'default' | 'lg';
  label?: string;
  wrapperClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, variant = 'default', size = 'default', label, wrapperClassName, children, ...props }, ref) => {
    const variants = {
      default:
        'bg-background border border-gold/20 text-parchment focus:outline-none focus:border-gold/50',
      filled:
        'bg-background-light/50 border border-gold/20 text-parchment focus:outline-none focus:border-gold/50',
      compact:
        'bg-background border border-gold/20 text-parchment focus:outline-none focus:border-gold/50 text-sm',
    };

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      default: 'px-4 py-2.5',
      lg: 'px-4 py-3 text-lg',
    };

    return (
      <div className={cn('w-full', wrapperClassName)}>
        {label && (
          <label className="block text-sm text-gold-muted mb-2 font-display tracking-wider">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full rounded-sm transition-all duration-300 cursor-pointer appearance-none',
            'bg-no-repeat bg-right pr-10',
            'focus:ring-1 focus:ring-gold/30',
            variants[variant],
            sizes[size],
            className
          )}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23c9a962' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
            backgroundSize: '16px',
            backgroundPosition: 'right 12px center',
          }}
          {...props}
        >
          {children}
        </select>
      </div>
    );
  }
);
Select.displayName = 'Select';

export type FieldLabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'block text-sm text-gold-muted font-display tracking-wider mb-2',
        className
      )}
      {...props}
    />
  )
);
FieldLabel.displayName = 'FieldLabel';

export { Input, Textarea, Select, FieldLabel };
