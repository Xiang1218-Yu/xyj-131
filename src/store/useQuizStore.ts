import { create } from 'zustand';
import type { QuizCategory, QuizQuestion, QuizAnswer, QuizResult } from '@/types';
import { generateQuizQuestions } from '@/data/quizData';

interface QuizState {
  phase: 'select' | 'playing' | 'result';
  categories: QuizCategory[];
  questions: QuizQuestion[];
  currentIndex: number;
  answers: QuizAnswer[];
  startTime: number;
  questionStartTime: number;
  result: QuizResult | null;

  selectCategories: (cats: QuizCategory[]) => void;
  startQuiz: () => void;
  answerQuestion: (selectedIndex: number) => void;
  nextQuestion: () => void;
  finishQuiz: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  phase: 'select',
  categories: [],
  questions: [],
  currentIndex: 0,
  answers: [],
  startTime: 0,
  questionStartTime: 0,
  result: null,

  selectCategories: (cats) => set({ categories: cats }),

  startQuiz: () => {
    const { categories } = get();
    const questions = generateQuizQuestions(categories, 5);
    set({
      phase: 'playing',
      questions,
      currentIndex: 0,
      answers: [],
      startTime: Date.now(),
      questionStartTime: Date.now(),
      result: null,
    });
  },

  answerQuestion: (selectedIndex) => {
    const { questions, currentIndex, questionStartTime } = get();
    const q = questions[currentIndex];
    const timeSpent = Date.now() - questionStartTime;
    const isCorrect = selectedIndex === q.correctIndex;

    set(state => ({
      answers: [
        ...state.answers,
        { questionId: q.id, selectedIndex, isCorrect, timeSpent },
      ],
    }));
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({
        currentIndex: currentIndex + 1,
        questionStartTime: Date.now(),
      });
    }
  },

  finishQuiz: () => {
    const { categories, questions, answers, startTime } = get();
    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalTime = Date.now() - startTime;

    set({
      phase: 'result',
      result: {
        categories,
        totalQuestions: questions.length,
        correctCount,
        totalTime,
        answers,
        questions,
      },
    });
  },

  resetQuiz: () => set({
    phase: 'select',
    categories: [],
    questions: [],
    currentIndex: 0,
    answers: [],
    startTime: 0,
    questionStartTime: 0,
    result: null,
  }),
}));
