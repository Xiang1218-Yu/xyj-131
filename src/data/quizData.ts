import type { QuizCategory, QuizQuestion } from '@/types';
import { banknotes } from './banknotes';

const categoryMeta: Record<QuizCategory, { label: string; icon: string; color: string }> = {
  country: { label: '国家主题', icon: '🌍', color: 'emerald' },
  security: { label: '防伪知识', icon: '🔒', color: 'blue' },
  history: { label: '历史年代', icon: '📜', color: 'amber' },
  design: { label: '图案设计', icon: '🎨', color: 'rose' },
  material: { label: '材质工艺', icon: '🧪', color: 'violet' },
};

export { categoryMeta };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count);
}

function generateCountryQuestions(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const shuffled = shuffle(banknotes);

  for (const b of shuffled) {
    const wrongCountries = shuffle(
      banknotes
        .filter(x => x.country !== b.country)
        .map(x => x.country)
    ).slice(0, 3);
    if (wrongCountries.length < 3) continue;

    questions.push({
      id: `country-${b.id}-1`,
      category: 'country',
      question: `面值 ${b.denomination} ${b.currency} 的纸币由哪个国家发行？`,
      options: shuffle([b.country, ...wrongCountries]),
      correctIndex: 0,
      explanation: `${b.denomination} ${b.currency} 由${b.country}发行，正面图案为${b.obverseDesign}。`,
      banknoteId: b.id,
    });

    questions.push({
      id: `country-${b.id}-2`,
      category: 'country',
      question: `以下哪个国家发行的纸币正面图案包含"${b.obverseDesign.split('、')[0]}"？`,
      options: shuffle([b.country, ...wrongCountries]),
      correctIndex: 0,
      explanation: `${b.obverseDesign.split('、')[0]}出现在${b.country}的${b.denomination} ${b.currency}纸币上。`,
      banknoteId: b.id,
    });
  }

  return questions;
}

function generateSecurityQuestions(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const b of banknotes) {
    if (b.securityFeatures.length === 0) continue;

    const feature = b.securityFeatures[Math.floor(Math.random() * b.securityFeatures.length)];
    const wrongFeatures = shuffle(
      [
        '全息贴片', '水印', '安全线', '荧光特征', '盲文标记',
        '缩微文字', '凹版印刷', '隐形图案', '动感安全线', '变色油墨',
        '透明视窗', '3D安全条', '珠光油墨', '卫星全息图', '翠绿数字',
        '触感标记', '磁性特征', '红外特征',
      ].filter(f => !b.securityFeatures.includes(f))
    ).slice(0, 3);
    if (wrongFeatures.length < 3) continue;

    questions.push({
      id: `security-${b.id}-1`,
      category: 'security',
      question: `${b.country} ${b.denomination} ${b.currency} 纸币采用了以下哪种防伪技术？`,
      options: shuffle([feature, ...wrongFeatures]),
      correctIndex: 0,
      explanation: `${b.country} ${b.denomination} ${b.currency} 采用了${feature}等防伪技术，完整防伪特征包括：${b.securityFeatures.join('、')}。`,
      banknoteId: b.id,
    });

    questions.push({
      id: `security-${b.id}-2`,
      category: 'security',
      question: `"${feature}"是以下哪国纸币的防伪特征？`,
      options: shuffle([
        b.country,
        ...shuffle(banknotes.filter(x => x.country !== b.country).map(x => x.country)).slice(0, 3),
      ]),
      correctIndex: 0,
      explanation: `${feature}是${b.country} ${b.denomination} ${b.currency} 的防伪特征之一。`,
      banknoteId: b.id,
    });
  }

  return questions;
}

function generateHistoryQuestions(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const b of banknotes) {
    const decade = Math.floor(b.year / 10) * 10;
    const wrongDecades = shuffle(
      [1990, 2000, 2010, 2020, 1980, 1970, 1960, 1950, 1940, 1930]
        .filter(d => d !== decade)
    ).slice(0, 3);

    questions.push({
      id: `history-${b.id}-1`,
      category: 'history',
      question: `${b.country} ${b.denomination} ${b.currency} 纸币发行于哪一年？`,
      options: shuffle([
        String(b.year),
        ...wrongDecades.map(d => String(d + Math.floor(Math.random() * 9) + 1)).filter(y => y !== String(b.year)),
      ].slice(0, 4)),
      correctIndex: 0,
      explanation: `${b.country} ${b.denomination} ${b.currency} 发行于${b.year}年。${b.history.slice(0, 60)}...`,
      banknoteId: b.id,
    });

    questions.push({
      id: `history-${b.id}-2`,
      category: 'history',
      question: `以下哪个年代的纸币与${b.country} ${b.denomination} ${b.currency}（${b.year}年）属于同一时期？`,
      options: shuffle([`${decade}年代`, ...wrongDecades.map(d => `${d}年代`)]),
      correctIndex: 0,
      explanation: `${b.country} ${b.denomination} ${b.currency} 发行于${b.year}年，属于${decade}年代。`,
      banknoteId: b.id,
    });
  }

  return questions;
}

function generateDesignQuestions(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  for (const b of banknotes) {
    const reverseDesign = b.reverseDesign;
    const wrongDesigns = shuffle(
      banknotes.filter(x => x.id !== b.id).map(x => x.reverseDesign)
    ).slice(0, 3);
    if (wrongDesigns.length < 3) continue;

    questions.push({
      id: `design-${b.id}-1`,
      category: 'design',
      question: `${b.country} ${b.denomination} ${b.currency} 纸币的背面图案是什么？`,
      options: shuffle([reverseDesign, ...wrongDesigns]),
      correctIndex: 0,
      explanation: `${b.country} ${b.denomination} ${b.currency} 背面图案为${reverseDesign}，正面图案为${b.obverseDesign}。`,
      banknoteId: b.id,
    });

    const mainColor = b.mainColor;
    const wrongColors = shuffle(
      banknotes.filter(x => x.mainColor !== mainColor).map(x => x.mainColor)
    ).slice(0, 3);
    if (wrongColors.length < 3) continue;

    questions.push({
      id: `design-${b.id}-2`,
      category: 'design',
      question: `${b.country} ${b.denomination} ${b.currency} 纸币的主色调是什么？`,
      options: shuffle([mainColor, ...wrongColors]),
      correctIndex: 0,
      explanation: `${b.country} ${b.denomination} ${b.currency} 的主色调为${mainColor}。`,
      banknoteId: b.id,
    });
  }

  return questions;
}

function generateMaterialQuestions(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  const materialSet = [...new Set(banknotes.map(b => b.material))];

  for (const b of banknotes) {
    const wrongMaterials = shuffle(
      materialSet.filter(m => m !== b.material)
    ).slice(0, 3);
    if (wrongMaterials.length < 3) continue;

    questions.push({
      id: `material-${b.id}-1`,
      category: 'material',
      question: `${b.country} ${b.denomination} ${b.currency} 纸币使用什么材质？`,
      options: shuffle([b.material, ...wrongMaterials]),
      correctIndex: 0,
      explanation: `${b.country} ${b.denomination} ${b.currency} 使用${b.material}材质，尺寸为${b.dimensions}。`,
      banknoteId: b.id,
    });

    const polymerCountries = banknotes.filter(x => x.material === '聚合物').map(x => x.country);
    const isPolymer = b.material === '聚合物';

    if (isPolymer && polymerCountries.length > 1) {
      const nonPolymerCountries = shuffle(
        banknotes.filter(x => x.material !== '聚合物').map(x => x.country)
      ).slice(0, 3);
      if (nonPolymerCountries.length >= 1) {
        questions.push({
          id: `material-${b.id}-2`,
          category: 'material',
          question: `以下哪个国家使用了聚合物（塑料）材质印制纸币？`,
          options: shuffle([b.country, ...nonPolymerCountries.slice(0, 3)]),
          correctIndex: 0,
          explanation: `${b.country}的${b.denomination} ${b.currency} 使用了先进的聚合物材质，具有更长的使用寿命和更强的防伪性能。`,
          banknoteId: b.id,
        });
      }
    }
  }

  return questions;
}

const generators: Record<QuizCategory, () => QuizQuestion[]> = {
  country: generateCountryQuestions,
  security: generateSecurityQuestions,
  history: generateHistoryQuestions,
  design: generateDesignQuestions,
  material: generateMaterialQuestions,
};

export function generateQuizQuestions(
  categories: QuizCategory[],
  perCategory: number = 5
): QuizQuestion[] {
  const all: QuizQuestion[] = [];

  for (const cat of categories) {
    const gen = generators[cat]();
    const selected = pickRandom(gen, perCategory);
    all.push(...selected.map(q => {
      const correctOpt = q.options[q.correctIndex];
      const shuffledOptions = shuffle(q.options);
      return {
        ...q,
        options: shuffledOptions,
        correctIndex: shuffledOptions.indexOf(correctOpt),
      };
    }));
  }

  return shuffle(all);
}
