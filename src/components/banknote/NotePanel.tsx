import { useState, useMemo } from 'react';
import { BookOpen, Plus, Edit3, Trash2, X, Save, Calendar, Tag, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNoteStore } from '@/store/useNoteStore';
import type { Note } from '@/types';
import { cn } from '@/utils/cn';
import { Button, IconButton, Panel, Input, Textarea, Card, Badge } from '@/components/ui';

interface NotePanelProps {
  banknoteId: string;
  banknoteTitle: string;
}

export default function NotePanel({ banknoteId, banknoteTitle }: NotePanelProps) {
  const { notes, addNote, updateNote, deleteNote } = useNoteStore();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const banknoteNotes = useMemo(
    () => notes.filter((note) => note.banknoteId === banknoteId),
    [notes, banknoteId]
  );

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags('');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAddNote = () => {
    if (title.trim() && content.trim()) {
      addNote(banknoteId, {
        title: title.trim(),
        content: content.trim(),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      resetForm();
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingId(note.id);
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
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      });
      resetForm();
    }
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
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

  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BookOpen size={28} className="text-gold" />
          <h2 className="font-display text-3xl text-parchment">学习笔记</h2>
        </div>
        <div className="flex items-center gap-3">
          {!isAdding && !editingId && (
            <>
              <Button
                variant="default"
                leftIcon={LinkIcon}
                asChild
              >
                <Link to="/notes">全部笔记</Link>
              </Button>
              <Button
                variant="solid"
                leftIcon={Plus}
                onClick={handleStartAdd}
              >
                添加笔记
              </Button>
            </>
          )}
        </div>
      </div>

      {(isAdding || editingId) && (
        <Card padding="lg" className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl text-parchment">
              {editingId ? '编辑笔记' : '新建笔记'}
            </h3>
            <IconButton
              icon={X}
              variant="ghost"
              onClick={resetForm}
              label="关闭"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                笔记标题
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`关于 ${banknoteTitle} 的学习笔记...`}
              />
            </div>

            <div>
              <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                笔记内容
              </label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="记录您的学习心得、收藏背景、市场行情分析..."
                rows={6}
                className="resize-y"
              />
            </div>

            <div>
              <label className="block text-gold-muted text-sm font-display tracking-wider mb-2">
                标签 <span className="text-xs">(用逗号分隔)</span>
              </label>
              <Input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="收藏, 鉴赏, 市场价值, 历史背景..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="default" onClick={resetForm}>
                取消
              </Button>
              <Button
                variant="solid"
                leftIcon={Save}
                onClick={editingId ? handleSaveEdit : handleAddNote}
                disabled={!title.trim() || !content.trim()}
              >
                {editingId ? '保存修改' : '保存笔记'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {banknoteNotes.length === 0 && !isAdding && (
        <Panel padding="xl" className="text-center">
          <BookOpen size={48} className="text-gold/30 mx-auto mb-4" />
          <p className="text-gold-muted font-body text-lg mb-4">
            还没有任何学习笔记
          </p>
          <p className="text-gold-muted/60 font-body text-sm mb-6">
            记录您的收藏心得、鉴赏知识或市场分析
          </p>
          <Button variant="solid" onClick={handleStartAdd}>
            写下第一篇笔记
          </Button>
        </Panel>
      )}

      {banknoteNotes.length > 0 && (
        <div className="space-y-4">
          {banknoteNotes.map((note) => {
            const isExpanded = expandedId === note.id;
            return (
              <Card
                key={note.id}
                padding="lg"
                className={cn(
                  'transition-all duration-300',
                  isExpanded && 'border-gold/50 shadow-gold-lg'
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : note.id)}
                  >
                    <h4 className="font-display text-xl text-parchment mb-2 hover:text-gold transition-colors">
                      {note.title}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gold-muted">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(note.updatedAt)}
                      </span>
                      {note.tags.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Tag size={14} />
                          {note.tags.length} 个标签
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <IconButton
                      icon={Edit3}
                      size="md"
                      onClick={() => handleEditNote(note)}
                      label="编辑"
                    />
                    <IconButton
                      icon={Trash2}
                      size="md"
                      variant="danger"
                      onClick={() => deleteNote(note.id)}
                      label="删除"
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="animate-fade-in pt-4 border-t border-gold/10">
                    <p className="font-body text-gold-muted leading-relaxed whitespace-pre-wrap">
                      {note.content}
                    </p>
                    {note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gold/10">
                        {note.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="gold"
                            size="md"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {!isExpanded && (
                  <p className="text-gold-muted/70 text-sm line-clamp-2">
                    {note.content}
                  </p>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
