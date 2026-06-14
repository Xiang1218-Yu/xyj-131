import { useState } from 'react';
import { X, Link, Download, Image, Check, Smartphone } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ShareContent } from '@/hooks/useShare';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ShareContent;
  onCopyLink: () => Promise<boolean>;
  onShareNative?: () => Promise<void>;
  onSaveImage?: (imageUrl: string, fileName?: string) => Promise<void>;
  showSaveImage?: boolean;
  copied?: boolean;
  canShareNative?: boolean;
  title?: string;
  description?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  content,
  onCopyLink,
  onShareNative,
  onSaveImage,
  showSaveImage = true,
  copied: externalCopied,
  canShareNative = false,
  title = '分享',
  description,
}: ShareModalProps) {
  const [localCopied, setLocalCopied] = useState(false);
  const [savingImageIndex, setSavingImageIndex] = useState<number | null>(null);
  const [savedImageIndex, setSavedImageIndex] = useState<number | null>(null);

  const copied = externalCopied ?? localCopied;

  const handleCopyLink = async () => {
    const success = await onCopyLink();
    if (success) {
      setLocalCopied(true);
      setTimeout(() => setLocalCopied(false), 2000);
    }
  };

  const handleSaveImage = async (imageUrl: string, index: number, fileName?: string) => {
    if (!onSaveImage) return;
    setSavingImageIndex(index);
    try {
      await onSaveImage(imageUrl, fileName);
      setSavedImageIndex(index);
      setTimeout(() => setSavedImageIndex(null), 2000);
    } finally {
      setSavingImageIndex(null);
    }
  };

  if (!isOpen) return null;

  const hasImages = content.images && content.images.length > 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background-light border border-gold/20 rounded-sm max-w-md w-full mx-4 animate-fade-in-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gold/10">
          <div>
            <h3 className="font-display text-2xl text-parchment">{title}</h3>
            {description && (
              <p className="text-gold-muted text-sm mt-1 font-body">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gold-muted hover:text-gold transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {canShareNative && onShareNative && (
            <button
              onClick={onShareNative}
              className="w-full flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gold to-gold-dark text-background rounded-sm hover:opacity-90 transition-all"
            >
              <Smartphone size={20} />
              <span className="font-display tracking-wider">系统分享</span>
            </button>
          )}

          <button
            onClick={handleCopyLink}
            className={cn(
              'w-full flex items-center gap-3 px-6 py-4 border rounded-sm transition-all',
              copied
                ? 'border-green-500/50 bg-green-500/10 text-green-500'
                : 'border-gold/30 text-gold hover:bg-gold/10'
            )}
          >
            {copied ? (
              <>
                <Check size={20} />
                <span className="font-display tracking-wider">链接已复制</span>
              </>
            ) : (
              <>
                <Link size={20} />
                <span className="font-display tracking-wider">复制链接</span>
              </>
            )}
          </button>

          {hasImages && showSaveImage && onSaveImage && (
            <div className="pt-4 border-t border-gold/10">
              <h4 className="font-display text-gold mb-4 flex items-center gap-2">
                <Image size={18} />
                保存图片
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {content.images!.map((image, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      handleSaveImage(
                        image,
                        index,
                        `${content.title.replace(/\s+/g, '_')}_${index === 0 ? '正面' : '背面'}.jpg`
                      )
                    }
                    className="relative group overflow-hidden rounded-sm border border-gold/20 hover:border-gold/50 transition-all"
                    disabled={savingImageIndex === index}
                  >
                    <img
                      src={image}
                      alt={`${content.title} ${index === 0 ? '正面' : '背面'}`}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {savingImageIndex === index ? (
                        <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                      ) : savedImageIndex === index ? (
                        <div className="flex flex-col items-center gap-1">
                          <Check size={24} className="text-green-500" />
                          <span className="text-xs text-green-500">已保存</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <Download size={20} className="text-gold" />
                          <span className="text-xs text-gold">
                            {index === 0 ? '正面' : '背面'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <span className="text-xs text-gold-muted">
                        {index === 0 ? '正面' : '背面'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gold/10">
            <div className="p-4 bg-background/50 rounded-sm">
              <p className="text-xs text-gold-muted font-sans break-all">
                {content.url}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
