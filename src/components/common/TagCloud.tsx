import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { TagInfo } from '@/data/banknotes';
import { cn } from '@/utils/cn';

interface TagCloudProps {
  tags: TagInfo[];
  maxFontSize?: number;
  minFontSize?: number;
  className?: string;
}

export default function TagCloud({ tags, maxFontSize = 28, minFontSize = 12, className }: TagCloudProps) {
  const tagStyles = useMemo(() => {
    if (tags.length === 0) return [];
    const maxCount = Math.max(...tags.map(t => t.count));
    const minCount = Math.min(...tags.map(t => t.count));
    const range = maxCount - minCount || 1;

    return tags.map(tag => {
      const ratio = (tag.count - minCount) / range;
      const fontSize = minFontSize + ratio * (maxFontSize - minFontSize);
      const opacity = 0.5 + ratio * 0.5;
      const hoverScale = 1 + ratio * 0.15;
      return { tag, fontSize, opacity, hoverScale };
    });
  }, [tags, maxFontSize, minFontSize]);

  const colors = [
    'text-gold',
    'text-gold-light',
    'text-copper-light',
    'text-parchment',
    'text-copper',
    'text-gold-muted',
  ];

  return (
    <div className={cn('flex flex-wrap items-center justify-center gap-3 py-6', className)}>
      {tagStyles.map(({ tag, fontSize, opacity }, index) => (
        <Link
          key={tag.name}
          to={`/banknotes?tag=${encodeURIComponent(tag.name)}`}
          className={cn(
            'inline-block font-display transition-all duration-300 hover:scale-110 hover:opacity-100 hover:text-gold',
            colors[index % colors.length]
          )}
          style={{
            fontSize: `${fontSize}px`,
            opacity,
            lineHeight: 1.4,
          }}
          title={`${tag.name}: ${tag.count} 张纸币`}
        >
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
