import { useState, useCallback } from 'react';

export interface ShareContent {
  title: string;
  text?: string;
  url: string;
  images?: string[];
}

export interface UseShareReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  shareLink: () => Promise<void>;
  shareNative: () => Promise<void>;
  saveImage: (imageUrl: string, fileName?: string) => Promise<void>;
  copyLink: () => Promise<boolean>;
  copied: boolean;
  canShareNative: boolean;
  content: ShareContent;
  setContent: (content: ShareContent) => void;
}

export function useShare(initialContent?: ShareContent): UseShareReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [content, setContent] = useState<ShareContent>(
    initialContent || {
      title: document.title,
      url: typeof window !== 'undefined' ? window.location.href : '',
    }
  );

  const canShareNative =
    typeof navigator !== 'undefined' &&
    'share' in navigator &&
    typeof navigator.share === 'function';

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const copyLink = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(content.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch {
      return false;
    }
  }, [content.url]);

  const shareLink = useCallback(async () => {
    await copyLink();
  }, [copyLink]);

  const shareNative = useCallback(async () => {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title: content.title,
        text: content.text,
        url: content.url,
      });
      setIsOpen(false);
    } catch {
      // 用户取消或分享失败
    }
  }, [content]);

  const saveImage = useCallback(async (imageUrl: string, fileName?: string): Promise<void> => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `banknote_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      window.open(imageUrl, '_blank');
    }
  }, []);

  return {
    isOpen,
    open,
    close,
    shareLink,
    shareNative,
    saveImage,
    copyLink,
    copied,
    canShareNative,
    content,
    setContent,
  };
}

export default useShare;
