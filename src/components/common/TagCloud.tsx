import { useMemo } from 'react';
import type { TagInfo } from '@/data/banknotes';
import TagWithTooltip from '@/components/common/TagWithTooltip';
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
      return { tag, fontSize, opacity };
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
        <TagWithTooltip
          key={tag.name}
          tagName={tag.name}
          bare={true}
          showPrefix={false}
          className={colors[index % colors.length]}
          style={{
            fontSize: `${fontSize}px`,
            opacity,
            lineHeight: 1.4,
          }}
        />
      ))}
    </div>
  );
}
