import * as React from 'react';
import { cn } from '@/utils/cn';
import { type LucideIcon } from 'lucide-react';

export interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  gradientColors?: string;
}

const Panel = React.forwardRef<HTMLDivElement, PanelProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'lg',
      gradientColors,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: 'bg-background-light/30 border border-gold/10',
      bordered: 'bg-transparent border border-gold/20',
      elevated: 'bg-background-light border border-gold/20 shadow-gold',
      gradient: gradientColors
        ? `bg-gradient-to-br ${gradientColors} border border-gold/20`
        : 'bg-gradient-to-br from-gold/5 via-background to-copper/5 border border-gold/20',
    };

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-8',
      xl: 'p-12 md:p-16',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-sm overflow-hidden transition-all duration-300',
          variants[variant],
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Panel.displayName = 'Panel';

export interface SectionTitleProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  eyebrowIcon?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  showDivider?: boolean;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  eyebrow,
  eyebrowIcon,
  align = 'center',
  showDivider = true,
  className,
  titleClassName,
  subtitleClassName,
}) => {
  const aligns = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={cn('flex flex-col mb-12 max-w-2xl', aligns[align], className)}>
      {(eyebrow || eyebrowIcon) && (
        <div className="flex items-center gap-2 mb-4">
          {eyebrowIcon}
          {eyebrow && (
            <span className="text-gold font-display tracking-widest text-sm">
              {eyebrow}
            </span>
          )}
        </div>
      )}
      <h2
        className={cn(
          'font-display text-4xl md:text-5xl text-parchment mb-4',
          align === 'center' && 'text-center',
          titleClassName
        )}
      >
        {title}
      </h2>
      {showDivider && (
        <div
          className={cn(
            'h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent mb-4',
            align === 'center' && 'mx-auto'
          )}
        />
      )}
      {subtitle && (
        <p
          className={cn(
            'font-body text-xl text-gold-muted',
            align === 'center' && 'text-center',
            subtitleClassName
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export interface StatCardProps {
  value: React.ReactNode;
  label: string;
  icon?: LucideIcon;
  iconClassName?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon: Icon,
  iconClassName,
  className,
}) => {
  return (
    <div
      className={cn(
        'text-center p-6 border border-gold/10 rounded-sm bg-background-light/30 transition-all duration-300 hover:border-gold/30 hover:shadow-gold',
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            'w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4',
            iconClassName
          )}
        >
          <Icon className="w-6 h-6 text-gold" />
        </div>
      )}
      <div className="font-display text-4xl md:text-5xl gold-gradient-text mb-2">
        {value}
      </div>
      <div className="text-gold-muted font-display tracking-wider text-sm">
        {label}
      </div>
    </div>
  );
};

export interface InfoGridProps {
  items: {
    icon?: LucideIcon;
    label: string;
    value: React.ReactNode;
    subValue?: React.ReactNode;
  }[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const InfoGrid: React.FC<InfoGridProps> = ({ items, columns = 2, className }) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={cn('grid gap-4', columnClasses[columns], className)}>
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-4 bg-background-light/30 rounded-sm border border-gold/10 hover:border-gold/30 transition-all"
          >
            {(Icon || item.label) && (
              <div className="flex items-center gap-2 mb-2">
                {Icon && <Icon size={16} className="text-gold shrink-0" />}
                <span className="text-sm text-gold-muted font-display tracking-wider">
                  {item.label}
                </span>
              </div>
            )}
            <p className="font-display text-xl text-parchment">{item.value}</p>
            {item.subValue && (
              <p className="text-sm text-gold-muted mt-0.5">{item.subValue}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export { Panel, SectionTitle, StatCard, InfoGrid };
