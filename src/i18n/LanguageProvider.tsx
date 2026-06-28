import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Direction, languageDirections, Language, TranslationKey, translations } from './translations';

const STORAGE_KEY = 'civilplanner-language';

interface LanguageContextValue {
  language: Language;
  direction: Direction;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'he';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'en' ? 'en' : 'he';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const direction = languageDirections[language];

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  };

  const toggleLanguage = () => {
    setLanguageState((current) => (current === 'he' ? 'en' : 'he'));
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    window.localStorage.setItem(STORAGE_KEY, language);
  }, [direction, language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    direction,
    setLanguage,
    toggleLanguage,
    t: (key) => translations[language][key] ?? translations.en[key],
  }), [direction, language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within LanguageProvider');
  }
  return context;
}

