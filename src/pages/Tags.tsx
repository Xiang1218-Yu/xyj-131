import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Tag, TrendingUp, ArrowDownAZ, Layers, Cloud, LayoutGrid, Heart } from 'lucide-react';
import { getAllTags, getTagsByCategory, getBanknotesByTag } from '@/data/banknotes';
import type { TagInfo, TagCategory } from '@/data/banknotes';
import TagCloud from '@/components/common/TagCloud';
import { cn, formatNumber } from '@/utils/cn';

type SortMode = 'popularity' | 'alphabetical' | 'category';
type DisplayMode = 'cloud' | 'grid';

const categoryColors: Record<TagCategory, string> = {
  '货币类型': 'bg-gold/20 text-gold border-gold/30',
  '版别系列': 'bg-copper/20 text-copper-light border-copper/30',
  '特殊属性': 'bg-burgundy/20 text-burgundy-light border-burgundy/30',
  '设计主题': 'bg-navy/20 text-navy-light border-navy/30',
  '地域': 'bg-emerald-900/30 text-emerald-400 border-emerald-600/30',
};

const categoryIcons: Record<TagCategory, string> = {
  '货币类型': '💰',
  '版别系列': '📋',
  '特殊属性': '✨',
  '设计主题': '🎨',
  '地域': '🌏',
};

export default function Tags() {
  const [sortMode, setSortMode] = useState<SortMode>('popularity');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const allTags = useMemo(() => getAllTags(), []);
  const tagsByCategory = useMemo(() => getTagsByCategory(), []);

  const sortedTags = useMemo(() => {
    const tags = [...allTags];
    switch (sortMode) {
      case 'popularity':
        return tags.sort((a, b) => b.count - a.count);
      case 'alphabetical':
        return tags.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
      case 'category':
        return tags;
      default:
        return tags;
    }
  }, [allTags, sortMode]);

  const selectedBanknotes = useMemo(() => {
    if (!selectedTag) return [];
    return getBanknotesByTag(selectedTag);
  }, [selectedTag]);

  const sortOptions: { value: SortMode; label: string; icon: typeof TrendingUp }[] = [
    { value: 'popularity', label: '按热度', icon: TrendingUp },
    { value: 'alphabetical', label: '按字母', icon: ArrowDownAZ },
    { value: 'category', label: '按分类', icon: Layers },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Tag className="text-gold w-6 h-6" />
            <span className="text-gold font-display tracking-widest text-sm">TAG CLOUD</span>
          </div>
          <h1 className="section-title">标签浏览</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            共 {allTags.length} 个标签，通过标签快速发现您感兴趣的纸币
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 p-4 bg-background-light/50 border border-gold/10 rounded-sm">
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm text-gold-muted font-display tracking-wider">排序:</span>
            {sortOptions.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => { setSortMode(opt.value); setSelectedTag(null); }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-display tracking-wider transition-all',
                    sortMode === opt.value
                      ? 'bg-gold text-background'
                      : 'text-gold-muted hover:text-gold hover:bg-gold/10 border border-gold/20'
                  )}
                >
                  <Icon size={14} />
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-gold/20" />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gold-muted font-display tracking-wider">视图:</span>
            <button
              onClick={() => setDisplayMode('grid')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-display tracking-wider transition-all',
                displayMode === 'grid'
                  ? 'bg-gold text-background'
                  : 'text-gold-muted hover:text-gold hover:bg-gold/10 border border-gold/20'
              )}
            >
              <LayoutGrid size={14} />
              网格
            </button>
            <button
              onClick={() => setDisplayMode('cloud')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-display tracking-wider transition-all',
                displayMode === 'cloud'
                  ? 'bg-gold text-background'
                  : 'text-gold-muted hover:text-gold hover:bg-gold/10 border border-gold/20'
              )}
            >
              <Cloud size={14} />
              标签云
            </button>
          </div>
        </div>

        {displayMode === 'cloud' ? (
          <div className="bg-background-light/30 border border-gold/10 rounded-sm p-8 mb-12">
            <TagCloud tags={sortMode === 'category' ? sortedTags : sortedTags} maxFontSize={32} minFontSize={14} />
          </div>
        ) : sortMode === 'category' ? (
          <div className="space-y-8 mb-12">
            {(Object.entries(tagsByCategory) as [TagCategory, TagInfo[]][]).map(([category, tags]) => {
              if (tags.length === 0) return null;
              const colorClass = categoryColors[category];
              return (
                <div key={category} className="bg-background-light/30 border border-gold/10 rounded-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl">{categoryIcons[category]}</span>
                    <h3 className="font-display text-xl text-parchment">{category}</h3>
                    <span className={cn('text-xs px-2 py-0.5 rounded-sm border', colorClass)}>
                      {tags.length} 个标签
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {tags.map(tag => (
                      <TagItem key={tag.name} tag={tag} selectedTag={selectedTag} onSelect={setSelectedTag} category={category} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
            {sortedTags.map(tag => (
              <TagCard key={tag.name} tag={tag} selectedTag={selectedTag} onSelect={setSelectedTag} />
            ))}
          </div>
        )}

        {selectedTag && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="section-title mb-2">#{selectedTag}</h2>
              <div className="gold-divider mb-4" />
              <p className="section-subtitle mb-0">
                共 <span className="text-gold font-display">{selectedBanknotes.length}</span> 张纸币
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {selectedBanknotes.map(banknote => (
                <Link
                  key={banknote.id}
                  to={`/banknote/${banknote.id}`}
                  className="group card-gold overflow-hidden animate-stagger"
                >
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={banknote.obverseImage}
                      alt={`${banknote.country} ${banknote.denomination}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-gold/90 text-background px-3 py-1 rounded-sm font-display text-sm tracking-wider">
                        {banknote.denomination} {banknote.currency}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-lg text-parchment group-hover:text-gold transition-colors mb-2">
                      {banknote.country}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gold-muted">
                      <span>{banknote.year}年</span>
                      <div className="flex items-center gap-1">
                        <Heart size={12} className="fill-gold/30 text-gold/50" />
                        <span>{formatNumber(banknote.favoriteCount)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center">
              <Link to={`/banknotes?tag=${encodeURIComponent(selectedTag)}`} className="btn-gold">
                查看全部 →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TagItem({ tag, selectedTag, onSelect, category }: { tag: TagInfo; selectedTag: string | null; onSelect: (tag: string) => void; category: TagCategory }) {
  const isSelected = selectedTag === tag.name;
  const colorClass = categoryColors[category];

  return (
    <button
      onClick={() => onSelect(isSelected ? '' : tag.name)}
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-sm border transition-all duration-300',
        isSelected
          ? 'bg-gold text-background border-gold shadow-gold'
          : cn('hover:scale-105', colorClass)
      )}
    >
      <span className="font-display text-sm">{tag.name}</span>
      <span className={cn(
        'text-xs font-sans px-1.5 py-0.5 rounded-sm',
        isSelected ? 'bg-background/20 text-background' : 'bg-background/40 text-parchment/70'
      )}>
        {tag.count}
      </span>
    </button>
  );
}

function TagCard({ tag, selectedTag, onSelect }: { tag: TagInfo; selectedTag: string | null; onSelect: (tag: string) => void }) {
  const isSelected = selectedTag === tag.name;

  return (
    <button
      onClick={() => onSelect(isSelected ? '' : tag.name)}
      className={cn(
        'group text-left p-5 rounded-sm border transition-all duration-300',
        isSelected
          ? 'bg-gold/20 border-gold shadow-gold-lg -translate-y-1'
          : 'bg-background-light/30 border-gold/10 hover:border-gold/40 hover:-translate-y-1 hover:shadow-gold'
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-display text-lg text-parchment group-hover:text-gold transition-colors">
          #{tag.name}
        </span>
        <span className="font-display text-2xl gold-gradient-text">{tag.count}</span>
      </div>
      <div className="flex items-center justify-between text-xs text-gold-muted">
        <span>{tag.count} 张纸币</span>
        <div className="flex items-center gap-1">
          <Heart size={10} className="fill-gold/30 text-gold/50" />
          <span>{formatNumber(tag.totalFavorites)}</span>
        </div>
      </div>
      <div className="mt-3 h-1 bg-gold/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full transition-all duration-500"
          style={{ width: `${Math.min(100, (tag.count / 5) * 100)}%` }}
        />
      </div>
    </button>
  );
}
