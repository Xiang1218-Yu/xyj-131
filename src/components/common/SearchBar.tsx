import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Clock, TrendingUp, MapPin, Calendar, DollarSign, Tag, Palette } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useSearchStore, type SearchSuggestion } from '@/store/useSearchStore';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  onSubmit?: (query?: string) => void;
}

const typeIcons = {
  country: MapPin,
  year: Calendar,
  denomination: DollarSign,
  tag: Tag,
  design: Palette,
};

const typeLabels = {
  country: '国家',
  year: '年份',
  denomination: '面值',
  tag: '标签',
  design: '设计',
};

export default function SearchBar({
  value,
  onChange,
  placeholder = '搜索国家、面值、年份...',
  className,
  onSubmit,
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggest' | 'history' | 'hot'>('hot');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { history, addToHistory, removeFromHistory, clearHistory, getSuggestions, getHotSearches } =
    useSearchStore();

  const suggestions = useMemo(() => getSuggestions(value), [value, getSuggestions]);
  const hotSearches = useMemo(() => getHotSearches(), [getHotSearches]);

  useEffect(() => {
    if (value.trim()) {
      setActiveTab('suggest');
    } else if (isOpen) {
      setActiveTab(history.length > 0 ? 'history' : 'hot');
    }
  }, [value, history.length, isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent, queryOverride?: string) => {
    e?.preventDefault();
    const query = queryOverride ?? value;
    if (query.trim()) {
      addToHistory(query);
    }
    setIsOpen(false);
    onSubmit?.(query);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    const val = suggestion.value;
    onChange(val);
    handleSubmit(undefined, val);
  };

  const handleHistoryClick = (query: string) => {
    onChange(query);
    handleSubmit(undefined, query);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  const showPanel = isOpen && (suggestions.length > 0 || history.length > 0 || hotSearches.length > 0);

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={(e) => handleSubmit(e)} className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/70 w-5 h-5 z-10" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="input-elegant pl-12 pr-12 py-4 text-lg bg-background-light/80 backdrop-blur-sm relative z-10"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-gold/10 hover:bg-gold/20 flex items-center justify-center text-gold-muted hover:text-gold transition-all"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {showPanel && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-sm border border-gold/20 bg-background-light/95 backdrop-blur-xl shadow-gold-xl z-50 overflow-hidden animate-fade-in-down">
          <div className="flex items-center border-b border-gold/10">
            {suggestions.length > 0 && (
              <button
                onClick={() => setActiveTab('suggest')}
                className={cn(
                  'px-5 py-3 font-display text-sm tracking-wider transition-all',
                  activeTab === 'suggest'
                    ? 'text-gold border-b-2 border-gold -mb-px bg-gold/5'
                    : 'text-gold-muted hover:text-parchment'
                )}
              >
                搜索建议
              </button>
            )}
            {history.length > 0 && (
              <button
                onClick={() => setActiveTab('history')}
                className={cn(
                  'px-5 py-3 font-display text-sm tracking-wider transition-all flex items-center gap-2',
                  activeTab === 'history'
                    ? 'text-gold border-b-2 border-gold -mb-px bg-gold/5'
                    : 'text-gold-muted hover:text-parchment'
                )}
              >
                <Clock size={14} />
                历史记录
              </button>
            )}
            <button
              onClick={() => setActiveTab('hot')}
              className={cn(
                'px-5 py-3 font-display text-sm tracking-wider transition-all flex items-center gap-2',
                activeTab === 'hot'
                  ? 'text-gold border-b-2 border-gold -mb-px bg-gold/5'
                  : 'text-gold-muted hover:text-parchment'
              )}
            >
              <TrendingUp size={14} />
              热门搜索
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {activeTab === 'suggest' && suggestions.length > 0 && (
              <div className="py-2">
                {suggestions.map((item, index) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <button
                      key={`${item.type}-${item.value}-${index}`}
                      onClick={() => handleSuggestionClick(item)}
                      className="w-full px-5 py-3 flex items-center gap-4 hover:bg-gold/10 transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                        <Icon size={15} className="text-gold" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-body text-parchment truncate">{item.label}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-background text-gold-muted font-display tracking-wider shrink-0">
                            {typeLabels[item.type]}
                          </span>
                        </div>
                      </div>
                      {item.count !== undefined && (
                        <span className="text-sm text-gold-muted font-display shrink-0">
                          {item.count} 张
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'history' && history.length > 0 && (
              <div className="py-2">
                {history.map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className="px-5 py-3 flex items-center gap-4 hover:bg-gold/10 transition-all group"
                  >
                    <button
                      onClick={() => handleHistoryClick(item)}
                      className="flex-1 flex items-center gap-4 text-left min-w-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center shrink-0 group-hover:bg-gold/15 transition-colors">
                        <Clock size={14} className="text-gold-muted group-hover:text-gold transition-colors" />
                      </div>
                      <span className="font-body text-parchment truncate">{item}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item);
                      }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-gold-muted/50 hover:text-gold hover:bg-gold/10 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <div className="px-5 py-3 border-t border-gold/10">
                  <button
                    onClick={clearHistory}
                    className="text-sm text-gold-muted hover:text-gold font-display tracking-wider transition-colors"
                  >
                    清除全部历史
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'hot' && hotSearches.length > 0 && (
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {hotSearches.map((item, index) => {
                    const Icon = typeIcons[item.type];
                    const isTop3 = index < 3;
                    return (
                      <button
                        key={`${item.type}-${item.value}-${index}`}
                        onClick={() => handleSuggestionClick(item)}
                        className={cn(
                          'group px-4 py-2.5 rounded-sm border font-body text-sm flex items-center gap-2 transition-all',
                          isTop3
                            ? 'border-gold/40 bg-gradient-to-r from-gold/10 to-copper/10 hover:border-gold hover:shadow-gold'
                            : 'border-gold/15 bg-background/50 hover:border-gold/40 hover:bg-gold/5'
                        )}
                      >
                        <span
                          className={cn(
                            'w-5 h-5 rounded-sm flex items-center justify-center text-[10px] font-display font-bold',
                            index === 0 && 'bg-gradient-to-br from-rose-500 to-rose-700 text-white',
                            index === 1 && 'bg-gradient-to-br from-amber-500 to-amber-700 text-white',
                            index === 2 && 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white',
                            index > 2 && 'bg-gold/20 text-gold-muted'
                          )}
                        >
                          {index + 1}
                        </span>
                        <Icon size={13} className={cn(isTop3 ? 'text-gold' : 'text-gold-muted group-hover:text-gold')} />
                        <span className={cn(isTop3 ? 'text-parchment' : 'text-gold-muted group-hover:text-parchment')}>
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
