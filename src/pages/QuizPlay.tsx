import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, CheckCircle, XCircle, Zap, ArrowRight } from 'lucide-react';
import { useQuizStore } from '@/store/useQuizStore';
import { categoryMeta } from '@/data/quizData';
import { cn } from '@/utils/cn';

export default function QuizPlay() {
  const navigate = useNavigate();
  const {
    questions,
    currentIndex,
    answers,
    startTime,
    answerQuestion,
    nextQuestion,
    finishQuiz,
  } = useQuizStore();

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const question = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const currentAnswer = isAnswered ? answers[currentIndex] : null;

  useEffect(() => {
    if (!questions.length) {
      navigate('/quiz');
      return;
    }
  }, [questions, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentIndex]);

  const handleSelect = useCallback((idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    answerQuestion(idx);
  }, [isAnswered, answerQuestion]);

  const handleNext = useCallback(() => {
    if (isLast) {
      finishQuiz();
      navigate('/quiz/result');
    } else {
      nextQuestion();
    }
  }, [isLast, finishQuiz, navigate, nextQuestion]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!question) return null;

  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="text-lg">{categoryMeta[question.category].icon}</span>
            <span className="font-display text-sm tracking-wider text-gold-muted">
              {categoryMeta[question.category].label}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-gold-muted">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-sm">{formatTime(elapsed)}</span>
            </div>
            <span className="font-display text-sm tracking-wider text-parchment">
              {currentIndex + 1} / {questions.length}
            </span>
          </div>
        </div>

        <div className="w-full h-1 bg-background-lighter rounded-full mb-10 overflow-hidden animate-fade-in">
          <div
            className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="animate-fade-in-up" key={currentIndex}>
          <div className="bg-background-light border border-gold/20 rounded-sm p-8 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-gold" />
              <span className="font-display text-xs tracking-widest text-gold-muted uppercase">
                第 {currentIndex + 1} 题
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl text-parchment leading-relaxed">
              {question.question}
            </h2>
          </div>

          <div className="grid gap-3 mb-8">
            {question.options.map((opt, idx) => {
              const isCorrect = idx === question.correctIndex;
              const isSelected = selectedOption === idx;
              const showCorrect = isAnswered && isCorrect;
              const showWrong = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={cn(
                    'group relative text-left p-5 border rounded-sm transition-all duration-300',
                    !isAnswered && 'hover:border-gold/50 hover:bg-gold/5 cursor-pointer',
                    showCorrect && 'border-emerald-500/50 bg-emerald-500/10',
                    showWrong && 'border-red-500/50 bg-red-500/10',
                    isAnswered && !isSelected && !isCorrect && 'border-gold/10 opacity-50',
                    !isAnswered && 'border-gold/20 bg-background-light'
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center text-sm font-display shrink-0 transition-all duration-300',
                        showCorrect && 'bg-emerald-500 text-white',
                        showWrong && 'bg-red-500 text-white',
                        !isAnswered && 'border border-gold/30 text-gold-muted group-hover:border-gold group-hover:text-gold',
                        isAnswered && !isSelected && !isCorrect && 'border border-gold/10 text-gold-muted/30'
                      )}
                    >
                      {showCorrect ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : showWrong ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </div>
                    <span
                      className={cn(
                        'font-body text-lg',
                        showCorrect && 'text-emerald-400',
                        showWrong && 'text-red-400',
                        !isAnswered && 'text-parchment group-hover:text-gold',
                        isAnswered && !isSelected && !isCorrect && 'text-gold-muted/30'
                      )}
                    >
                      {opt}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="animate-fade-in-up">
              <div className={cn(
                'p-5 border rounded-sm mb-6',
                currentAnswer?.isCorrect
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-red-500/30 bg-red-500/5'
              )}>
                <p className={cn(
                  'text-sm leading-relaxed',
                  currentAnswer?.isCorrect ? 'text-emerald-300' : 'text-red-300'
                )}>
                  {currentAnswer?.isCorrect ? '✓ 回答正确！' : '✗ 回答错误'}
                  <span className="text-parchment/60 ml-2">{question.explanation}</span>
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gold text-background font-display tracking-wider hover:bg-gold-light transition-all duration-300 rounded-sm shadow-gold"
                >
                  {isLast ? '查看结果' : '下一题'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 mt-12">
          {questions.map((_, idx) => {
            const answered = answers[idx];
            return (
              <div
                key={idx}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  idx === currentIndex && 'w-6 bg-gold',
                  idx !== currentIndex && answered?.isCorrect && 'bg-emerald-500',
                  idx !== currentIndex && answered && !answered.isCorrect && 'bg-red-500',
                  idx !== currentIndex && !answered && 'bg-gold/20'
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
