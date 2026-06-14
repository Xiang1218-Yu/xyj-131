import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Target, Timer, RotateCcw, ChevronRight, Home, CheckCircle, XCircle, Brain } from 'lucide-react';
import { useQuizStore } from '@/store/useQuizStore';
import { categoryMeta } from '@/data/quizData';
import { cn } from '@/utils/cn';

export default function QuizResult() {
  const navigate = useNavigate();
  const { result, resetQuiz } = useQuizStore();

  useEffect(() => {
    if (!result) navigate('/quiz');
  }, [result, navigate]);

  if (!result) return null;

  const accuracy = Math.round((result.correctCount / result.totalQuestions) * 100);
  const totalSec = Math.floor(result.totalTime / 1000);
  const avgTime = Math.floor(totalSec / result.totalQuestions);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;

  const getGrade = () => {
    if (accuracy >= 90) return { label: '纸币大师', emoji: '🏆', color: 'text-gold' };
    if (accuracy >= 70) return { label: '鉴赏专家', emoji: '🌟', color: 'text-emerald-400' };
    if (accuracy >= 50) return { label: '收藏新手', emoji: '📚', color: 'text-blue-400' };
    return { label: '初学探索者', emoji: '🔍', color: 'text-gold-muted' };
  };

  const grade = getGrade();

  const categoryStats = result.categories.map(cat => {
    const catQuestions = result.questions.filter(q => q.category === cat);
    const catAnswers = result.answers.filter(a =>
      catQuestions.some(q => q.id === a.questionId)
    );
    return {
      category: cat,
      total: catQuestions.length,
      correct: catAnswers.filter(a => a.isCorrect).length,
    };
  });

  const handleRetry = () => {
    resetQuiz();
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-gold/30 rounded-full mb-6">
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-gold text-sm font-display tracking-wider">答题完成</span>
          </div>
          <div className="text-7xl mb-4">{grade.emoji}</div>
          <h1 className={cn('section-title mb-2', grade.color)}>{grade.label}</h1>
          <p className="section-subtitle">
            你已完成本次纸币知识挑战
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-background-light border border-gold/20 rounded-sm p-6 text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Target className="w-8 h-8 text-gold mx-auto mb-3" />
            <div className="font-display text-4xl text-gold mb-1">{accuracy}%</div>
            <div className="text-gold-muted text-sm font-display tracking-wider">正确率</div>
            <div className="text-parchment/50 text-xs mt-1">{result.correctCount} / {result.totalQuestions} 题</div>
          </div>

          <div className="bg-background-light border border-gold/20 rounded-sm p-6 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Timer className="w-8 h-8 text-gold mx-auto mb-3" />
            <div className="font-display text-4xl text-gold mb-1">
              {m > 0 ? `${m}分${s}秒` : `${s}秒`}
            </div>
            <div className="text-gold-muted text-sm font-display tracking-wider">总用时</div>
            <div className="text-parchment/50 text-xs mt-1">平均 {avgTime} 秒/题</div>
          </div>

          <div className="bg-background-light border border-gold/20 rounded-sm p-6 text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Brain className="w-8 h-8 text-gold mx-auto mb-3" />
            <div className="font-display text-4xl text-gold mb-1">{result.categories.length}</div>
            <div className="text-gold-muted text-sm font-display tracking-wider">答题类型</div>
            <div className="text-parchment/50 text-xs mt-1">
              {result.categories.map(c => categoryMeta[c].label).join(' · ')}
            </div>
          </div>
        </div>

        <div className="bg-background-light border border-gold/20 rounded-sm p-6 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-display text-lg text-parchment tracking-wider mb-6">各类型表现</h3>
          <div className="grid gap-4">
            {categoryStats.map(stat => {
              const meta = categoryMeta[stat.category];
              const ratio = stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0;
              return (
                <div key={stat.category} className="flex items-center gap-4">
                  <span className="text-lg w-6 text-center">{meta.icon}</span>
                  <span className="font-display text-sm text-parchment tracking-wider w-20">
                    {meta.label}
                  </span>
                  <div className="flex-1 h-3 bg-background rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-1000',
                        ratio >= 80 ? 'bg-emerald-500' : ratio >= 50 ? 'bg-gold' : 'bg-red-500'
                      )}
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                  <span className={cn(
                    'font-display text-sm w-16 text-right',
                    ratio >= 80 ? 'text-emerald-400' : ratio >= 50 ? 'text-gold' : 'text-red-400'
                  )}>
                    {stat.correct}/{stat.total}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <h3 className="font-display text-lg text-parchment tracking-wider mb-6 text-center">答题详情</h3>
          <div className="grid gap-3">
            {result.questions.map((q, idx) => {
              const answer = result.answers[idx];
              if (!answer) return null;
              return (
                <div
                  key={q.id}
                  className={cn(
                    'flex items-start gap-4 p-4 border rounded-sm',
                    answer.isCorrect
                      ? 'border-emerald-500/20 bg-emerald-500/5'
                      : 'border-red-500/20 bg-red-500/5'
                  )}
                >
                  <div className="mt-0.5">
                    {answer.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-parchment text-sm mb-1">{q.question}</p>
                    {!answer.isCorrect && (
                      <p className="text-xs text-gold-muted">
                        你的答案：{q.options[answer.selectedIndex]} · 正确答案：{q.options[q.correctIndex]}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gold-muted/50 font-mono shrink-0">
                    {(answer.timeSpent / 1000).toFixed(1)}s
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gold/30 text-gold font-display tracking-wider hover:bg-gold/10 transition-all duration-300 rounded-sm"
          >
            <RotateCcw className="w-4 h-4" />
            再来一局
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-background font-display tracking-wider hover:bg-gold-light transition-all duration-300 rounded-sm shadow-gold"
          >
            <Home className="w-4 h-4" />
            返回首页
          </button>
          <button
            onClick={() => navigate('/timeline')}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gold/30 text-gold font-display tracking-wider hover:bg-gold/10 transition-all duration-300 rounded-sm"
          >
            时间轴
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
