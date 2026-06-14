import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Calendar,
  Tag,
  Edit3,
  Trash2,
  X,
  Save,
  ArrowLeft,
  Filter,
  SortDesc,
  Banknote,
  Clock,
} from 'lucide-react';
import { useNoteStore } from '@/store/useNoteStore';
import { useBanknoteStore } from '@/store/useBanknoteStore';
import type { Note } from '@/types';
import { cn } from '@/utils/cn';

type SortOption = 'updatedAt' | 'createdAt' | 'title';

export default function MyNotes() {
  const { notes, addNote, updateNote, deleteNote } = useNoteStore();
  const { banknotes } = useBanknoteStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBanknoteId, setFilterBanknoteId] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedBanknoteId, setSelectedBanknoteId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const banknoteOptions = useMemo(() => {
    const map = new Map<string, { id: string; title: string; count: number }>();
    banknotes.forEach((b) => {
      map.set(b.id, {
        id: b.id,
        title: `${b.country} ${b.denomination}${b.currency}`,
        count: 0,
      });
    });
    notes.forEach((note) => {
      const item = map.get(note.banknoteId);
      if (item) item.count++;
    });
    return Array.from(map.values()).filter((item) => item.count > 0 || banknotes.some((b) => b.id === item.id));
  }, [banknotes, notes]);

  const filteredAndSortedNotes = useMemo(() => {
    let result = [...notes];

    if (filterBanknoteId !== 'all') {
      result = result.filter((note) => note.banknoteId === filterBanknoteId);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (note) =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          note.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'updatedAt') {
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title, 'zh-CN');
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [notes, searchQuery, sortBy, sortOrder, filterBanknoteId]);

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setSelectedBanknoteId('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAddNote = () => {
    if (selectedBanknoteId && title.trim() && content.trim()) {
      addNote(selectedBanknoteId, {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      resetForm();
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingId(note.id);
    setSelectedBanknoteId(note.banknoteId);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags.join(', '));
    setIsAdding(false);
  };

  const handleSaveEdit = () => {
    if (editingId && title.trim() && content.trim()) {
      updateNote(editingId, {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      resetForm();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getBanknoteTitle = (banknoteId: string) => {
    const banknote = banknotes.find((b) => b.id === banknoteId);
    if (banknote) {
      return `${banknote.country} ${banknote.denomination}${banknote.currency}`;
    }
    return '未知纸币';
  };

  const getBanknoteLink = (banknoteId: string) => {
    return `/banknote/${banknoteId}`;
  };

  const stats = useMemo(() => {
    const totalNotes = notes.length;
    const totalBanknotes = new Set(notes.map((n) => n.banknoteId)).size;
    const totalTags = new Set(notes.flatMap((n) => n.tags)).size;
    return { totalNotes, totalBanknotes, totalTags };
  }, [notes]);

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="section-title">
            <span className="ornament text-3xl">❧</span>
            我的学习笔记
            <span className="ornament text-3xl">❧</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="section-subtitle">
            管理您的所有收藏笔记和学习心得
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card-gold p-6 text-center">
            <BookOpen size={32} className="text-gold mx-auto mb-3" />
            <p className="font-display text-3xl text-parchment mb-1">{stats.totalNotes}</p>
            <p className="text-gold-muted text-sm">笔记总数</p>
          </div>
          <div className="card-gold p-6 text-center">
            <Banknote size={32} className="text-gold mx-auto mb-3" />
            <p className="font-display text-3xl text-parchment mb-1">{stats.totalBanknotes}</p>
            <p className="text-gold-muted text-sm">涉及纸币</p>
          </div>
          <div className="card-gold p-6 text-center">
            <Tag size={32} className="text-gold mx-auto mb-3" />
            <p className="font-display text-3xl text-parchment mb-1">{stats.totalTags}</p>
            <p className="text-gold-muted text-sm">标签数量</p>
          </div>
        </div>

        <div className="card-gold p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索笔记标题、内容或标签..."
                  className="input-elegant pl-12"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-muted" />
                <select
                  value={filterBanknoteId}
                  onChange={(e) => setFilterBanknoteId(e.target.value)}
                  className="input-elegant pl-12 appearance-none cursor-pointer"
                >
                  <option value="all">全部纸币</option>
                  {banknoteOptions
                    .filter((b) => b.count > 0)
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.count})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div>
              <div className="relative">
                <SortDesc className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-muted" />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [by, order] = e.target.value.split('-');
                    setSortBy(by as SortOption);
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="input-elegant pl-12 appearance-none cursor-pointer"
                >
                  <option value="updatedAt-desc">最近更新 (新→旧)</option>
                  <option value="updatedAt-asc">最近更新 (旧→新)</option>
                  <option value="createdAt-desc">创建时间 (新→旧)</option>
                  <option value="createdAt-asc">创建时间 (旧→新)</option>
                  <option value="title-asc">标题 (A→Z)</option>
                  <option value="title-desc">标题 (Z→A)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {(isAdding || editingId) && (
          <div className="card-gold p-6 mb-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-parchment">
                {editingId ? '编辑笔记' : '新建笔记'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gold-muted hover:text-gold transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                  关联纸币
                </label>
                <select
                  value={selectedBanknoteId}
                  onChange={(e) => setSelectedBanknoteId(e.target.value)}
                  className="input-elegant cursor-pointer"
                  disabled={!!editingId}
                >
                  <option value="">选择关联的纸币...</option>
                  {banknoteOptions.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                  笔记标题
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="输入笔记标题..."
                  className="input-elegant"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                笔记内容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="记录您的学习心得、收藏背景、市场行情分析..."
                rows={6}
                className="input-elegant resize-y"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                标签 <span className="text-xs">(用逗号分隔)</span>
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="收藏, 鉴赏, 市场价值, 历史背景..."
                className="input-elegant"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={resetForm} className="btn-gold">
                取消
              </button>
              <button
                onClick={editingId ? handleSaveEdit : handleAddNote}
                className="btn-gold-solid flex items-center gap-2"
                disabled={!selectedBanknoteId || !title.trim() || !content.trim()}
              >
                <Save size={16} />
                {editingId ? '保存修改' : '保存笔记'}
              </button>
            </div>
          </div>
        )}

        {!isAdding && !editingId && (
          <div className="flex justify-end mb-6">
            <button
              onClick={() => {
                resetForm();
                setIsAdding(true);
              }}
              className="btn-gold-solid flex items-center gap-2"
            >
              <BookOpen size={18} />
              新建笔记
            </button>
          </div>
        )}

        {filteredAndSortedNotes.length === 0 ? (
          <div className="card-gold p-16 text-center">
            <BookOpen size={64} className="text-gold/30 mx-auto mb-6" />
            <p className="text-gold-muted font-body text-xl mb-4">
              {notes.length === 0 ? '还没有任何笔记' : '没有找到匹配的笔记'}
            </p>
            <p className="text-gold-muted/60 font-body text-sm mb-8">
              {notes.length === 0
                ? '点击上方按钮开始记录您的第一张学习笔记'
                : '试试调整搜索条件或筛选器'}
            </p>
            {notes.length === 0 && (
              <div className="flex justify-center gap-4">
                <Link to="/banknotes" className="btn-gold flex items-center gap-2">
                  <ArrowLeft size={16} />
                  浏览纸币
                </Link>
                <button
                  onClick={() => {
                    resetForm();
                    setIsAdding(true);
                  }}
                  className="btn-gold-solid flex items-center gap-2"
                >
                  <BookOpen size={16} />
                  新建笔记
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedNotes.map((note) => {
              const isExpanded = expandedId === note.id;
              const banknoteTitle = getBanknoteTitle(note.banknoteId);
              const banknoteLink = getBanknoteLink(note.banknoteId);

              return (
                <div
                  key={note.id}
                  className={cn(
                    'card-gold p-6 transition-all duration-300',
                    isExpanded && 'border-gold/50 shadow-gold-lg'
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div
                        className="cursor-pointer"
                        onClick={() => setExpandedId(isExpanded ? null : note.id)}
                      >
                        <h4 className="font-display text-2xl text-parchment mb-3 hover:text-gold transition-colors">
                          {note.title}
                        </h4>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gold-muted mb-3">
                        <Link
                          to={banknoteLink}
                          className="flex items-center gap-1.5 hover:text-gold transition-colors"
                        >
                          <Banknote size={14} />
                          {banknoteTitle}
                        </Link>
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          更新于 {formatDate(note.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} />
                          创建于 {formatDate(note.createdAt)}
                        </span>
                        {note.tags.length > 0 && (
                          <span className="flex items-center gap-1.5">
                            <Tag size={14} />
                            {note.tags.length} 个标签
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => handleEditNote(note)}
                        className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold-muted hover:text-gold hover:border-gold/50 transition-all"
                        title="编辑"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center text-red-400 hover:text-red-300 hover:border-red-500/50 transition-all"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="animate-fade-in pt-4 border-t border-gold/10">
                      <p className="font-body text-gold-muted leading-relaxed whitespace-pre-wrap text-lg">
                        {note.content}
                      </p>
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-gold/10">
                          {note.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-gold/10 text-gold rounded-sm font-body border border-gold/20"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!isExpanded && (
                    <p className="text-gold-muted/70 text-base line-clamp-2">
                      {note.content}
                    </p>
                  )}

                  <div className="flex justify-end mt-4 pt-4 border-t border-gold/10">
                    <Link
                      to={banknoteLink}
                      className="text-gold-muted hover:text-gold text-sm flex items-center gap-1 transition-colors"
                    >
                      查看关联纸币
                      <ArrowLeft size={14} className="rotate-180" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
