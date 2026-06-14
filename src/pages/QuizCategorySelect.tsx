import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Globe, Shield, Clock, Palette, FlaskConical, ChevronRight, Sparkles } from 'lucide-react';
import type { QuizCategory } from '@/types';
import { categoryMeta } from '@/data/quizData';
import { useQuizStore } from '@/store/useQuizStore';
import { cn } from '@/utils/cn';

const categoryIcons: Record<QuizCategory, React.ElementType> = {
  country: Globe,
  security: Shield,
  history: Clock,
  design: Palette,
  material: FlaskConical,
};

const categoryDescs: Record<QuizCategory, string> = {
  country: '识别纸币发行国家，挑战你的地理知识',
  security: '了解各国纸币的防伪技术和安全特征',
  history: '追溯纸币发行年代，探索货币发展史',
  design: '辨识纸币图案设计，赏析钞票之美',
  material: '认识纸币材质工艺，从棉麻到聚合物',
};

const allCategories: QuizCategory[] = ['country', 'security', 'history', 'design', 'material'];

export default function QuizCategorySelect() {
  const navigate = useNavigate();
  const { selectCategories, startQuiz } = useQuizStore();
  const [selected, setSelected] = useState<QuizCategory[]>([]);

  const toggleCategory = (cat: QuizCategory) => {
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const selectAll = () => {
    setSelected(selected.length === allCategories.length ? [] : [...allCategories]);
  };

  const handleStart = () => {
    if (selected.length === 0) return;
    selectCategories(selected);
    startQuiz();
    navigate('/quiz/play');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/30 rounded-full mb-6">
            <Brain className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-display tracking-wider">知识挑战</span>
          </div>
          <h1 className="section-title mb-4">纸币知识答题</h1>
          <p className="section-subtitle">
            选择你感兴趣的答题类型，测试你对世界纸币的了解程度
          </p>
          <div className="gold-divider mt-6" />
        </div>

        <div className="flex justify-end mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={selectAll}
            className={cn(
              'text-sm font-display tracking-wider px-4 py-1.5 border rounded-sm transition-all duration-300',
              selected.length === allCategories.length
                ? 'border-gold text-gold bg-gold/10'
                : 'border-gold/20 text-gold-muted hover:text-gold hover:border-gold/40'
            )}
          >
            {selected.length === allCategories.length ? '取消全选' : '全选'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {allCategories.map((cat, idx) => {
            const meta = categoryMeta[cat];
            const Icon = categoryIcons[cat];
            const isSelected = selected.includes(cat);

            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={cn(
                  'group relative text-left p-6 border rounded-sm transition-all duration-300 animate-fade-in',
                  isSelected
                    ? 'border-gold bg-gold/10 shadow-gold'
                    : 'border-gold/20 bg-background-light hover:border-gold/40 hover:bg-gold/5'
                )}
                style={{ animationDelay: `${0.1 * idx + 0.3}s` }}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-background" />
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300',
                      isSelected
                        ? 'bg-gold text-background'
                        : 'bg-gold/10 text-gold group-hover:bg-gold/20'
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{meta.icon}</span>
                      <h3 className={cn(
                        'font-display text-lg tracking-wider',
                        isSelected ? 'text-gold' : 'text-parchment'
                      )}>
                        {meta.label}
                      </h3>
                    </div>
                    <p className={cn(
                      'text-sm leading-relaxed',
                      isSelected ? 'text-parchment/80' : 'text-gold-muted'
                    )}>
                      {categoryDescs[cat]}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <button
            onClick={handleStart}
            disabled={selected.length === 0}
            className={cn(
              'inline-flex items-center gap-3 px-10 py-4 font-display text-lg tracking-widest transition-all duration-300 rounded-sm',
              selected.length > 0
                ? 'bg-gold text-background hover:bg-gold-light shadow-gold-lg hover:shadow-gold-xl'
                : 'bg-gold/10 text-gold-muted cursor-not-allowed'
            )}
          >
            开始挑战
            <ChevronRight className="w-5 h-5" />
          </button>
          {selected.length > 0 && (
            <p className="text-gold-muted text-sm mt-4 font-display tracking-wider">
              已选 {selected.length} 个类型 · 共 {selected.length * 5} 道题目
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
