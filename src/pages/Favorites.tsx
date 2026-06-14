import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, Download, Share2, Check } from 'lucide-react';
import { useFavoriteStore } from '@/store/useFavoriteStore';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import { useShare } from '@/hooks/useShare';
import BanknoteGrid from '@/components/banknote/BanknoteGrid';
import EmptyState from '@/components/common/EmptyState';
import ShareModal from '@/components/common/ShareModal';
import { formatNumber } from '@/utils/cn';

export default function Favorites() {
  const { ids, removeFavorite } = useFavoriteStore();
  const { banknotes } = useBanknoteStore();
  const [exportSuccess, setExportSuccess] = useState(false);

  const favoriteBanknotes = useMemo(() => {
    return banknotes.filter((b) => ids.includes(b.id));
  }, [ids, banknotes]);

  const totalValue = useMemo(() => {
    return favoriteBanknotes.reduce((sum, b) => sum + b.favoriteCount, 0);
  }, [favoriteBanknotes]);

  const share = useShare({
    title: '我的纸币收藏 - 世界纸币收藏馆',
    text: `我在世界纸币收藏馆收藏了 ${favoriteBanknotes.length} 张精美纸币，快来看看吧！`,
    url: typeof window !== 'undefined' ? window.location.href : '',
  });

  useEffect(() => {
    share.setContent({
      title: '我的纸币收藏 - 世界纸币收藏馆',
      text: `我在世界纸币收藏馆收藏了 ${favoriteBanknotes.length} 张精美纸币，快来看看吧！`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    });
  }, [favoriteBanknotes.length, share]);

  const handleClearAll = () => {
    if (confirm('确定要清空所有收藏吗？')) {
      ids.forEach((id) => removeFavorite(id));
    }
  };

  const handleExport = () => {
    if (favoriteBanknotes.length === 0) return;

    const exportData = favoriteBanknotes.map((b) => ({
      国家: b.country,
      年份: b.year,
      面值: `${b.denomination} ${b.currency}`,
      尺寸: b.dimensions,
      材质: b.material,
      主色调: b.mainColor,
      正面图案: b.obverseDesign,
      背面图案: b.reverseDesign,
      防伪特征: b.securityFeatures.join('、'),
      历史背景: b.history,
      稀有度: `${b.rarity}星`,
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map((row) =>
        Object.values(row)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `我的纸币收藏_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
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
                <button
                  onClick={share.open}
                  className="flex items-center gap-2 px-4 py-2 border border-gold/30 text-gold rounded-sm hover:bg-gold/10 transition-all"
                >
                  <Share2 size={16} />
                  <span className="text-sm">分享</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 border border-gold/30 text-gold rounded-sm hover:bg-gold/10 transition-all"
                >
                  {exportSuccess ? <Check size={16} className="text-green-500" /> : <Download size={16} />}
                  <span className="text-sm">{exportSuccess ? '已导出' : '导出'}</span>
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

      <ShareModal
        isOpen={share.isOpen}
        onClose={share.close}
        content={share.content}
        onCopyLink={share.copyLink}
        onShareNative={share.shareNative}
        copied={share.copied}
        canShareNative={share.canShareNative}
        title="分享收藏"
        description={`分享您收藏的 ${favoriteBanknotes.length} 张精美纸币给朋友`}
        showSaveImage={false}
      />
    </div>
  );
}
