import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Download, Share2 } from 'lucide-react';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import BanknoteGrid from '@/components/banknote/BanknoteGrid';
import EmptyState from '@/components/common/EmptyState';
import { formatNumber } from '@/utils/cn';

export default function Favorites() {
  const { ids, removeFavorite } = useFavoriteStore();
  const { banknotes } = useBanknoteStore();

  const favoriteBanknotes = useMemo(() => {
    return banknotes.filter((b) => ids.includes(b.id));
  }, [ids, banknotes]);

  const totalValue = useMemo(() => {
    return favoriteBanknotes.reduce((sum, b) => sum + b.favoriteCount, 0);
  }, [favoriteBanknotes]);

  const handleClearAll = () => {
    if (confirm('确定要清空所有收藏吗？')) {
      ids.forEach((id) => removeFavorite(id));
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="text-gold w-6 h-6 fill-gold" />
            <span className="text-gold font-display tracking-widest text-sm">MY COLLECTION</span>
          </div>
          <h1 className="section-title">我的收藏</h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            您收藏的所有纸币，随时欣赏和管理
          </p>
        </div>

        {favoriteBanknotes.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="p-6 bg-background-light/50 border border-gold/10 rounded-sm text-center">
                <div className="font-display text-4xl gold-gradient-text mb-2">
                  {favoriteBanknotes.length}
                </div>
                <div className="text-gold-muted font-display tracking-wider text-sm">
                  收藏纸币
                </div>
              </div>
              <div className="p-6 bg-background-light/50 border border-gold/10 rounded-sm text-center">
                <div className="font-display text-4xl gold-gradient-text mb-2">
                  {new Set(favoriteBanknotes.map((b) => b.countryCode)).size}
                </div>
                <div className="text-gold-muted font-display tracking-wider text-sm">
                  涉及国家
                </div>
              </div>
              <div className="p-6 bg-background-light/50 border border-gold/10 rounded-sm text-center">
                <div className="font-display text-4xl gold-gradient-text mb-2">
                  {new Set(favoriteBanknotes.map((b) => b.currency)).size}
                </div>
                <div className="text-gold-muted font-display tracking-wider text-sm">
                  货币种类
                </div>
              </div>
              <div className="p-6 bg-background-light/50 border border-gold/10 rounded-sm text-center">
                <div className="font-display text-4xl gold-gradient-text mb-2">
                  {formatNumber(totalValue)}
                </div>
                <div className="text-gold-muted font-display tracking-wider text-sm">
                  总收藏热度
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8">
              <p className="text-gold-muted font-body">
                共收藏 <span className="text-gold font-display">{favoriteBanknotes.length}</span> 张纸币
              </p>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gold/30 text-gold rounded-sm hover:bg-gold/10 transition-all">
                  <Share2 size={16} />
                  <span className="text-sm">分享</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gold/30 text-gold rounded-sm hover:bg-gold/10 transition-all">
                  <Download size={16} />
                  <span className="text-sm">导出</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex items-center gap-2 px-4 py-2 border border-copper/30 text-copper rounded-sm hover:bg-copper/10 transition-all"
                >
                  <Trash2 size={16} />
                  <span className="text-sm">清空</span>
                </button>
              </div>
            </div>

            <BanknoteGrid
              banknotes={favoriteBanknotes}
              emptyMessage="您还没有收藏任何纸币"
              showAction={false}
            />
          </>
        ) : (
          <EmptyState
            title="收藏夹是空的"
            description="浏览纸币并点击心形按钮添加到收藏夹，开始建立您的专属收藏"
            action={
              <Link to="/banknotes" className="btn-gold-solid">
                开始浏览
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
