import { Language } from './translations';

interface RuleText {
  name: string;
  description: string;
  categoryDescription?: string;
}

const localizedRules: Record<Language, Record<string, RuleText>> = {
  he: {
    '1': {
      name: 'שטח חלונות מינימלי',
      description: 'בדיקת שטח חלונות כולל ביחס לשטח החדר לפי סוג החדר.',
      categoryDescription: 'תכנון ובניה',
    },
    '2': {
      name: 'מידות פתח יציאה',
      description: 'בדיקת רוחב וגובה דלת יציאה חיצונית מזוהה.',
      categoryDescription: 'תכנון ובניה',
    },
    '3': {
      name: 'גובה חדרים עיקריים',
      description: 'בדיקת גובה מינימלי בחדרי מגורים, מטבח וחללים עיקריים.',
      categoryDescription: 'תכנון ובניה',
    },
    '4': {
      name: 'שטח ורוחב חדרים',
      description: 'בדיקת שטח מינימלי ורוחב נקי לפי סוג החדר.',
      categoryDescription: 'תכנון ובניה',
    },
    '5': {
      name: 'גובה חדרי שירות וסניטריה',
      description: 'בדיקת גובה מינימלי בחדרי רחצה, שירותים, שירות ומעברים.',
      categoryDescription: 'תכנון ובניה',
    },
    '6': {
      name: 'גובה מעקות',
      description: 'בדיקת גובה מינימלי באלמנטים מסוג IfcRailing.',
      categoryDescription: 'נגישות ובטיחות',
    },
    '7': {
      name: 'רוחב כבש נגיש',
      description: 'בדיקת רוחב כבש מינימלי בין מעקים או ספים.',
      categoryDescription: 'נגישות',
    },
    '8': {
      name: 'שיפוע והפרש גובה בכבש',
      description: 'בדיקת שיפוע מרבי והפרש גובה מרבי במהלך כבש.',
      categoryDescription: 'נגישות',
    },
  },
  en: {},
};

const categoryLabels: Record<Language, Record<string, string>> = {
  he: {
    '0010': 'תכנון ובניה',
    '0020': 'חשמל',
    accessibility: 'נגישות',
    safety: 'בטיחות',
    general: 'כללי',
  },
  en: {
    '0010': 'Planning and building',
    '0020': 'Electrical',
    accessibility: 'Accessibility',
    safety: 'Safety',
    general: 'General',
  },
};

export function getRuleText(language: Language, codeNum: string): RuleText | undefined {
  return localizedRules[language][String(codeNum)];
}

export function getCategoryLabel(language: Language, category: string, fallback?: string) {
  return categoryLabels[language][category] ?? fallback ?? category;
}

