import type { Banknote } from '@/types';
import BanknoteCard from './BanknoteCard';
import EmptyState from '@/components/common/EmptyState';
import { Link } from 'react-router-dom';

interface BanknoteGridProps {
  banknotes: Banknote[];
  emptyMessage?: string;
  showAction?: boolean;
}

export default function BanknoteGrid({
  banknotes,
  emptyMessage = '暂无符合条件的纸币',
  showAction = true,
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {banknotes.map((banknote, index) => (
        <BanknoteCard key={banknote.id} banknote={banknote} index={index} />
      ))}
    </div>
  );
}
