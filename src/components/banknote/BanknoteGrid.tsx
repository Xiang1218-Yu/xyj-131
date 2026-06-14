import type { Banknote, ViewMode } from '@/types';
import BanknoteCard from './BanknoteCard';
import EmptyState from '@/components/common/EmptyState';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface BanknoteGridProps {
  banknotes: Banknote[];
  emptyMessage?: string;
  showAction?: boolean;
  viewMode?: ViewMode;
}

export default function BanknoteGrid({
  banknotes,
  emptyMessage = '暂无符合条件的纸币',
  showAction = true,
  viewMode = 'grid',
}: BanknoteGridProps) {
  if (banknotes.length === 0) {
    return (
      <EmptyState
        title="没有找到纸币"
        description={emptyMessage}
        action={
          showAction && (
            <Link to="/banknotes" className="btn-gold-solid">
              浏览全部纸币
            </Link>
          )
        }
      />
    );
  }

  const containerClass = cn({
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6': viewMode === 'grid',
    'flex flex-col gap-4': viewMode === 'list' || viewMode === 'compact',
  });

  return (
    <div className={containerClass}>
      {banknotes.map((banknote, index) => (
        <BanknoteCard key={banknote.id} banknote={banknote} index={index} viewMode={viewMode} />
      ))}
    </div>
  );
}
