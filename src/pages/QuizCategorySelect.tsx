import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Globe, Shield, Clock, Palette, FlaskConical, ChevronRight, Sparkles } from 'lucide-react';
import type { QuizCategory } from '@/types';
import { categoryMeta } from '@/data/quizData';
import { useQuizStore } from '@/store/useQuizStore';
import { cn } from '@/utils/cn';
import { Button, Card, SectionTitle, Badge } from '@/components/ui';

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
          <Badge
            variant="gold"
            size="md"
            icon={Brain}
            rounded
          >
            知识挑战
          </Badge>
          <div className="mt-6">
            <SectionTitle
              title="纸币知识答题"
              subtitle="选择你感兴趣的答题类型，测试你对世界纸币的了解程度"
            />
          </div>
        </div>

        <div className="flex justify-end mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Button
            variant={selected.length === allCategories.length ? 'soft' : 'outline'}
            size="sm"
            onClick={selectAll}
          >
            {selected.length === allCategories.length ? '取消全选' : '全选'}
          </Button>
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
                  'group relative text-left animate-fade-in'
                )}
                style={{ animationDelay: `${0.1 * idx + 0.3}s` }}
              >
                <Card
                  variant={isSelected ? 'elevated' : 'default'}
                  padding="lg"
                  className={cn(
                    'w-full h-full transition-all duration-300',
                    isSelected
                      ? 'border-gold bg-gold/10 shadow-gold'
                      : 'hover:border-gold/40 hover:bg-gold/5'
                  )}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-background" />
                    </div>
                  )}
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        'w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300 shrink-0',
                        isSelected
                          ? 'bg-gold text-background'
                          : 'bg-gold/10 text-gold group-hover:bg-gold/20'
                      )}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
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
                </Card>
              </button>
            );
          })}
        </div>

        <div className="text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Button
            variant="solid"
            size="lg"
            rightIcon={ChevronRight}
            onClick={handleStart}
            disabled={selected.length === 0}
          >
            开始挑战
          </Button>
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
